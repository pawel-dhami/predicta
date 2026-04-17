import { useEffect, useMemo, useState } from 'react';
import StatCard from '../components/StatCard';
import RecommendationCard from '../components/RecommendationCard';
import RadarChart from '../components/RadarChart';
import RoadmapTask from '../components/RoadmapTask';
import Timeline from '../components/Timeline';
import AlertCard from '../components/AlertCard';
import ChatInterface from '../components/ChatInterface';
import JourneyTracker from '../components/JourneyTracker';
import SkillMappingTable from '../components/SkillMappingTable';
import NextActionSuggestions from '../components/NextActionSuggestions';
import { alertsSeed, companyRequirements, mockStudents, recommendationSeed } from '../data/mockStudents';
import { useAgent } from '../hooks/useAgent';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../hooks/useAuth';

const API_BASE = ''; // dev proxy rewrites /api → http://localhost:8000

// ── Helpers ────────────────────────────────────────────────────────

/** Convert ai_analysis.skillTags into the radar format RadarChart expects */
function buildRadarScores(aiAnalysis, fallbackSkills) {
  if (!aiAnalysis?.skillTags || aiAnalysis.skillTags.length === 0) return fallbackSkills;
  // Map up to 6 skill tags to a 1-10 scale using their presence in the verified list
  const tags = aiAnalysis.skillTags.slice(0, 6);
  const result = {};
  tags.forEach((tag, i) => {
    const name = typeof tag === 'string' ? tag : (tag.tag ?? `Skill ${i + 1}`);
    // Approximate score: start at 7 and decay based on index (top skills score higher)
    result[name] = Math.max(3, 9 - i);
  });
  return result;
}

/** Build next actions from ai_analysis */
function buildNextActions(aiAnalysis) {
  if (!aiAnalysis) return [
    { id: 1, type: 'Upskill', text: 'Complete the onboarding profile analysis to get personalised actions' },
  ];

  const actions = [];
  if (aiAnalysis.topRoles?.[0]) {
    actions.push({ id: 1, type: 'Apply', text: `Search for ${aiAnalysis.topRoles[0]} roles on the Jobs page` });
  }
  if (aiAnalysis.weakAreas?.[0]) {
    actions.push({ id: 2, type: 'Upskill', text: `Close gap in ${aiAnalysis.weakAreas[0]} — your identified weak area` });
  }
  if (aiAnalysis.topRoles?.[1]) {
    actions.push({ id: 3, type: 'Mock Interview', text: `Prepare for ${aiAnalysis.topRoles[1]} interview round` });
  }
  return actions.slice(0, 3);
}

/** Display name from user email or LinkedIn full name */
function displayNameFrom(user, linkedinData) {
  if (linkedinData?.firstName) {
    return linkedinData.lastName
      ? `${linkedinData.firstName} ${linkedinData.lastName}`
      : linkedinData.firstName;
  }
  if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
  if (user?.email) return user.email.split('@')[0];
  return 'Student';
}

// ── Component ──────────────────────────────────────────────────────

export default function StudentDashboard() {
  const { user } = useAuth();
  const { aiAnalysis, verifiedSkills, linkedinData, loading: profileLoading } = useProfile();
  const { sendChatMessage, chat, fetchRecommendations, fetchAlerts } = useAgent();

  const [recommendations, setRecommendations] = useState(recommendationSeed);
  const [liveAlerts, setLiveAlerts] = useState(alertsSeed);
  const [selected, setSelected] = useState(null);

  // ── Derived: real data with graceful fallbacks ─────────────────

  const student = mockStudents[0]; // structural fallback (roadmap, journey)

  const placementScore = aiAnalysis?.placementScore ?? null;
  const experienceLevel = aiAnalysis?.experienceLevel ?? null;
  const strengthSummary = aiAnalysis?.strengthSummary ?? null;

  const displayName = displayNameFrom(user, linkedinData);
  const displayBranch = linkedinData?.education?.[0]?.field ?? linkedinData?.headline ?? 'Not analyzed yet';

  // Skill tags for the verified badge row
  const skillTagsToShow = useMemo(() => {
    if (verifiedSkills && verifiedSkills.length > 0) return verifiedSkills;
    if (aiAnalysis?.skillTags && aiAnalysis.skillTags.length > 0) {
      return aiAnalysis.skillTags.map(t =>
        typeof t === 'string' ? { tag: t } : t
      );
    }
    return null;
  }, [verifiedSkills, aiAnalysis]);

  const radarScores = useMemo(
    () => buildRadarScores(aiAnalysis, student.skills),
    [aiAnalysis, student.skills]
  );

  const nextActions = useMemo(() => buildNextActions(aiAnalysis), [aiAnalysis]);

  const selectionProbability = useMemo(() => {
    if (aiAnalysis?.placementScore == null) return null;
    return Math.max(0, Math.min(99, Math.round(aiAnalysis.placementScore * 0.9)));
  }, [aiAnalysis]);

  const complete = useMemo(
    () => Math.round((student.roadmapTasks.filter(t => t.done).length / student.roadmapTasks.length) * 100),
    [student]
  );

  // Weakest skill for the radar call-out
  const weakestSkill = useMemo(() => {
    if (aiAnalysis?.weakAreas?.[0]) return aiAnalysis.weakAreas[0];
    const entries = Object.entries(radarScores);
    if (entries.length === 0) return 'System Design';
    return entries.reduce((a, b) => (a[1] < b[1] ? a : b))[0];
  }, [aiAnalysis, radarScores]);

  // ── Fetch live recommendations & alerts when user is ready ─────
  useEffect(() => {
    if (!user?.id) return;
    fetchRecommendations(user.id)
      .then(data => { if (data?.length) setRecommendations(data); })
      .catch(() => {}); // silently keep seed on error
    fetchAlerts(user.id)
      .then(data => { if (data?.length) setLiveAlerts(data); })
      .catch(() => {});
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Shuffle recommendations on AI re-run event
  useEffect(() => {
    if (!user?.id) return;
    const fn = () => {
      setRecommendations([]);
      fetchRecommendations(user.id)
        .then(data => {
          if (data?.length) setRecommendations(data);
          else setTimeout(() => setRecommendations([...recommendationSeed].sort(() => Math.random() - 0.5)), 400);
        })
        .catch(() => setTimeout(() => setRecommendations([...recommendationSeed].sort(() => Math.random() - 0.5)), 400));
    };
    window.addEventListener('run-ai-analysis', fn);
    return () => window.removeEventListener('run-ai-analysis', fn);
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Profile-pending banner (hasn't run LinkedIn analyze yet) ───
  const hasProfile = !profileLoading && aiAnalysis !== null;
  const pendingBanner = !profileLoading && aiAnalysis === null;

  return (
    <div style={{ display: 'grid', gap: 20 }}>

      {/* ── Profile-pending banner ──────────────────────────────── */}
      {pendingBanner && (
        <div style={{
          padding: '14px 20px',
          background: 'linear-gradient(135deg, rgba(108,71,255,.1), rgba(232,67,147,.06))',
          border: '1px solid rgba(108,71,255,.25)',
          borderRadius: 'var(--radius-lg)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 12,
        }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', marginBottom: 2 }}>
              🤖 Your AI profile analysis isn't done yet
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              Paste your LinkedIn URL in onboarding to unlock your real placement score and matched jobs.
            </div>
          </div>
          <a
            href="/onboarding"
            className="btn btn-accent"
            style={{ textDecoration: 'none', fontSize: 13, flexShrink: 0 }}
          >
            Analyze Profile →
          </a>
        </div>
      )}

      {/* ── Key Info Bar ──────────────────────────────────────────── */}
      <div className="card" style={{ padding: 0, display: 'flex', overflow: 'hidden' }}>
        <div className="info-box" style={{ flex: 1, border: 'none', borderRight: '1px solid var(--border)', borderRadius: 0 }}>
          <div className="info-box-label">Name</div>
          <div className="info-box-value">{displayName}</div>
        </div>
        <div className="info-box" style={{ flex: 1, border: 'none', borderRight: '1px solid var(--border)', borderRadius: 0 }}>
          <div className="info-box-label">Status</div>
          <div className="info-box-value" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: 99, background: '#059669' }} />
            {experienceLevel ? `${experienceLevel} · Active` : 'Active · Interviewing'}
          </div>
        </div>
        <div className="info-box" style={{ flex: 1, border: 'none', borderRight: '1px solid var(--border)', borderRadius: 0 }}>
          <div className="info-box-label">Placement Score</div>
          <div className="info-box-value mono">{placementScore != null ? `${placementScore} / 100` : 'Not analyzed'}</div>
        </div>
        <div style={{ flex: 1, background: 'linear-gradient(135deg, #6c47ff, #e84393)', padding: '14px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.7)' }}>Selection Probability</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }} className="mono">
            {selectionProbability != null ? `${selectionProbability}%` : '—'}
          </div>
        </div>
      </div>

      {/* ── Row 1: Stat Cards ──────────────────────────────────────── */}
      <div className="grid-4">
        <StatCard
          title="Placement Score"
          value={placementScore != null ? `${placementScore}/100` : 'Not analyzed'}
          subtitle={hasProfile ? 'From your LinkedIn analysis' : 'Run LinkedIn analysis to unlock score'}
          accent="#6c47ff"
          extra={placementScore != null ? 'Live from profile analysis' : 'No fake score shown'}
          mono
          icon="🎯"
        />
        <StatCard title="Skill Match Rate" value="64%" subtitle="Avg across 5 target companies" accent="#0891b2" icon="📊" />
        <StatCard title="Applications" value="3 / 12" subtitle="3 Active · 2 interviews scheduled" accent="#d97706" icon="📋" />
        <StatCard title="Risk Level" value="MEDIUM" subtitle="2 skills below threshold" accent="#dc2626" icon="⚠️" />
      </div>

      {/* ── AI Skill Tags (only when analysis exists) ─────────────── */}
      {skillTagsToShow && (
        <div className="card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            🤖 AI-Verified Skills
            {verifiedSkills && <span style={{ marginLeft: 8, fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>· GitHub cross-referenced</span>}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: strengthSummary ? 14 : 0 }}>
            {skillTagsToShow.map(({ tag, verified, unverified }) => (
              <span
                key={tag}
                className={`skill-badge${verified ? ' skill-badge-verified' : unverified ? ' skill-badge-unverified' : ''}`}
              >
                {verified ? '✓ ' : unverified ? '⚠ ' : ''}{tag}
              </span>
            ))}
          </div>
          {strengthSummary && (
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7, borderTop: '1px solid var(--border)', paddingTop: 10, marginTop: 4 }}>
              {strengthSummary}
            </div>
          )}
        </div>
      )}

      {/* ── Row 2: Journey + Next Actions ─────────────────────────── */}
      <div className="grid-2-main">
        <div className="card">
          <div className="section-label">
            <strong>📍 Student Journey Tracking</strong>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 14 }}>
            Track your progress through the full placement lifecycle
          </p>
          <JourneyTracker stages={student.journeyStages} />
          <div style={{
            marginTop: 14, padding: 12,
            background: 'var(--bg-elevated)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            fontSize: 13,
          }}>
            <strong style={{ color: 'var(--accent-purple)' }}>Current Stage:</strong> {student.journeyStage}
            <span style={{ color: 'var(--text-muted)', marginLeft: 8 }}>→ Keep applying to reach the next milestone</span>
          </div>
        </div>
        <div className="card">
          <div className="section-label">
            <strong>⚡ Next Action Suggestions</strong>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
            {hasProfile ? 'AI-prioritised based on your profile' : 'AI-prioritized tasks: Apply / Upskill / Mock Interview'}
          </p>
          <NextActionSuggestions actions={nextActions} />
        </div>
      </div>

      {/* ── Row 3: Recommendations + Skill Radar ──────────────────── */}
      <div className="grid-2-main">
        <div className="card">
          <div className="section-label">
            <strong>🤖 Company Recommendations</strong>
            <span className="live-dot">LIVE</span>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>AI-powered company recommendation engine with match scores & selection probability</p>
          {recommendations.length
            ? recommendations.map(item => <RecommendationCard key={item.id} item={item} onApply={setSelected} />)
            : <div className="pulse" style={{ height: 100, background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', marginTop: 10 }} />
          }
        </div>
        <div className="card">
          <div className="section-label">
            <strong>🎯 Skill Radar</strong>
          </div>
          <RadarChart scores={radarScores} companyReqs={companyRequirements[0].requirements} />
          <div style={{
            padding: 12, background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)', fontSize: 12, marginTop: 8,
          }}>
            <strong style={{ color: '#dc2626' }}>Weakest:</strong> {weakestSkill} ·{' '}
            <a href="#">Start learning →</a>
          </div>
        </div>
      </div>

      {/* ── Row 4: Skill vs Company Mapping ──────────────────────── */}
      <div className="card">
        <div className="section-label">
          <strong>📊 Student Skill vs Company Requirements Mapping</strong>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>
          Compare your skills against company requirements with match scores and selection probability prediction
        </p>
        <SkillMappingTable skills={radarScores} companyRequirements={companyRequirements} />
      </div>

      {/* ── Row 5: Roadmap + Applications + Alerts ────────────────── */}
      <div className="grid-3">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="section-label" style={{ marginBottom: 0 }}>
              <strong>📋 My Roadmap</strong>
            </div>
            <span className="pill pill-success" style={{ fontSize: 11 }}>{complete}% done</span>
          </div>
          <div style={{ maxHeight: 280, overflow: 'auto', marginTop: 10 }}>
            {student.roadmapTasks.map(task => <RoadmapTask key={task.id} task={task} />)}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <button className="btn btn-sm">+ Add task</button>
            <button className="btn btn-sm btn-accent">🤖 AI Generate Next</button>
          </div>
        </div>

        <div className="card">
          <div className="section-label">
            <strong>📈 Application Tracking</strong>
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10 }}>Applied → OA → Interview → Offer pipeline</p>
          <div style={{ maxHeight: 320, overflow: 'auto' }}>
            <Timeline items={student.applications} />
          </div>
        </div>

        <div className="card">
          <div className="section-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong>🔔 Smart Alerts &amp; Deadlines</strong>
            <span className="live-dot">LIVE</span>
          </div>
          <div style={{ maxHeight: 340, overflow: 'auto' }}>
            {liveAlerts.length === 0
              ? <div style={{ fontSize: 13, color: 'var(--text-muted)', padding: '16px 0', textAlign: 'center' }}>No active alerts 🎉</div>
              : liveAlerts.slice(0, 5).map(a => <AlertCard key={a.id} alert={a} />)
            }
          </div>
        </div>
      </div>

      {/* ── Row 6: AI Mentor Chat ────────────────────────────────── */}
      <ChatInterface onSend={sendChatMessage} loading={chat.loading} />

      {/* ── Application Modal ────────────────────────────────────── */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-content slide-up" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
              <div>
                <h3 style={{ fontSize: 20, marginBottom: 4 }}>{selected.company}</h3>
                <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{selected.role}</div>
              </div>
              <span className="mono" style={{ fontSize: 28, fontWeight: 800, color: 'var(--accent-purple)' }}>{selected.match}%</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16 }}>{selected.jd}</p>
            <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
              {selected.gaps.map(g => <span key={g} className="pill pill-urgent">Gap: {g}</span>)}
            </div>
            <div style={{
              padding: 14, background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)', fontSize: 13, marginBottom: 18,
            }}>
              🤖 <strong>AI Assessment:</strong> {selected.reasoning}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-accent" onClick={() => setSelected(null)}>Confirm Application</button>
              <button className="btn" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
