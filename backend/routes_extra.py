"""
routes_extra.py — Endpoints ported from api.mjs that were missing in main.py.
Mounted as a router in main.py.
"""
import os
import json
import asyncio
from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, Query, HTTPException, BackgroundTasks
from supabase import create_client, Client

from agent.models import (
    AlertCreate, AlertDismiss, ApplicationUpdate, ApplicationDelete,
    LinkedInAnalyzeRequest, ApifyRunRequest, JobsFetchRequest,
    GitHubVerifyRequest, ChatHistoryDelete,
)
from services import (
    call_apify, call_apify_async, analyze_linkedin_with_groq,
    generate_recommendations, match_skill_to_language,
    normalize_linkedin_url, parse_linkedin_raw, extract_basic_profile_from_url,
    run_linkedin_analysis_background, chat_fallback, call_groq,
)

router = APIRouter()

SUPABASE_URL = os.getenv('SUPABASE_URL', 'https://oqghzmvjmdrpyktuxahj.supabase.co')
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_KEY', '')


def get_db() -> Client:
    if not SUPABASE_SERVICE_KEY:
        raise HTTPException(status_code=500, detail='SUPABASE_SERVICE_KEY not configured')
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


# ── Chat History ─────────────────────────────────────────────────────

@router.get('/api/chat-history')
async def get_chat_history(userId: str = Query(...)):
    db = get_db()
    res = db.from_('chat_history').select('role, message, created_at').eq(
        'user_id', userId
    ).order('created_at', desc=False).limit(50).execute()
    return res.data or []


@router.delete('/api/chat-history')
async def delete_chat_history(payload: ChatHistoryDelete):
    db = get_db()
    db.from_('chat_history').delete().eq('user_id', payload.userId).execute()
    return {'success': True}


# ── Alerts CRUD ──────────────────────────────────────────────────────

@router.post('/api/alerts')
async def create_alert(payload: AlertCreate):
    db = get_db()
    db.from_('alerts').insert({
        'user_id': payload.userId,
        'type': payload.type,
        'text': payload.text,
        'action_text': payload.actionText,
        'deadline': payload.deadline,
    }).execute()
    return {'success': True}


@router.post('/api/alerts/dismiss')
async def dismiss_alert(payload: AlertDismiss):
    db = get_db()
    db.from_('alerts').update({'dismissed': True}).eq(
        'id', payload.alertId
    ).eq('user_id', payload.userId).execute()
    return {'success': True}


# ── Applications: update + delete ────────────────────────────────────

@router.put('/api/applications')
async def update_application(payload: ApplicationUpdate):
    db = get_db()
    db.from_('applications').update({
        'company': payload.company,
        'role': payload.role,
        'stage': payload.stage,
        'deadline': payload.deadline,
        'notes': payload.notes,
        'updated_at': datetime.now(timezone.utc).isoformat(),
    }).eq('id', payload.id).eq('user_id', payload.userId).execute()
    return {'success': True, 'action': 'updated'}


@router.delete('/api/applications')
async def delete_application(payload: ApplicationDelete):
    db = get_db()
    db.from_('applications').delete().eq(
        'id', payload.id
    ).eq('user_id', payload.userId).execute()
    return {'success': True}


# ── Apify generic proxy ─────────────────────────────────────────────

@router.post('/api/apify/run')
async def apify_run(payload: ApifyRunRequest):
    try:
        items = await call_apify(payload.actor, payload.input)
        return {'items': items}
    except RuntimeError as e:
        is_timeout = 'timed out' in str(e)
        raise HTTPException(status_code=503 if is_timeout else 500, detail=str(e))


# ── LinkedIn analyze (sync) ─────────────────────────────────────────

@router.post('/api/linkedin/analyze')
async def linkedin_analyze_sync(payload: LinkedInAnalyzeRequest):
    """Synchronous LinkedIn analysis — scrape + AI + save. Used by dashboard re-analyze."""
    db = get_db()
    try:
        items = await call_apify('supreme_coder~linkedin-profile-scraper', {
            'urls': [{'url': payload.linkedinUrl}],
        })
        raw = items[0] if items else None
        if not raw:
            raise HTTPException(status_code=422, detail='No data returned from LinkedIn scraper')

        linkedin_data = parse_linkedin_raw(raw)
        ai_analysis = await analyze_linkedin_with_groq(linkedin_data)

        db.from_('profiles').upsert({
            'user_id': payload.userId,
            'linkedin_data': linkedin_data,
            'ai_analysis': ai_analysis,
            'updated_at': datetime.now(timezone.utc).isoformat(),
        }, on_conflict='user_id').execute()

        await generate_recommendations(payload.userId, db)
        return {'linkedinData': linkedin_data, 'aiAnalysis': ai_analysis}

    except HTTPException:
        raise
    except RuntimeError as e:
        is_timeout = 'timed out' in str(e)
        raise HTTPException(
            status_code=503 if is_timeout else 500,
            detail='Could not fetch LinkedIn data. Try again.' if is_timeout else str(e),
        )


# ── LinkedIn analyze (background — replaces Netlify background fn) ──

@router.post('/api/linkedin/analyze-background', status_code=202)
async def linkedin_analyze_background(payload: LinkedInAnalyzeRequest, bg: BackgroundTasks):
    """Fire-and-forget background analysis. Returns 202 immediately.
    Replaces netlify/functions/linkedin-analyze-background.mjs."""
    db = get_db()
    bg.add_task(run_linkedin_analysis_background, payload.linkedinUrl, payload.userId, db)
    return {'status': 'accepted', 'message': 'Analysis started in background'}


# ── Jobs fetch with cache ────────────────────────────────────────────

@router.post('/api/jobs/fetch')
async def jobs_fetch(payload: JobsFetchRequest):
    db = get_db()
    profile_res = db.from_('profiles').select(
        'ai_analysis, linkedin_data'
    ).eq('user_id', payload.userId).single().execute()

    job_title = (profile_res.data or {}).get('ai_analysis', {}).get('topRoles', ['Software Engineer'])[0]
    location = (profile_res.data or {}).get('linkedin_data', {}).get('location', 'India')

    # Check cache
    cache_res = db.from_('jobs_cache').select(
        'results, fetched_at'
    ).eq('user_id', payload.userId).single().execute()

    SIX_HOURS = 6 * 60 * 60
    TEN_MIN = 10 * 60

    if cache_res.data and cache_res.data.get('fetched_at'):
        fetched = datetime.fromisoformat(cache_res.data['fetched_at'].replace('Z', '+00:00'))
        age = (datetime.now(timezone.utc) - fetched).total_seconds()

        if payload.forceRefresh and age < TEN_MIN:
            raise HTTPException(status_code=429, detail=f'Refresh cooldown: {int(TEN_MIN - age)}s remaining')
        if not payload.forceRefresh and cache_res.data.get('results') and age < SIX_HOURS:
            return {'jobs': cache_res.data['results'], 'fromCache': True, 'fetchedAt': cache_res.data['fetched_at']}

    try:
        items = await call_apify('harvestapi~linkedin-job-search', {
            'jobTitles': [job_title], 'locations': [location], 'maxItems': 20,
        })
        jobs = [
            {
                'title': item.get('title', 'Unknown'),
                'company': item.get('companyName') or item.get('company', 'Unknown'),
                'location': item.get('location', ''),
                'employmentType': item.get('employmentType', 'Full-time'),
                'salary': (item.get('salary', {}) or {}).get('text') or item.get('salaryRange'),
                'postedAt': item.get('postedDate') or item.get('publishedAt'),
                'applyUrl': (item.get('applyMethod', {}) or {}).get('companyApplyUrl') or item.get('linkedinUrl'),
            }
            for item in items
        ]

        now = datetime.now(timezone.utc).isoformat()
        db.from_('jobs_cache').upsert(
            {'user_id': payload.userId, 'results': jobs, 'fetched_at': now},
            on_conflict='user_id',
        ).execute()
        return {'jobs': jobs, 'fromCache': False, 'fetchedAt': now}

    except RuntimeError as e:
        is_timeout = 'timed out' in str(e)
        raise HTTPException(status_code=503 if is_timeout else 500, detail=str(e))


# ── GitHub verify (full — Apify + skill matching) ────────────────────

@router.post('/api/github/verify-full')
async def github_verify_full(payload: GitHubVerifyRequest):
    """Full GitHub verification with Apify scraping and skill-to-language matching.
    Upgrades the stub in main.py."""
    db = get_db()
    profile_res = db.from_('profiles').select('ai_analysis').eq('user_id', payload.userId).single().execute()
    skill_tags = (profile_res.data or {}).get('ai_analysis', {}).get('skillTags', [])

    try:
        items = await call_apify('dhruvils914~github-scraper', {'username': payload.githubUsername})
        lang_freq = {}
        for repo in items:
            lang = repo.get('language') or repo.get('primaryLanguage')
            if lang:
                lang_freq[lang] = lang_freq.get(lang, 0) + 1

        verified_skills = []
        for tag in skill_tags:
            count = match_skill_to_language(tag, lang_freq)
            if count >= 2:
                verified_skills.append({'tag': tag, 'verified': True, 'repoCount': count})
            elif count == 0:
                verified_skills.append({'tag': tag, 'unverified': True, 'repoCount': 0})
            else:
                verified_skills.append({'tag': tag, 'repoCount': count})

        db.from_('profiles').upsert({
            'user_id': payload.userId,
            'verified_skills': verified_skills,
            'github_username': payload.githubUsername,
            'updated_at': datetime.now(timezone.utc).isoformat(),
        }, on_conflict='user_id').execute()

        return {'verifiedSkills': verified_skills, 'langFrequency': lang_freq, 'totalRepos': len(items)}

    except RuntimeError as e:
        is_timeout = 'timed out' in str(e)
        raise HTTPException(status_code=503 if is_timeout else 500, detail=str(e))
