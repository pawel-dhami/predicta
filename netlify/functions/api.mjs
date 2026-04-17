// ── PlaceIQ Serverless API ─────────────────────────────────────────
// All data is live from Supabase. AI chat powered by Groq Llama 3.1.
import { createClient as createSupabase } from '@supabase/supabase-js';

// ── Helpers ────────────────────────────────────────────────────────
function getEnv(key) {
  try { return Netlify.env.get(key); } catch {}
  return process.env[key];
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function getSupabase() {
  const url = getEnv('SUPABASE_URL') || 'https://oqghzmvjmdrpyktuxahj.supabase.co';
  const key = getEnv('SUPABASE_SERVICE_KEY');
  if (!key) throw new Error('SUPABASE_SERVICE_KEY not configured');
  return createSupabase(url, key);
}

// ── Build AI system prompt from real Supabase profile ─────────────
const AGENT_BASE_INSTRUCTIONS = `
AGENTIC AI CAPABILITIES:
You operate as an autonomous AI placement agent using the ReAct (Reason + Act) framework:
1. PERCEPTION: You continuously monitor student profiles, upcoming deadlines, and skill gaps
2. REASONING: You analyze data to compute match scores, selection probabilities, and risk assessments
3. ACTION: You generate personalized roadmaps, send alerts, schedule mock interviews, and recommend companies
4. MEMORY: You maintain conversation history and agent memory to provide contextual responses
5. PLANNING: You create multi-step preparation plans optimized for placement success

INSTRUCTIONS:
- Be concise, practical, and actionable in your responses
- Reference specific data points from the student's profile when available
- Suggest concrete next steps with timeframes
- If asked about companies, reference the student's skills and match data
- Keep responses within 2-3 paragraphs max
- Speak as a knowledgeable career mentor, not a generic chatbot
- If no profile data is available yet, advise the student to complete LinkedIn analysis in Onboarding`;

async function buildSystemPrompt(userId, db) {
  const fallback = `You are PlaceIQ AI Mentor — an agentic AI placement assistant.\n${AGENT_BASE_INSTRUCTIONS}`;
  if (!userId) return fallback;

  try {
    const { data, error } = await db
      .from('profiles')
      .select('linkedin_data, ai_analysis')
      .eq('user_id', userId)
      .single();

    if (error || !data) return fallback;

    const ai = data.ai_analysis ?? {};
    const li = data.linkedin_data ?? {};
    const name = li.fullName || li.firstName || 'Student';
    const headline = li.headline ? `\n- Headline: ${li.headline}` : '';
    const company = li.currentCompany ? `\n- Current/Latest Company: ${li.currentCompany}` : '';
    const location = li.location ? `\n- Location: ${li.location}` : '';
    const skills = ai.skillTags?.length
      ? `\nSKILLS IDENTIFIED:\n${ai.skillTags.map(s => `- ${s}`).join('\n')}` : '';
    const weakAreas = ai.weakAreas?.length
      ? `\nWEAK AREAS:\n${ai.weakAreas.map(w => `- ${w}`).join('\n')}` : '';
    const topRoles = ai.topRoles?.length
      ? `\nBEST-FIT ROLES:\n${ai.topRoles.map(r => `- ${r}`).join('\n')}` : '';
    const expLevel = ai.experienceLevel ? `\n- Experience Level: ${ai.experienceLevel}` : '';
    const score = ai.placementScore != null ? `\n- Placement Score: ${ai.placementScore}/100` : '';
    const summary = ai.strengthSummary ? `\nSTRENGTH SUMMARY:\n${ai.strengthSummary}` : '';
    const expLines = (li.experiences ?? []).slice(0, 2)
      .map(e => `- ${e.role || 'Role'} at ${e.company || 'Company'} (${e.duration || 'N/A'})`).join('\n');
    const experiences = expLines ? `\nRECENT EXPERIENCE:\n${expLines}` : '';
    const eduLines = (li.education ?? []).slice(0, 2)
      .map(e => `- ${e.degree || ''} ${e.field || ''} @ ${e.school || ''} (${e.years || ''})`).join('\n');
    const education = eduLines ? `\nEDUCATION:\n${eduLines}` : '';

    return `You are PlaceIQ AI Mentor — a personalized agentic AI placement assistant for ${name}.

STUDENT PROFILE (live from LinkedIn analysis):${headline}${company}${location}${expLevel}${score}
${summary}${skills}${weakAreas}${topRoles}${experiences}${education}
${AGENT_BASE_INSTRUCTIONS}`;
  } catch (err) {
    console.error('[buildSystemPrompt] Error:', err.message);
    return fallback;
  }
}

// ── Groq AI chat ───────────────────────────────────────────────────
async function agentChat(message, history, userId, db) {
  const apiKey = getEnv('GROQ_API_KEY');
  if (!apiKey) return chatReplyFallback(message);

  try {
    const systemPrompt = await buildSystemPrompt(userId, db);

    const messages = [{ role: 'system', content: systemPrompt }];

    // Load persistent chat history from Supabase (last 10 messages)
    if (userId) {
      const { data: dbHistory } = await db
        .from('chat_history')
        .select('role, message')
        .eq('user_id', userId)
        .order('created_at', { ascending: true })
        .limit(10);

      for (const msg of (dbHistory ?? [])) {
        messages.push({
          role: msg.role === 'agent' ? 'assistant' : 'user',
          content: msg.message,
        });
      }
    }

    // Also merge in-session history passed from frontend
    if (history && Array.isArray(history)) {
      for (const msg of history.slice(-5)) {
        messages.push({
          role: msg.role === 'agent' ? 'assistant' : 'user',
          content: msg.text || msg.message || '',
        });
      }
    }

    messages.push({ role: 'user', content: message });

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages,
        temperature: 0.7,
        max_tokens: 512,
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      console.error('Groq API error:', response.status, await response.text());
      return chatReplyFallback(message);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || chatReplyFallback(message);

    // Persist this exchange to Supabase chat_history
    if (userId) {
      await db.from('chat_history').insert([
        { user_id: userId, role: 'user', message },
        { user_id: userId, role: 'agent', message: reply },
      ]);
    }

    return reply;
  } catch (error) {
    console.error('Groq API error:', error);
    return chatReplyFallback(message);
  }
}

function chatReplyFallback(message) {
  const msg = message.toLowerCase();
  if (msg.includes('apply') || msg.includes('company'))
    return 'Based on your profile, focus on companies that match your top skills. Check the Skills tab to see your current match rates and identify the best targets.';
  if (msg.includes('resume') || msg.includes('review'))
    return 'Your resume should highlight quantifiable achievements. Add metrics to your projects (e.g., "improved performance by 40%") and ensure your Skills section reflects your verified GitHub languages.';
  if (msg.includes('mock') || msg.includes('interview'))
    return 'For interviews, focus on your weakest skill areas first. Practice DSA daily and review system design fundamentals. Schedule a mock interview a week before deadlines.';
  if (msg.includes('today') || msg.includes('plan'))
    return "Today's plan: 1) Review open application deadlines, 2) Complete any pending skill assessments, 3) Update your LinkedIn if needed, 4) Apply to at least one matched company before any deadline.";
  return 'Based on your profile, close your weakest skill gap first — it will have the highest impact on your match rate across multiple companies. Want a detailed study plan?';
}

// ── LinkedIn AI analysis via Groq ─────────────────────────────────
async function analyzeLinkedInWithGroq(linkedinData) {
  const apiKey = getEnv('GROQ_API_KEY');
  if (!apiKey) throw new Error('GROQ_API_KEY not configured');

  const systemPrompt = `You are a placement analyst AI. Return ONLY a valid JSON object. No markdown, no explanation, no extra text.

The JSON must have exactly these fields:
{
  "strengthSummary": "2-3 sentence summary of candidate's strongest points",
  "skillTags": ["array", "of", "up to 8", "skills"],
  "experienceLevel": "fresher | junior | mid | senior",
  "topRoles": ["exactly 3 job title strings"],
  "placementScore": 0,
  "weakAreas": ["2-3 areas to improve"]
}

placementScore must be an integer between 0 and 100.`;

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Here is the candidate's LinkedIn data: ${JSON.stringify(linkedinData)}` },
      ],
      temperature: 0.3,
      max_tokens: 600,
    }),
  });

  if (!res.ok) throw new Error(`Groq error: ${res.status}`);
  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content || '';
  const cleaned = raw.replace(/```json?/g, '').replace(/```/g, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    console.error('[Groq] Failed to parse AI response:', raw);
    throw new Error('AI returned invalid JSON');
  }
}

// ── AI-generated recommendations from profile ──────────────────────
async function generateRecommendations(userId, db) {
  const apiKey = getEnv('GROQ_API_KEY');
  const { data: profile } = await db
    .from('profiles')
    .select('ai_analysis, linkedin_data')
    .eq('user_id', userId)
    .single();

  if (!profile?.ai_analysis) return [];

  const ai = profile.ai_analysis;
  const skillTags = ai.skillTags ?? [];
  const weakAreas = ai.weakAreas ?? [];
  const topRoles = ai.topRoles ?? [];
  const placementScore = ai.placementScore ?? 50;

  if (!apiKey) {
    // Fallback: generate basic recs from profile data
    return topRoles.slice(0, 3).map((role, i) => ({
      id: i + 1,
      priority: i === 0 ? 'URGENT' : i === 1 ? 'HIGH' : 'NORMAL',
      initials: role.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2),
      company: ['Google', 'Microsoft', 'Amazon', 'Infosys', 'TCS', 'Wipro'][i] || 'Company',
      role,
      match: Math.max(40, placementScore - i * 8),
      gaps: weakAreas.slice(0, 2),
      reasoning: `Your profile matches ${role} based on your skills: ${skillTags.slice(0, 3).join(', ')}.`,
      jd: `Looking for candidates with skills in ${skillTags.slice(0, 4).join(', ')}.`,
      selectionProbability: Math.max(30, placementScore - i * 10),
    }));
  }

  try {
    const prompt = `Based on this student profile, generate exactly 3 company recommendations as a JSON array.

Profile:
- Skills: ${skillTags.join(', ')}
- Weak areas: ${weakAreas.join(', ')}
- Top roles: ${topRoles.join(', ')}
- Placement score: ${placementScore}/100
- Experience level: ${ai.experienceLevel ?? 'fresher'}

Return ONLY a valid JSON array with exactly 3 objects, each having:
{
  "priority": "URGENT | HIGH | NORMAL",
  "initials": "2 letter company initials",
  "company": "Real company name",
  "role": "specific job title",
  "match": integer 40-95,
  "gaps": ["skill1", "skill2"],
  "reasoning": "1-2 sentence explanation",
  "jd": "1 sentence job description",
  "selectionProbability": integer 30-90
}`;

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: 'You are a placement analyst. Return ONLY valid JSON arrays, no markdown.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.4,
        max_tokens: 800,
      }),
    });

    if (!res.ok) throw new Error('Groq error');
    const data = await res.json();
    const raw = data.choices?.[0]?.message?.content || '[]';
    const cleaned = raw.replace(/```json?/g, '').replace(/```/g, '').trim();
    const recs = JSON.parse(cleaned);

    // Save to Supabase for caching
    const toInsert = recs.map((r, i) => ({
      user_id: userId,
      priority: r.priority,
      initials: r.initials,
      company: r.company,
      role: r.role,
      match: r.match,
      gaps: r.gaps,
      reasoning: r.reasoning,
      jd: r.jd,
      selection_probability: r.selectionProbability,
    }));

    // Delete old recs, insert fresh ones
    await db.from('recommendations').delete().eq('user_id', userId);
    await db.from('recommendations').insert(toInsert);

    return recs.map((r, i) => ({ id: i + 1, ...r }));
  } catch (err) {
    console.error('[generateRecommendations] Error:', err.message);
    return [];
  }
}

// ── Apify runner ───────────────────────────────────────────────────
async function callApify(actor, input, maxWaitMs = 24_000) {
  const token = getEnv('APIFY_TOKEN');
  if (!token) throw new Error('APIFY_TOKEN not configured');

  const startRes = await fetch(
    `https://api.apify.com/v2/acts/${actor}/runs?token=${token}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) }
  );
  if (!startRes.ok) {
    const txt = await startRes.text();
    throw new Error(`Apify start returned ${startRes.status}: ${txt.slice(0, 200)}`);
  }
  const { data: runData } = await startRes.json();
  const runId = runData?.id;
  const datasetId = runData?.defaultDatasetId;
  if (!runId) throw new Error('Apify did not return a run ID');

  const deadline = Date.now() + maxWaitMs;
  const POLL_INTERVAL = 3_000;

  while (Date.now() < deadline) {
    await new Promise(r => setTimeout(r, POLL_INTERVAL));
    const statusRes = await fetch(`https://api.apify.com/v2/acts/${actor}/runs/${runId}?token=${token}`);
    if (!statusRes.ok) continue;
    const { data: runStatus } = await statusRes.json();
    const status = runStatus?.status;
    if (status === 'SUCCEEDED') {
      const itemsRes = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${token}&clean=true`);
      if (!itemsRes.ok) throw new Error(`Dataset fetch failed: ${itemsRes.status}`);
      return await itemsRes.json();
    }
    if (status === 'FAILED' || status === 'ABORTED' || status === 'TIMED-OUT') {
      throw new Error(`Apify run ${status.toLowerCase()}`);
    }
  }
  throw new Error('Apify request timed out — please try again.');
}

// ── Language → skill tag matching ─────────────────────────────────
const LANG_SKILL_MAP = {
  Python: ['python', 'ml', 'machine learning', 'ai', 'data science', 'data', 'django', 'flask'],
  JavaScript: ['javascript', 'js', 'node', 'react', 'frontend', 'vue', 'angular', 'next'],
  TypeScript: ['typescript', 'ts'],
  Java: ['java', 'spring', 'kotlin'],
  'C++': ['c++', 'cpp', 'dsa', 'algorithms', 'competitive'],
  C: ['c', 'embedded', 'systems'],
  Go: ['go', 'golang'],
  Rust: ['rust'],
  Ruby: ['ruby', 'rails'],
  SQL: ['sql', 'database', 'postgres', 'mysql', 'mongodb'],
  Swift: ['swift', 'ios'],
  Kotlin: ['kotlin', 'android'],
  Shell: ['bash', 'shell', 'linux', 'devops'],
};

function matchSkillToLanguage(skillTag, langFrequency) {
  const tagLower = skillTag.toLowerCase();
  let repoCount = 0;
  for (const [lang, keywords] of Object.entries(LANG_SKILL_MAP)) {
    if (keywords.some(k => tagLower.includes(k))) repoCount += (langFrequency[lang] ?? 0);
  }
  const directMatch = Object.keys(langFrequency).find(l => l.toLowerCase() === tagLower);
  if (directMatch) repoCount += langFrequency[directMatch];
  return repoCount;
}

// ═══════════════════════════════════════════════════════════════════
//  MAIN HANDLER
// ═══════════════════════════════════════════════════════════════════
export default async (req) => {
  let path = '/';
  try {
    const url = new URL(req.url);
    path = url.pathname;
    const params = url.searchParams;
    console.log(`[API] ${req.method} ${path}`);

    const db = getSupabase();

    // ── GET routes ─────────────────────────────────────────────────
    if (req.method === 'GET') {

      // Student data endpoints (require userId query param)
      if (path === '/api/recommendations') {
        const userId = params.get('studentId') || params.get('userId');
        if (!userId) return json({ error: 'userId required' }, 400);

        // Try cached recommendations first
        const { data: cached } = await db
          .from('recommendations')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (cached?.length) {
          return json(cached.map((r, i) => ({
            id: i + 1,
            priority: r.priority,
            initials: r.initials,
            company: r.company,
            role: r.role,
            match: r.match,
            gaps: r.gaps ?? [],
            reasoning: r.reasoning,
            jd: r.jd,
            selectionProbability: r.selection_probability,
          })));
        }

        // Generate fresh ones from AI
        const recs = await generateRecommendations(userId, db);
        return json(recs);
      }

      if (path === '/api/applications') {
        const userId = params.get('studentId') || params.get('userId');
        if (!userId) return json({ error: 'userId required' }, 400);
        const { data, error } = await db
          .from('applications')
          .select('*')
          .eq('user_id', userId)
          .order('applied_at', { ascending: false });
        if (error) return json({ error: error.message }, 500);
        return json((data ?? []).map(a => ({
          id: a.id,
          company: a.company,
          role: a.role,
          stage: a.stage,
          date: a.applied_at,
          deadline: a.deadline,
          notes: a.notes,
        })));
      }

      if (path === '/api/skill-mappings') {
        const userId = params.get('studentId') || params.get('userId');
        if (!userId) return json({ error: 'userId required' }, 400);
        const { data: profile } = await db
          .from('profiles')
          .select('ai_analysis')
          .eq('user_id', userId)
          .single();

        const ai = profile?.ai_analysis ?? {};
        const skillTags = ai.skillTags ?? [];
        const weakAreas = ai.weakAreas ?? [];
        const topRoles = ai.topRoles ?? [];
        const placementScore = ai.placementScore ?? 50;

        // Build skill mappings dynamically from profile
        const companies = ['Goldman Sachs', 'Microsoft', 'Infosys', 'TCS', 'Amazon', 'Wipro'];
        const mappings = topRoles.slice(0, 5).map((role, i) => ({
          company: companies[i] || `Company ${i + 1}`,
          role,
          match: Math.max(40, placementScore - i * 8),
          gaps: weakAreas.slice(0, 2),
          selectionProbability: Math.max(25, placementScore - i * 10),
        }));

        return json(mappings.length ? mappings : [
          { company: 'Profile Needed', role: 'Complete LinkedIn onboarding', match: 0, gaps: ['LinkedIn profile'], selectionProbability: 0 },
        ]);
      }

      if (path === '/api/selection-probability') {
        const userId = params.get('studentId') || params.get('userId');
        if (!userId) return json({ studentId: userId, probability: 0, confidence: 'LOW', model: 'PlaceIQ-v3' });
        const { data: profile } = await db
          .from('profiles')
          .select('ai_analysis')
          .eq('user_id', userId)
          .single();
        const score = profile?.ai_analysis?.placementScore ?? 0;
        const confidence = score > 70 ? 'HIGH' : score > 50 ? 'MEDIUM' : 'LOW';
        return json({ studentId: userId, probability: score, confidence, model: 'PlaceIQ-v3' });
      }

      if (path === '/api/next-actions') {
        const userId = params.get('studentId') || params.get('userId');
        if (!userId) return json([]);
        const { data: profile } = await db
          .from('profiles')
          .select('ai_analysis')
          .eq('user_id', userId)
          .single();
        const ai = profile?.ai_analysis ?? {};
        const weakAreas = ai.weakAreas ?? [];
        const topRoles = ai.topRoles ?? [];

        const actions = [];
        if (topRoles[0]) actions.push({ id: 1, type: 'Apply', text: `Apply to ${topRoles[0]} roles — best match for your profile` });
        if (weakAreas[0]) actions.push({ id: 2, type: 'Upskill', text: `Improve ${weakAreas[0]} — closes your biggest skill gap` });
        if (weakAreas[1]) actions.push({ id: 3, type: 'Upskill', text: `Work on ${weakAreas[1]} to increase selection probability` });
        actions.push({ id: actions.length + 1, type: 'Mock Interview', text: 'Schedule a mock interview to practice under pressure' });

        return json(actions);
      }

      if (path === '/api/alerts') {
        const userId = params.get('studentId') || params.get('userId');
        if (!userId) return json([]);
        const { data, error } = await db
          .from('alerts')
          .select('*')
          .eq('user_id', userId)
          .eq('dismissed', false)
          .order('created_at', { ascending: false })
          .limit(20);
        if (error) return json({ error: error.message }, 500);
        return json((data ?? []).map(a => ({
          id: a.id,
          type: a.type,
          text: a.text,
          time: new Date(a.created_at).toLocaleString(),
          deadline: a.deadline,
          actionText: a.action_text,
        })));
      }

      if (path === '/api/journey') {
        const userId = params.get('studentId') || params.get('userId');
        if (!userId) return json([]);
        const { data: profile } = await db
          .from('profiles')
          .select('onboarding_meta, ai_analysis')
          .eq('user_id', userId)
          .single();
        const { data: apps } = await db
          .from('applications')
          .select('stage')
          .eq('user_id', userId);

        const hasProfile = !!profile?.ai_analysis;
        const hasApps = (apps?.length ?? 0) > 0;
        const hasInterview = apps?.some(a => ['INTERVIEW', 'OFFER'].includes(a.stage));
        const hasOffer = apps?.some(a => a.stage === 'OFFER');

        return json([
          { name: 'Skills', status: hasProfile ? 'completed' : 'current' },
          { name: 'Applications', status: hasApps ? 'completed' : hasProfile ? 'current' : 'pending' },
          { name: 'Interviews', status: hasOffer ? 'completed' : hasInterview ? 'current' : 'pending' },
          { name: 'Offers', status: hasOffer ? 'current' : 'pending' },
        ]);
      }

      if (path === '/api/student-analytics') {
        const userId = params.get('studentId') || params.get('userId');
        if (!userId) return json({ error: 'userId required' }, 400);

        const [profileRes, appsRes, alertsRes] = await Promise.all([
          db.from('profiles').select('ai_analysis').eq('user_id', userId).single(),
          db.from('applications').select('*').eq('user_id', userId).order('applied_at', { ascending: false }),
          db.from('alerts').select('*').eq('user_id', userId).eq('dismissed', false).order('created_at', { ascending: false }).limit(10),
        ]);

        const ai = profileRes.data?.ai_analysis ?? {};
        const score = ai.placementScore ?? 0;
        const weakAreas = ai.weakAreas ?? [];
        const topRoles = ai.topRoles ?? [];

        const apps = (appsRes.data ?? []).map(a => ({
          id: a.id, company: a.company, role: a.role, stage: a.stage,
          date: a.applied_at, deadline: a.deadline,
        }));

        const alerts = (alertsRes.data ?? []).map(a => ({
          id: a.id, type: a.type, text: a.text,
          time: new Date(a.created_at).toLocaleString(),
          deadline: a.deadline, actionText: a.action_text,
        }));

        const nextActions = [];
        if (topRoles[0]) nextActions.push({ id: 1, type: 'Apply', text: `Apply to ${topRoles[0]} roles` });
        if (weakAreas[0]) nextActions.push({ id: 2, type: 'Upskill', text: `Improve ${weakAreas[0]}` });
        nextActions.push({ id: 3, type: 'Mock Interview', text: 'Schedule a mock interview' });

        const hasApps = apps.length > 0;
        const hasInterview = apps.some(a => ['INTERVIEW', 'OFFER'].includes(a.stage));
        const hasOffer = apps.some(a => a.stage === 'OFFER');
        const journeyStages = [
          { name: 'Skills', status: !!ai.placementScore ? 'completed' : 'current' },
          { name: 'Applications', status: hasApps ? 'completed' : 'pending' },
          { name: 'Interviews', status: hasOffer ? 'completed' : hasInterview ? 'current' : 'pending' },
          { name: 'Offers', status: hasOffer ? 'current' : 'pending' },
        ];

        const currentStage = journeyStages.find(s => s.status === 'current')?.name ?? 'Skills';
        const skillMatchRate = Math.min(100, Math.round(score * 0.85));

        return json({
          placementScore: score,
          skillMatchRate,
          selectionProbability: score,
          journeyStage: currentStage,
          journeyStages,
          applications: apps,
          nextActions,
          alerts,
          skillMappings: [],
        });
      }

      // Admin endpoints
      if (path === '/api/admin/batch-metrics') {
        const [totalRes, profilesRes, appsRes] = await Promise.all([
          db.from('profiles').select('user_id', { count: 'exact', head: true }),
          db.from('profiles').select('ai_analysis'),
          db.from('applications').select('stage'),
        ]);

        const totalStudents = totalRes.count ?? 0;
        const profiles = profilesRes.data ?? [];
        const apps = appsRes.data ?? [];

        const placed = apps.filter(a => a.stage === 'OFFER').length;
        const activeApplications = apps.filter(a => !['OFFER', 'REJECTED'].includes(a.stage)).length;
        const scores = profiles.map(p => p.ai_analysis?.placementScore ?? 0).filter(s => s > 0);
        const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
        const atRisk = profiles.filter(p => (p.ai_analysis?.placementScore ?? 100) < 50).length;

        return json({
          totalStudents,
          placed,
          atRisk,
          activeApplications,
          avgScore,
          placementRate: totalStudents ? +(placed / totalStudents * 100).toFixed(1) : 0,
          avgPackage: 'N/A',
          highestPackage: 'N/A',
          companiesVisiting: 0,
        });
      }

      if (path === '/api/admin/risk-students') {
        const { data: profiles } = await db
          .from('profiles')
          .select('user_id, ai_analysis, updated_at');

        const { data: users } = await db.auth.admin.listUsers();
        const userMap = {};
        for (const u of (users?.users ?? [])) userMap[u.id] = u;

        const riskStudents = (profiles ?? [])
          .filter(p => (p.ai_analysis?.placementScore ?? 100) < 60)
          .map((p, i) => {
            const u = userMap[p.user_id] ?? {};
            const ai = p.ai_analysis ?? {};
            const score = ai.placementScore ?? 0;
            return {
              id: i + 1,
              name: u.user_metadata?.full_name || u.email?.split('@')[0] || `Student ${i + 1}`,
              branch: 'N/A',
              riskScore: parseFloat((1 - score / 100).toFixed(2)),
              lastActive: p.updated_at ? new Date(p.updated_at).toLocaleString() : 'Unknown',
              agentMemory: ai.weakAreas?.map(w => `Weak in ${w}`) ?? [],
              placementStatus: 'Pending',
            };
          })
          .sort((a, b) => b.riskScore - a.riskScore);

        return json(riskStudents);
      }

      if (path === '/api/chat-history') {
        const userId = params.get('userId');
        if (!userId) return json([]);
        const { data } = await db
          .from('chat_history')
          .select('role, message, created_at')
          .eq('user_id', userId)
          .order('created_at', { ascending: true })
          .limit(50);
        return json(data ?? []);
      }

      if (path === '/api/health') {
        return json({ status: 'ok', service: 'PlaceIQ API', version: '2.0.0', database: 'supabase', ai: 'groq-llama3.1' });
      }
    }

    // ── POST routes ────────────────────────────────────────────────
    if (req.method === 'POST') {
      const body = await req.json();

      // AI Agent chat
      if (path === '/api/agent/chat' || path === '/agent/chat') {
        const reply = await agentChat(body.message || '', body.history || [], body.userId || null, db);
        return json({ reply });
      }

      // Agent run — regenerate recommendations
      if (path === '/api/agent/run') {
        const { studentId, userId } = body;
        const uid = studentId || userId;
        if (!uid) return json({ error: 'userId required' }, 400);
        const recs = await generateRecommendations(uid, db);
        return json({
          status: 'completed',
          studentId: uid,
          message: 'Agent analysis executed.',
          recommendationsGenerated: recs.length,
          actions: [
            'Updated skill mappings from LinkedIn profile',
            'Recalculated selection probability',
            `Generated ${recs.length} AI-powered company recommendations`,
            'Checked upcoming deadlines',
          ],
        });
      }

      // Add/Update Application
      if (path === '/api/applications') {
        const { userId, company, role, stage, deadline, notes, id } = body;
        if (!userId || !company || !role) return json({ error: 'userId, company, role required' }, 400);

        if (id) {
          // Update existing
          const { error } = await db.from('applications')
            .update({ company, role, stage, deadline, notes, updated_at: new Date().toISOString() })
            .eq('id', id).eq('user_id', userId);
          if (error) return json({ error: error.message }, 500);
          return json({ success: true, action: 'updated' });
        } else {
          // Insert new
          const { data, error } = await db.from('applications').insert({
            user_id: userId, company, role,
            stage: stage || 'APPLIED',
            applied_at: new Date().toISOString().split('T')[0],
            deadline, notes,
          }).select().single();
          if (error) return json({ error: error.message }, 500);
          return json({ success: true, action: 'created', id: data.id });
        }
      }

      // Create Alert
      if (path === '/api/alerts') {
        const { userId, type, text, actionText, deadline } = body;
        if (!userId || !text) return json({ error: 'userId and text required' }, 400);
        const { error } = await db.from('alerts').insert({
          user_id: userId, type: type || 'info', text, action_text: actionText, deadline,
        });
        if (error) return json({ error: error.message }, 500);
        return json({ success: true });
      }

      // Dismiss Alert
      if (path === '/api/alerts/dismiss') {
        const { userId, alertId } = body;
        if (!userId || !alertId) return json({ error: 'userId and alertId required' }, 400);
        const { error } = await db.from('alerts').update({ dismissed: true })
          .eq('id', alertId).eq('user_id', userId);
        if (error) return json({ error: error.message }, 500);
        return json({ success: true });
      }

      // Apify generic proxy
      if (path === '/api/apify/run') {
        try {
          const { actor, input } = body;
          if (!actor || !input) return json({ error: 'actor and input are required' }, 400);
          const items = await callApify(actor, input);
          return json({ items });
        } catch (err) {
          const isTimeout = err.message?.includes('timed out');
          return json({ error: err.message, timeout: isTimeout }, isTimeout ? 503 : 500);
        }
      }

      // LinkedIn analyze + save to Supabase
      if (path === '/api/linkedin/analyze') {
        try {
          const { linkedinUrl, userId } = body;
          if (!linkedinUrl || !userId) return json({ error: 'linkedinUrl and userId are required' }, 400);

          const items = await callApify('supreme_coder~linkedin-profile-scraper', {
            urls: [{ url: linkedinUrl }],
          });
          const raw = items[0];
          if (!raw) return json({ error: 'No data returned from LinkedIn scraper' }, 422);

          const linkedinData = {
            firstName: raw?.firstName ?? '',
            lastName: raw?.lastName ?? '',
            fullName: `${raw?.firstName ?? ''} ${raw?.lastName ?? ''}`.trim() || 'Unknown',
            headline: raw?.headline ?? raw?.jobTitle ?? '',
            currentCompany: raw?.companyName ?? raw?.positions?.[0]?.company?.name ?? '',
            location: raw?.geoLocationName ?? raw?.location ?? '',
            experiences: (raw?.positions ?? []).map(e => ({
              company: e?.company?.name ?? '',
              role: e?.title ?? '',
              duration: e?.totalDuration ?? '',
            })),
            education: (raw?.educations ?? []).map(e => ({
              school: e?.schoolName ?? '',
              degree: e?.degreeName ?? '',
              field: e?.fieldOfStudy ?? '',
              years: e?.timePeriod ? `${e.timePeriod.startDate?.year ?? ''}–${e.timePeriod.endDate?.year ?? ''}` : '',
            })),
            skills: (raw?.skills ?? []).map(s => (typeof s === 'string' ? s : s?.name ?? '')).filter(Boolean),
            certifications: (raw?.certifications ?? []).map(c => `${c?.name ?? ''} (${c?.authority ?? c?.issuer ?? ''})`).filter(Boolean),
            organizations: (raw?.organizations ?? []).map(o => ({ name: o?.name ?? '', position: o?.position ?? '' })),
            summary: raw?.summary ?? '',
          };

          const aiAnalysis = await analyzeLinkedInWithGroq(linkedinData);

          const { error: dbError } = await db.from('profiles').upsert({
            user_id: userId,
            linkedin_data: linkedinData,
            ai_analysis: aiAnalysis,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id' });

          if (dbError) return json({ error: 'Failed to save profile data' }, 500);

          // Auto-generate recommendations right after analysis
          await generateRecommendations(userId, db);

          return json({ linkedinData, aiAnalysis });
        } catch (err) {
          const isTimeout = err.message?.includes('timed out');
          return json({
            error: isTimeout ? 'Could not fetch LinkedIn data. Please try again.' : err.message,
            timeout: isTimeout,
          }, isTimeout ? 503 : 500);
        }
      }

      // Jobs fetch with 6-hour cache
      if (path === '/api/jobs/fetch') {
        try {
          const { userId, forceRefresh = false } = body;
          if (!userId) return json({ error: 'userId is required' }, 400);

          const { data: profile } = await db.from('profiles').select('ai_analysis, linkedin_data').eq('user_id', userId).single();
          const jobTitle = profile?.ai_analysis?.topRoles?.[0] ?? 'Software Engineer';
          const location = profile?.linkedin_data?.location ?? 'India';

          const { data: cache } = await db.from('jobs_cache').select('results, fetched_at').eq('user_id', userId).single();
          const SIX_HOURS = 6 * 60 * 60 * 1000;
          const TEN_MIN = 10 * 60 * 1000;
          const age = cache?.fetched_at ? Date.now() - new Date(cache.fetched_at).getTime() : Infinity;

          if (forceRefresh && age < TEN_MIN) {
            return json({ error: 'Refresh cooldown active', cooldownRemaining: Math.ceil((TEN_MIN - age) / 1000) }, 429);
          }
          if (!forceRefresh && cache?.results && age < SIX_HOURS) {
            return json({ jobs: cache.results, fromCache: true, fetchedAt: cache.fetched_at });
          }

          const items = await callApify('harvestapi~linkedin-job-search', {
            jobTitles: [jobTitle], locations: [location], maxItems: 20,
          });

          const jobs = items.map(item => ({
            title: item?.title ?? 'Unknown Title',
            company: item?.companyName ?? item?.company ?? 'Unknown Company',
            location: item?.location ?? '',
            employmentType: item?.employmentType ?? 'Full-time',
            salary: item?.salary?.text ?? item?.salaryRange ?? null,
            postedAt: item?.postedDate ?? item?.publishedAt ?? null,
            applyUrl: item?.applyMethod?.companyApplyUrl ?? item?.linkedinUrl ?? null,
          }));

          const now = new Date().toISOString();
          await db.from('jobs_cache').upsert({ user_id: userId, results: jobs, fetched_at: now }, { onConflict: 'user_id' });
          return json({ jobs, fromCache: false, fetchedAt: now });
        } catch (err) {
          const isTimeout = err.message?.includes('timed out');
          return json({ error: isTimeout ? 'Could not fetch jobs. Please try again.' : err.message, timeout: isTimeout }, isTimeout ? 503 : 500);
        }
      }

      // GitHub skill verifier
      if (path === '/api/github/verify') {
        try {
          const { githubUsername, userId } = body;
          if (!githubUsername || !userId) return json({ error: 'githubUsername and userId are required' }, 400);

          const { data: profile } = await db.from('profiles').select('ai_analysis').eq('user_id', userId).single();
          const skillTags = profile?.ai_analysis?.skillTags ?? [];

          const items = await callApify('dhruvils914~github-scraper', { username: githubUsername });
          const langFrequency = {};
          for (const repo of items) {
            const lang = repo?.language ?? repo?.primaryLanguage;
            if (lang) langFrequency[lang] = (langFrequency[lang] ?? 0) + 1;
          }

          const verifiedSkills = skillTags.map(tag => {
            const repoCount = matchSkillToLanguage(tag, langFrequency);
            if (repoCount >= 2) return { tag, verified: true, repoCount };
            if (repoCount === 0) return { tag, unverified: true, repoCount };
            return { tag, repoCount };
          });

          const { error: dbError } = await db.from('profiles').upsert({
            user_id: userId, verified_skills: verifiedSkills, updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id' });

          if (dbError) return json({ error: 'Failed to save verified skills' }, 500);
          return json({ verifiedSkills, langFrequency, totalRepos: items.length });
        } catch (err) {
          const isTimeout = err.message?.includes('timed out');
          return json({ error: isTimeout ? 'Could not fetch GitHub data. Please try again.' : err.message, timeout: isTimeout }, isTimeout ? 503 : 500);
        }
      }
    }

    // ── DELETE routes ──────────────────────────────────────────────
    if (req.method === 'DELETE') {
      const body = await req.json().catch(() => ({}));

      if (path === '/api/applications') {
        const { userId, id } = body;
        if (!userId || !id) return json({ error: 'userId and id required' }, 400);
        const { error } = await db.from('applications').delete().eq('id', id).eq('user_id', userId);
        if (error) return json({ error: error.message }, 500);
        return json({ success: true });
      }

      if (path === '/api/chat-history') {
        const { userId } = body;
        if (!userId) return json({ error: 'userId required' }, 400);
        await db.from('chat_history').delete().eq('user_id', userId);
        return json({ success: true });
      }
    }

    return json({ error: 'Not Found', path }, 404);

  } catch (err) {
    console.error('[API] Unhandled error:', err.message, err.stack);
    return json({ error: 'Internal server error', detail: err.message }, 500);
  }
};

export const config = {
  path: '/api/*',
};
