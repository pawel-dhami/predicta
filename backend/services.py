"""
services.py — Apify, Groq AI, and skill-matching utilities.
Ported from api.mjs + linkedin-analyze-background.mjs into Python.
"""
import os
import re
import json
import asyncio
from typing import Optional
from urllib.parse import urlparse

import httpx

GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions'
GROQ_MODEL = 'llama-3.1-8b-instant'

# ── Language → skill tag matching ────────────────────────────────────
LANG_SKILL_MAP = {
    'Python': ['python', 'ml', 'machine learning', 'ai', 'data science', 'data', 'django', 'flask'],
    'JavaScript': ['javascript', 'js', 'node', 'react', 'frontend', 'vue', 'angular', 'next'],
    'TypeScript': ['typescript', 'ts'],
    'Java': ['java', 'spring', 'kotlin'],
    'C++': ['c++', 'cpp', 'dsa', 'algorithms', 'competitive'],
    'C': ['c', 'embedded', 'systems'],
    'Go': ['go', 'golang'],
    'Rust': ['rust'],
    'Ruby': ['ruby', 'rails'],
    'SQL': ['sql', 'database', 'postgres', 'mysql', 'mongodb'],
    'Swift': ['swift', 'ios'],
    'Kotlin': ['kotlin', 'android'],
    'Shell': ['bash', 'shell', 'linux', 'devops'],
}


def match_skill_to_language(skill_tag: str, lang_frequency: dict) -> int:
    tag_lower = skill_tag.lower()
    repo_count = 0
    for lang, keywords in LANG_SKILL_MAP.items():
        if any(k in tag_lower for k in keywords):
            repo_count += lang_frequency.get(lang, 0)
    direct = next((l for l in lang_frequency if l.lower() == tag_lower), None)
    if direct:
        repo_count += lang_frequency[direct]
    return repo_count


# ── Apify runner ─────────────────────────────────────────────────────

async def call_apify(actor: str, input_data: dict, max_wait_ms: int = 24_000) -> list:
    token = os.getenv('APIFY_TOKEN')
    if not token:
        raise RuntimeError('APIFY_TOKEN not configured')

    async with httpx.AsyncClient(timeout=60.0) as client:
        start_res = await client.post(
            f'https://api.apify.com/v2/acts/{actor}/runs?token={token}',
            json=input_data,
        )
        if start_res.status_code != 201:
            raise RuntimeError(f'Apify start returned {start_res.status_code}: {start_res.text[:200]}')

        run_data = start_res.json().get('data', {})
        run_id = run_data.get('id')
        dataset_id = run_data.get('defaultDatasetId')
        if not run_id:
            raise RuntimeError('Apify did not return a run ID')

        deadline = asyncio.get_event_loop().time() + max_wait_ms / 1000
        while asyncio.get_event_loop().time() < deadline:
            await asyncio.sleep(3)
            status_res = await client.get(
                f'https://api.apify.com/v2/acts/{actor}/runs/{run_id}?token={token}'
            )
            if status_res.status_code != 200:
                continue
            status = status_res.json().get('data', {}).get('status')
            if status == 'SUCCEEDED':
                items_res = await client.get(
                    f'https://api.apify.com/v2/datasets/{dataset_id}/items?token={token}&clean=true'
                )
                if items_res.status_code != 200:
                    raise RuntimeError(f'Dataset fetch failed: {items_res.status_code}')
                return items_res.json()
            if status in ('FAILED', 'ABORTED', 'TIMED-OUT'):
                raise RuntimeError(f'Apify run {status.lower()}')

        raise RuntimeError('Apify request timed out')


async def call_apify_async(actor: str, input_data: dict, max_wait_ms: int = 300_000) -> list:
    """Long-running version for background tasks (up to 5 min per attempt)."""
    token = os.getenv('APIFY_TOKEN')
    if not token:
        raise RuntimeError('APIFY_TOKEN not set')

    async with httpx.AsyncClient(timeout=60.0) as client:
        start_res = await client.post(
            f'https://api.apify.com/v2/acts/{actor}/runs?token={token}',
            json=input_data,
        )
        if start_res.status_code != 201:
            raise RuntimeError(f'Apify start failed {start_res.status_code}: {start_res.text[:300]}')

        run_data = start_res.json().get('data', {})
        run_id = run_data.get('id')
        dataset_id = run_data.get('defaultDatasetId')
        if not run_id:
            raise RuntimeError('Apify did not return a run ID')

        deadline = asyncio.get_event_loop().time() + max_wait_ms / 1000
        while asyncio.get_event_loop().time() < deadline:
            await asyncio.sleep(8)
            status_res = await client.get(
                f'https://api.apify.com/v2/acts/{actor}/runs/{run_id}?token={token}'
            )
            if status_res.status_code != 200:
                continue
            st = status_res.json().get('data', {})
            if st.get('status') == 'SUCCEEDED':
                items_res = await client.get(
                    f'https://api.apify.com/v2/datasets/{dataset_id}/items?token={token}&clean=true&limit=1'
                )
                if items_res.status_code != 200:
                    raise RuntimeError(f'Dataset fetch failed: {items_res.status_code}')
                return items_res.json()
            if st.get('status') in ('FAILED', 'ABORTED', 'TIMED-OUT'):
                raise RuntimeError(f"Apify run {st['status']}: {st.get('statusMessage', '')}")

        raise RuntimeError('Apify poll timeout')


# ── Groq AI helpers ──────────────────────────────────────────────────

async def call_groq(messages: list, temperature: float = 0.7, max_tokens: int = 512) -> Optional[str]:
    api_key = os.getenv('GROQ_API_KEY')
    if not api_key:
        return None
    async with httpx.AsyncClient(timeout=30.0) as client:
        res = await client.post(
            GROQ_ENDPOINT,
            headers={'Authorization': f'Bearer {api_key}', 'Content-Type': 'application/json'},
            json={'model': GROQ_MODEL, 'messages': messages, 'temperature': temperature, 'max_tokens': max_tokens},
        )
        res.raise_for_status()
        return res.json()['choices'][0]['message']['content']


def chat_fallback(message: str) -> str:
    msg = message.lower()
    if 'apply' in msg or 'company' in msg:
        return 'Based on your profile, focus on companies that match your top skills. Check the Skills tab to see your current match rates and identify the best targets.'
    if 'resume' in msg or 'review' in msg:
        return 'Your resume should highlight quantifiable achievements. Add metrics to your projects and ensure your Skills section reflects your verified GitHub languages.'
    if 'mock' in msg or 'interview' in msg:
        return 'For interviews, focus on your weakest skill areas first. Practice DSA daily and review system design fundamentals. Schedule a mock interview a week before deadlines.'
    if 'today' in msg or 'plan' in msg:
        return "Today's plan: 1) Review open deadlines, 2) Complete pending skill assessments, 3) Apply to at least one matched company."
    return 'Close your weakest skill gap first — it will have the highest impact on your match rate across multiple companies. Want a detailed study plan?'


async def analyze_linkedin_with_groq(linkedin_data: dict) -> dict:
    """Ported from api.mjs analyzeLinkedInWithGroq + background.mjs analyzeWithGroq."""
    api_key = os.getenv('GROQ_API_KEY')
    if not api_key:
        raise RuntimeError('GROQ_API_KEY not configured')

    system_prompt = """You are an expert career placement analyst. Analyze the candidate's LinkedIn profile and return ONLY a valid JSON object. No markdown, no explanation.

JSON schema:
{
  "strengthSummary": "2-3 specific sentences about THIS candidate's actual strongest points",
  "skillTags": ["EXACTLY 6-8 skills from their actual profile"],
  "experienceLevel": "fresher | junior | mid | senior",
  "topRoles": ["3 specific job titles matching their background"],
  "placementScore": 72,
  "weakAreas": ["2-3 specific actionable gaps"]
}

SCORING (integer 0-100): Start 50, +5 relevant tech skills, +5 for 10+ skills, +5 for 20+ skills,
+5 per certification (max +10), +5 work experience, +5 leadership, +5 technical headline,
+5 relevant education, +5 meaningful summary. -10 no skills, -5 no certs+no experience.
Final must be 40-95."""

    edu_str = '; '.join(
        f"{e.get('degree','')} in {e.get('field','')} at {e.get('school','')} ({e.get('years','')})"
        for e in linkedin_data.get('education', [])
    ) or 'Not listed'
    exp_str = '; '.join(
        f"{e.get('role','')} at {e.get('company','')} ({e.get('duration','')})"
        for e in linkedin_data.get('experiences', [])
    ) or 'None listed'
    org_str = '; '.join(
        f"{o.get('position','')} at {o.get('name','')}"
        for o in linkedin_data.get('organizations', [])
    ) or 'None'
    certs = ', '.join(linkedin_data.get('certifications', [])) or 'None'
    skills = ', '.join(linkedin_data.get('skills', [])[:30])

    user_msg = f"""Analyze this LinkedIn profile:
Name: {linkedin_data.get('fullName','')}
Headline: {linkedin_data.get('headline','')}
Location: {linkedin_data.get('location','')}
Education: {edu_str}
Work Experience: {exp_str}
Organizations: {org_str}
Certifications: {certs}
Skills ({len(linkedin_data.get('skills',[]))} total): {skills}
Summary: {linkedin_data.get('summary','') or 'Not provided'}"""

    async with httpx.AsyncClient(timeout=30.0) as client:
        res = await client.post(
            GROQ_ENDPOINT,
            headers={'Authorization': f'Bearer {api_key}', 'Content-Type': 'application/json'},
            json={
                'model': GROQ_MODEL,
                'messages': [
                    {'role': 'system', 'content': system_prompt},
                    {'role': 'user', 'content': user_msg},
                ],
                'temperature': 0.2,
                'max_tokens': 800,
            },
        )
        res.raise_for_status()
        raw = res.json()['choices'][0]['message']['content']
        cleaned = re.sub(r'```json?', '', raw).replace('```', '').strip()
        return json.loads(cleaned)


async def generate_recommendations(user_id: str, db) -> list:
    """Ported from api.mjs generateRecommendations — AI-generated company recommendations."""
    api_key = os.getenv('GROQ_API_KEY')

    res = db.from_('profiles').select('ai_analysis, linkedin_data').eq('user_id', user_id).single().execute()
    if not res.data or not res.data.get('ai_analysis'):
        return []

    ai = res.data['ai_analysis']
    skill_tags = ai.get('skillTags', [])
    weak_areas = ai.get('weakAreas', [])
    top_roles = ai.get('topRoles', [])
    score = ai.get('placementScore', 50)

    if not api_key:
        # Fallback: basic recs from profile data
        companies = ['Google', 'Microsoft', 'Amazon', 'Infosys', 'TCS', 'Wipro']
        return [
            {
                'id': i + 1,
                'priority': ['URGENT', 'HIGH', 'NORMAL'][min(i, 2)],
                'initials': ''.join(w[0] for w in role.split()[:2]).upper(),
                'company': companies[i] if i < len(companies) else f'Company {i+1}',
                'role': role,
                'match': max(40, score - i * 8),
                'gaps': weak_areas[:2],
                'reasoning': f"Your profile matches {role} based on: {', '.join(skill_tags[:3])}.",
                'jd': f"Looking for candidates with {', '.join(skill_tags[:4])}.",
                'selectionProbability': max(30, score - i * 10),
            }
            for i, role in enumerate(top_roles[:3])
        ]

    prompt = f"""Based on this student profile, generate exactly 3 company recommendations as a JSON array.

Profile:
- Skills: {', '.join(skill_tags)}
- Weak areas: {', '.join(weak_areas)}
- Top roles: {', '.join(top_roles)}
- Placement score: {score}/100
- Experience level: {ai.get('experienceLevel', 'fresher')}

Return ONLY a valid JSON array with exactly 3 objects, each having:
{{"priority":"URGENT|HIGH|NORMAL","initials":"2 letters","company":"Real company","role":"specific title","match":40-95,"gaps":["skill1","skill2"],"reasoning":"1-2 sentences","jd":"1 sentence","selectionProbability":30-90}}"""

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(
                GROQ_ENDPOINT,
                headers={'Authorization': f'Bearer {api_key}', 'Content-Type': 'application/json'},
                json={
                    'model': GROQ_MODEL,
                    'messages': [
                        {'role': 'system', 'content': 'You are a placement analyst. Return ONLY valid JSON arrays, no markdown.'},
                        {'role': 'user', 'content': prompt},
                    ],
                    'temperature': 0.4,
                    'max_tokens': 800,
                },
            )
            resp.raise_for_status()
            raw = resp.json()['choices'][0]['message']['content']
            cleaned = re.sub(r'```json?', '', raw).replace('```', '').strip()
            recs = json.loads(cleaned)

            # Cache in Supabase
            to_insert = [
                {
                    'user_id': user_id,
                    'priority': r['priority'],
                    'initials': r.get('initials', ''),
                    'company': r['company'],
                    'role': r['role'],
                    'match': r.get('match', 50),
                    'gaps': r.get('gaps', []),
                    'reasoning': r.get('reasoning', ''),
                    'jd': r.get('jd', ''),
                    'selection_probability': r.get('selectionProbability', 50),
                }
                for r in recs
            ]
            db.from_('recommendations').delete().eq('user_id', user_id).execute()
            db.from_('recommendations').insert(to_insert).execute()

            return [{'id': i + 1, **r} for i, r in enumerate(recs)]
    except Exception as e:
        print(f'[generateRecommendations] Error: {e}')
        return []


# ── LinkedIn URL normalization ───────────────────────────────────────

def normalize_linkedin_url(raw_url: str) -> str:
    url = raw_url.strip()
    if not url.startswith('http://') and not url.startswith('https://'):
        url = f'https://{url}'
    url = url.replace('http://', 'https://').rstrip('/')

    parsed = urlparse(url)
    if 'linkedin.com' not in parsed.hostname:
        raise ValueError('URL must be a linkedin.com profile')
    if not parsed.path.lower().startswith('/in/'):
        raise ValueError('LinkedIn URL must be a public profile like linkedin.com/in/username')
    return url


def extract_basic_profile_from_url(linkedin_url: str) -> dict:
    try:
        parsed = urlparse(linkedin_url)
        parts = [p for p in parsed.path.split('/') if p]
        slug = parts[1] if len(parts) > 1 else ''
        pretty = slug.replace('-', ' ').replace('_', ' ').strip().title()
        return {'fullName': pretty, 'profileSlug': slug, 'profileUrl': linkedin_url, 'source': 'linkedin_url_only'}
    except Exception:
        return {'fullName': '', 'profileSlug': '', 'profileUrl': linkedin_url, 'source': 'linkedin_url_only'}


def parse_linkedin_raw(raw: dict) -> dict:
    """Parse raw Apify LinkedIn data into normalized linkedinData object.
    Handles both supreme_coder and harvestapi schemas."""
    raw_exp = raw.get('experience') or raw.get('positions') or []
    raw_edu = raw.get('education') or raw.get('educations') or []
    raw_skills = raw.get('skills') or []

    return {
        'firstName': raw.get('firstName', ''),
        'lastName': raw.get('lastName', ''),
        'fullName': (
            raw.get('fullName')
            or f"{raw.get('firstName', '')} {raw.get('lastName', '')}".strip()
            or raw.get('name', 'Unknown')
        ),
        'headline': raw.get('headline') or raw.get('occupation') or raw.get('jobTitle') or '',
        'currentCompany': (
            raw.get('companyName')
            or raw.get('company')
            or (raw_exp[0].get('company', {}).get('name') if raw_exp and isinstance(raw_exp[0].get('company'), dict) else '')
            or (raw_exp[0].get('companyName', '') if raw_exp else '')
        ),
        'location': raw.get('location') or raw.get('geoLocationName') or raw.get('addressWithCountry') or '',
        'experiences': [
            {
                'company': (e.get('company', {}).get('name') if isinstance(e.get('company'), dict) else e.get('companyName') or e.get('company') or ''),
                'role': e.get('title') or e.get('role') or '',
                'duration': (
                    e.get('totalDuration')
                    or (f"{e['timePeriod']['startDate'].get('year','')}-{e['timePeriod']['endDate'].get('year','Present')}" if e.get('timePeriod') else '')
                    or e.get('dateRange', '')
                ),
            }
            for e in raw_exp
        ],
        'education': [
            {
                'school': e.get('schoolName') or e.get('school') or e.get('institution') or '',
                'degree': e.get('degreeName') or e.get('degree') or '',
                'field': e.get('fieldOfStudy') or e.get('field') or '',
                'years': (
                    f"{e['timePeriod']['startDate'].get('year','')}-{e['timePeriod']['endDate'].get('year','')}" if e.get('timePeriod') else
                    (f"{e.get('startDate','')}-{e.get('endDate','')}" if e.get('startDate') and e.get('endDate') else '')
                ),
            }
            for e in raw_edu
        ],
        'skills': [
            (s if isinstance(s, str) else s.get('name') or s.get('displayName') or '')
            for s in raw_skills
            if (s if isinstance(s, str) else s.get('name') or s.get('displayName'))
        ],
        'certifications': [
            f"{c.get('name','')} ({c.get('authority','') or c.get('issuer','') or c.get('issuingOrganization','')})".replace(' ()', '')
            for c in (raw.get('certifications') or raw.get('licenses') or [])
            if c.get('name')
        ],
        'organizations': [
            {'name': o.get('name') or o.get('organization') or '', 'position': o.get('position') or o.get('role') or ''}
            for o in (raw.get('organizations') or raw.get('volunteerExperiences') or [])
        ],
        'summary': raw.get('summary') or raw.get('about') or '',
    }


# ── Background LinkedIn analysis ────────────────────────────────────

async def run_linkedin_analysis_background(linkedin_url: str, user_id: str, db):
    """Full pipeline: multi-actor Apify retry → Groq AI → Supabase upsert.
    Ported from linkedin-analyze-background.mjs."""
    import datetime

    # Mark as analyzing
    db.from_('profiles').upsert({
        'user_id': user_id,
        'onboarding_meta': {'analyzing': True, 'startedAt': datetime.datetime.utcnow().isoformat()},
        'updated_at': datetime.datetime.utcnow().isoformat(),
    }, on_conflict='user_id').execute()

    try:
        linkedin_url = normalize_linkedin_url(linkedin_url)

        # Try multiple actors with different input formats
        actors = [
            {
                'id': os.getenv('APIFY_ACTOR', 'supreme_coder~linkedin-profile-scraper'),
                'inputs': [
                    {'profileUrls': [linkedin_url]},
                    {'urls': [linkedin_url]},
                    {'urls': [{'url': linkedin_url}]},
                ],
            },
            {
                'id': 'bebity~linkedin-profile-scraper',
                'inputs': [
                    {'profileUrls': [linkedin_url]},
                    {'urls': [linkedin_url]},
                ],
            },
            {
                'id': os.getenv('APIFY_ACTOR2', 'harvestapi~linkedin-profile-scraper'),
                'inputs': [
                    {'urls': [{'url': linkedin_url}]},
                    {'urls': [linkedin_url]},
                ],
            },
        ]

        items = None
        last_error = None

        for actor in actors:
            try:
                for inp in actor['inputs']:
                    print(f"[BG] Trying actor: {actor['id']} with keys: {list(inp.keys())}")
                    items = await call_apify_async(actor['id'], inp, 300_000)
                    # Check for quota error in dataset
                    if items and items[0].get('error') and len(items[0]) <= 2:
                        err_msg = str(items[0]['error'])
                        if any(w in err_msg for w in ('hard limit', 'free user', 'paid')):
                            raise RuntimeError(f'quota: {err_msg}')
                        raise RuntimeError(f'scraper_error: {err_msg}')
                    if items:
                        break
                if items:
                    break
            except Exception as e:
                print(f"[BG] Actor {actor['id']} failed: {e}")
                last_error = e

        if not items:
            raise last_error or RuntimeError('All LinkedIn scrapers failed')

        raw = items[0]
        if not raw:
            raise RuntimeError('No data returned from LinkedIn scraper')

        # Parse + AI analyze
        linkedin_data = parse_linkedin_raw(raw)
        print('[BG] Running Groq analysis...')
        ai_analysis = await analyze_linkedin_with_groq(linkedin_data)

        # Save to Supabase
        db.from_('profiles').upsert({
            'user_id': user_id,
            'linkedin_data': linkedin_data,
            'ai_analysis': ai_analysis,
            'onboarding_meta': {'analyzing': False, 'completedAt': datetime.datetime.utcnow().isoformat()},
            'updated_at': datetime.datetime.utcnow().isoformat(),
        }, on_conflict='user_id').execute()

        # Auto-generate recommendations
        await generate_recommendations(user_id, db)
        print(f'[BG] Analysis complete for user: {user_id}')

    except Exception as e:
        import datetime
        print(f'[BG] Fatal error: {e}')
        db.from_('profiles').upsert({
            'user_id': user_id,
            'linkedin_data': extract_basic_profile_from_url(linkedin_url),
            'ai_analysis': None,
            'onboarding_meta': {
                'analyzing': False,
                'error': str(e),
                'canAnalyzeLater': True,
                'lastAttemptedUrl': linkedin_url,
            },
            'updated_at': datetime.datetime.utcnow().isoformat(),
        }, on_conflict='user_id').execute()
