/**
 * linkedin-analyze-background.mjs
 *
 * Netlify Background Function (v1 handler format) — runs up to 15 minutes.
 * Named with `-background` suffix → Netlify automatically treats it as a background function.
 *
 * Flow:
 *   1. Client POSTs → gets 202 immediately
 *   2. Background: Apify scrape → Groq AI → Supabase upsert
 *   3. Frontend polls profiles table every 5s until ai_analysis appears
 */

import { createClient } from '@supabase/supabase-js';

// ── Supabase ─────────────────────────────────────────────────────────
function getSupabase() {
  const url = process.env.SUPABASE_URL || 'https://oqghzmvjmdrpyktuxahj.supabase.co';
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!key) throw new Error('SUPABASE_SERVICE_KEY not set');
  return createClient(url, key);
}

function normalizeLinkedInUrl(rawUrl) {
  let url = String(rawUrl || '').trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }
  url = url.replace(/^http:\/\//, 'https://').replace(/\/+$/, '');

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error('Invalid LinkedIn URL');
  }

  if (!parsed.hostname.includes('linkedin.com')) {
    throw new Error('URL must be a linkedin.com profile');
  }

  const path = parsed.pathname.toLowerCase();
  if (!path.startsWith('/in/')) {
    throw new Error('LinkedIn URL must be a public profile URL like linkedin.com/in/username');
  }

  return parsed.toString().replace(/\/+$/, '');
}

function extractBasicProfileFromUrl(linkedinUrl) {
  try {
    const { pathname } = new URL(linkedinUrl);
    const slug = pathname.split('/').filter(Boolean)[1] || '';
    const prettyName = slug
      .replace(/[-_]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, c => c.toUpperCase());

    return {
      fullName: prettyName || '',
      profileSlug: slug || '',
      profileUrl: linkedinUrl,
      source: 'linkedin_url_only',
    };
  } catch {
    return {
      fullName: '',
      profileSlug: '',
      profileUrl: linkedinUrl,
      source: 'linkedin_url_only',
    };
  }
}

// ── Apify: start run + poll until SUCCEEDED ───────────────────────────
async function callApifyAsync(actor, input, maxWaitMs = 600_000) {
  const token = process.env.APIFY_TOKEN;
  if (!token) throw new Error('APIFY_TOKEN not set');

  console.log(`[BG] Starting Apify actor: ${actor}`);
  console.log(`[BG] Input: ${JSON.stringify(input)}`);

  const startRes = await fetch(
    `https://api.apify.com/v2/acts/${actor}/runs?token=${token}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }
  );
  if (!startRes.ok) {
    const txt = await startRes.text();
    throw new Error(`Apify start failed ${startRes.status}: ${txt.slice(0, 300)}`);
  }
  const startBody = await startRes.json();
  const runData   = startBody.data;
  const runId     = runData?.id;
  const datasetId = runData?.defaultDatasetId;
  if (!runId) throw new Error(`Apify did not return a run ID. Response: ${JSON.stringify(startBody).slice(0, 200)}`);
  console.log(`[BG] Apify run started: ${runId} | dataset: ${datasetId}`);

  const deadline = Date.now() + maxWaitMs;
  while (Date.now() < deadline) {
    await new Promise(r => setTimeout(r, 8_000));
    const statusRes = await fetch(
      `https://api.apify.com/v2/acts/${actor}/runs/${runId}?token=${token}`
    );
    if (!statusRes.ok) { console.log('[BG] Status poll failed, retrying...'); continue; }
    const { data: st } = await statusRes.json();
    console.log(`[BG] Apify status: ${st?.status}`);

    if (st?.status === 'SUCCEEDED') {
      const itemsRes = await fetch(
        `https://api.apify.com/v2/datasets/${datasetId}/items?token=${token}&clean=true&limit=1`
      );
      if (!itemsRes.ok) throw new Error(`Dataset fetch failed: ${itemsRes.status}`);
      const items = await itemsRes.json();
      console.log(`[BG] Dataset returned ${items.length} item(s)`);
      return items;
    }
    if (['FAILED', 'ABORTED', 'TIMED-OUT'].includes(st?.status)) {
      throw new Error(`Apify run ${st.status}: ${st?.statusMessage ?? ''}`);
    }
  }
  throw new Error('Apify poll timeout after 10 minutes');
}

// ── Groq: AI analysis ─────────────────────────────────────────────────
async function analyzeWithGroq(linkedinData) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY not set');

  const systemPrompt = `You are an expert career placement analyst for a student placement platform. Analyze the candidate's LinkedIn profile data and return a JSON object with accurate, personalized insights.

CRITICAL: Return ONLY a valid JSON object. No markdown fences, no explanation text, just the raw JSON.

JSON schema (fill ALL fields accurately based on the actual profile data):
{
  "strengthSummary": "2-3 specific sentences about THIS candidate's actual strongest points. Reference their real skills, education, certifications, or organizations. Do NOT give generic praise.",
  "skillTags": ["EXACTLY 6 to 8 skills — no more — pick the most technical and marketable from their actual list"],
  "experienceLevel": "one of: fresher | junior | mid | senior",
  "topRoles": ["3 specific job titles that genuinely match their background — not generic titles"],
  "placementScore": 72,
  "weakAreas": ["2-3 specific, actionable gaps based on what is actually missing from their profile"]
}

SCORING RUBRIC for placementScore (integer 0–100):
- Start at 50 base for any active student/candidate
- +5 if they have relevant technical skills (programming, tools, frameworks)
- +5 if they have 10+ skills listed
- +5 if they have 20+ skills listed
- +5 for each certification (max +10)
- +5 if they have work experience / internships (positions)
- +5 if they have relevant organizations or leadership roles
- +5 if their headline clearly describes a technical focus
- +5 if education is in a relevant technical field (CS, Engineering, etc.)
- +5 if they have a meaningful summary written
- -10 if no skills at all
- -5 if no certifications and no experience
- Final score must be an integer between 40 and 95

experienceLevel rules:
- "fresher" = student (even if pre-enrollment), 0-1 year experience, no full-time positions
- "junior" = 1-2 years experience OR recent graduate with verified internship
- "mid" = 3-5 years or 2+ substantive roles
- "senior" = 6+ years or lead/principal roles
NOTE: If education start year is in the future or they are currently a student with no positions, they are ALWAYS "fresher".

topRoles: Must be based on the candidate's ACTUAL skills and background. For a CS student with Python/Automation skills, suggest roles like "Python Developer", "Automation Engineer", "Backend Developer". Do NOT suggest "Project Manager" or "Marketing Analyst" for a technical CS profile.

skillTags: Pick EXACTLY 6-8 skills from their actual LinkedIn skills list. Prefer specific technical/hard skills (Python, HTML, Arduino IDE, Git) over generic soft skills (Critical Thinking, Communication, Leadership).`;

  const userMessage = `Analyze this LinkedIn profile and return the JSON:

Name: ${linkedinData.fullName}
Headline: ${linkedinData.headline}
Location: ${linkedinData.location}
Education: ${linkedinData.education.map(e => `${e.degree} in ${e.field} at ${e.school} (${e.years})`).join('; ') || 'Not listed'}
Work Experience: ${linkedinData.experiences.length > 0 ? linkedinData.experiences.map(e => `${e.role} at ${e.company} (${e.duration})`).join('; ') : 'None listed'}
Organizations: ${linkedinData.organizations.length > 0 ? linkedinData.organizations.map(o => `${o.position} at ${o.name}`).join('; ') : 'None'}
Certifications: ${linkedinData.certifications.length > 0 ? linkedinData.certifications.join(', ') : 'None'}
Skills (${linkedinData.skills.length} total): ${linkedinData.skills.slice(0, 30).join(', ')}
Summary: ${linkedinData.summary || 'Not provided'}`;

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userMessage  },
      ],
      temperature: 0.2,
      max_tokens: 800,
    }),
  });


  if (!res.ok) throw new Error(`Groq error: ${res.status}`);
  const data    = await res.json();
  const rawText = data.choices?.[0]?.message?.content || '';
  const cleaned = rawText.replace(/```json?/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleaned);
}

// ── Main handler (v1 format) ──────────────────────────────────────────
export const handler = async (event) => {
  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  let { linkedinUrl, userId } = body;
  if (!linkedinUrl || !userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'linkedinUrl and userId are required' }),
    };
  }

  // Normalize URL — ensure it has https:// and is a valid linkedin.com URL
  linkedinUrl = normalizeLinkedInUrl(linkedinUrl);
  console.log(`[BG] Normalized URL: ${linkedinUrl}`);


  const db = getSupabase();

  // Mark profile as "analyzing" immediately so frontend shows spinner
  await db.from('profiles').upsert({
    user_id:         userId,
    onboarding_meta: { analyzing: true, startedAt: new Date().toISOString() },
    updated_at:      new Date().toISOString(),
  }, { onConflict: 'user_id' });

  try {
    // 1. Scrape LinkedIn — try multiple actors with different input formats
    console.log(`[BG] Scraping: ${linkedinUrl}`);

    // Actor 1: supreme_coder - uses profileUrls input format
    // Actor 2: bebity - well-known scraper with profileUrls format
    // Actor 3: harvestapi - fallback
    const actors = [
      {
        id: process.env.APIFY_ACTOR || 'supreme_coder~linkedin-profile-scraper',
        inputs: [
          { profileUrls: [linkedinUrl] },
          { urls: [linkedinUrl] },
          { urls: [{ url: linkedinUrl }] },
        ],
      },
      {
        id: 'bebity~linkedin-profile-scraper',
        inputs: [
          { profileUrls: [linkedinUrl] },
          { urls: [linkedinUrl] },
          { profileUrls: [{ url: linkedinUrl }] },
        ],
      },
      {
        id: process.env.APIFY_ACTOR2 || 'harvestapi~linkedin-profile-scraper',
        inputs: [
          { urls: [{ url: linkedinUrl }] },
          { urls: [linkedinUrl] },
          { profileUrls: [linkedinUrl] },
        ],
      },
    ];

    let items = null;
    let usedActor = null;
    let lastError = null;

    for (const actor of actors) {
      try {
        for (const input of actor.inputs) {
          console.log(`[BG] Trying actor: ${actor.id} with input keys: ${Object.keys(input).join(', ')}`);
          items = await callApifyAsync(actor.id, input, 300_000); // 5 min per attempt
          // Check for quota/error in dataset item
          if (items?.[0]?.error && Object.keys(items[0]).length <= 2) {
            const errMsg = String(items[0].error);
            if (errMsg.includes('hard limit') || errMsg.includes('free user') || errMsg.includes('paid')) {
              throw new Error('quota: ' + errMsg);
            }
            throw new Error('scraper_error: ' + errMsg);
          }
          if (items?.length > 0) {
            usedActor = actor.id;
            break;
          }
        }
        if (items?.length > 0) break;
      } catch (err) {
        console.log(`[BG] Actor ${actor.id} failed: ${err.message}`);
        lastError = err;
      }
    }

    if (!items || items.length === 0) {
      throw lastError || new Error('All LinkedIn scrapers failed — profile may be private or URL incorrect');
    }


    console.log(`[BG] Used actor: ${usedActor}`);
    const raw = items[0];
    console.log('[BG] Raw keys:', Object.keys(raw || {}).join(', '));
    if (!raw) throw new Error('No data returned from LinkedIn scraper');

    // Detect Apify quota/error response — actor returns {error: "..."} as dataset item
    if (raw.error && Object.keys(raw).length === 1) {
      const errMsg = String(raw.error);
      if (errMsg.includes('hard limit') || errMsg.includes('free user') || errMsg.includes('paid')) {
        throw new Error('LinkedIn scraper quota exceeded on both actors. Please try again tomorrow.');
      }
      throw new Error(`LinkedIn scraper error: ${errMsg.slice(0, 150)}`);
    }


    // 2. Extract fields — handles both supreme_coder and harvestapi schemas
    // supreme_coder uses: experience[], education[], location
    // harvestapi uses: positions[], educations[], geoLocationName
    console.log('[BG] Raw top-level keys:', Object.keys(raw || {}).slice(0, 30).join(', '));

    // Experiences: supreme_coder → raw.experience, harvestapi → raw.positions
    const rawExperiences = raw?.experience ?? raw?.positions ?? [];
    // Education: supreme_coder → raw.education, harvestapi → raw.educations
    const rawEducation   = raw?.education  ?? raw?.educations  ?? [];
    // Skills: both use raw.skills (array of strings or {name})
    const rawSkills      = raw?.skills ?? [];

    const linkedinData = {
      firstName:      raw?.firstName      ?? '',
      lastName:       raw?.lastName       ?? '',
      fullName:       (raw?.fullName
                      ?? `${raw?.firstName ?? ''} ${raw?.lastName ?? ''}`.trim())
                      || raw?.name || 'Unknown',
      headline:       raw?.headline ?? raw?.occupation ?? raw?.jobTitle ?? '',
      currentCompany: raw?.companyName
                      ?? raw?.company
                      ?? rawExperiences?.[0]?.company?.name
                      ?? rawExperiences?.[0]?.companyName
                      ?? '',
      location:       raw?.location ?? raw?.geoLocationName ?? raw?.addressWithCountry ?? '',
      experiences: rawExperiences.map(e => ({
        company:  e?.company?.name ?? e?.companyName ?? e?.company ?? '',
        role:     e?.title ?? e?.role ?? '',
        duration: e?.totalDuration
                  ?? (e?.timePeriod
                    ? `${e.timePeriod.startDate?.year ?? ''}–${e.timePeriod.endDate?.year ?? 'Present'}`
                    : e?.dateRange ?? ''),
      })),
      education: rawEducation.map(e => ({
        school: e?.schoolName ?? e?.school ?? e?.institution ?? '',
        degree: e?.degreeName ?? e?.degree ?? '',
        field:  e?.fieldOfStudy ?? e?.field ?? '',
        years:  e?.timePeriod
          ? `${e.timePeriod.startDate?.year ?? ''}–${e.timePeriod.endDate?.year ?? ''}`
          : (e?.startDate && e?.endDate ? `${e.startDate}–${e.endDate}` : ''),
      })),
      skills: rawSkills
        .map(s => (typeof s === 'string' ? s : (s?.name ?? s?.displayName ?? '')))
        .filter(Boolean),
      certifications: (raw?.certifications ?? raw?.licenses ?? []).map(c =>
        `${c?.name ?? ''} (${c?.authority ?? c?.issuer ?? c?.issuingOrganization ?? ''})`.replace(' ()', '')
      ).filter(Boolean),
      organizations: (raw?.organizations ?? raw?.volunteerExperiences ?? []).map(o => ({
        name:        o?.name ?? o?.organization ?? '',
        position:    o?.position ?? o?.role ?? '',
        description: o?.description ?? '',
      })),
      summary: raw?.summary ?? raw?.about ?? '',
    };

    // 3. Groq AI analysis
    console.log('[BG] Running Groq analysis...');
    const aiAnalysis = await analyzeWithGroq(linkedinData);
    console.log('[BG] Groq done:', JSON.stringify(aiAnalysis).slice(0, 150));

    // 4. Save to Supabase
    const { error: dbError } = await db.from('profiles').upsert({
      user_id:         userId,
      linkedin_data:   linkedinData,
      ai_analysis:     aiAnalysis,
      onboarding_meta: { analyzing: false, completedAt: new Date().toISOString() },
      updated_at:      new Date().toISOString(),
    }, { onConflict: 'user_id' });

    if (dbError) {
      console.error('[BG] Supabase error:', JSON.stringify(dbError));
    } else {
      console.log('[BG] Profile saved for user:', userId);
    }
  } catch (err) {
    console.error('[BG] Fatal error:', err.message);
    await db.from('profiles').upsert({
      user_id:         userId,
      linkedin_data:   extractBasicProfileFromUrl(linkedinUrl),
      ai_analysis:     null,
      onboarding_meta: {
        analyzing: false,
        error: err.message,
        canAnalyzeLater: true,
        lastAttemptedUrl: linkedinUrl,
      },
      updated_at:      new Date().toISOString(),
    }, { onConflict: 'user_id' });
  }
};
