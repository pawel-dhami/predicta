/**
 * SkillsPage — /skills
 * Full skills breakdown: AI-verified tags, radar chart, company mapping,
 * GitHub verification status, and gap analysis.
 */
import { useMemo, useState } from 'react';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../hooks/useAuth';
import RadarChart from '../components/RadarChart';
import SkillMappingTable from '../components/SkillMappingTable';
import { companyRequirements } from '../data/mockStudents';
import { CheckCircle, XCircle, AlertCircle, GitBranch, Zap, TrendingUp, Target } from 'lucide-react';

const LEVEL_COLORS = { expert: '#10b981', strong: '#6c47ff', learning: '#d97706', gap: '#dc2626' };

function buildRadarScores(aiAnalysis) {
  if (!aiAnalysis?.skillTags || aiAnalysis.skillTags.length === 0) {
    return { DSA: 7, SQL: 6, Communication: 8, SystemDesign: 4, Projects: 7, Aptitude: 6 };
  }
  const tags = aiAnalysis.skillTags.slice(0, 6);
  const result = {};
  tags.forEach((tag, i) => {
    const name = typeof tag === 'string' ? tag : (tag.tag ?? `Skill ${i + 1}`);
    result[name] = Math.max(3, 9 - i);
  });
  return result;
}

function SkillBadge({ skill }) {
  const { tag, verified, unverified } = typeof skill === 'string'
    ? { tag: skill, verified: false, unverified: false }
    : skill;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '10px 14px',
      background: verified ? 'rgba(16,185,129,.08)' : unverified ? 'rgba(220,38,38,.06)' : 'var(--bg-elevated)',
      border: `1px solid ${verified ? 'rgba(16,185,129,.3)' : unverified ? 'rgba(220,38,38,.2)' : 'var(--border)'}`,
      borderRadius: 'var(--radius-md)',
    }}>
      {verified
        ? <CheckCircle size={14} style={{ color: '#10b981', flexShrink: 0 }} />
        : unverified
        ? <XCircle size={14} style={{ color: '#dc2626', flexShrink: 0 }} />
        : <AlertCircle size={14} style={{ color: '#d97706', flexShrink: 0 }} />
      }
      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{tag}</span>
      {verified && <span style={{ fontSize: 10, color: '#10b981', marginLeft: 'auto' }}>GitHub ✓</span>}
    </div>
  );
}

export default function SkillsPage() {
  const { aiAnalysis, verifiedSkills, linkedinData } = useProfile();
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('all');

  const skillTagsRaw = useMemo(() => {
    if (verifiedSkills && verifiedSkills.length > 0) return verifiedSkills;
    if (aiAnalysis?.skillTags && aiAnalysis.skillTags.length > 0) {
      return aiAnalysis.skillTags.map(t => typeof t === 'string' ? { tag: t } : t);
    }
    return [];
  }, [verifiedSkills, aiAnalysis]);

  const filteredSkills = useMemo(() => {
    if (activeFilter === 'verified') return skillTagsRaw.filter(s => s.verified);
    if (activeFilter === 'unverified') return skillTagsRaw.filter(s => s.unverified);
    if (activeFilter === 'pending') return skillTagsRaw.filter(s => !s.verified && !s.unverified);
    return skillTagsRaw;
  }, [skillTagsRaw, activeFilter]);

  const radarScores = useMemo(() => buildRadarScores(aiAnalysis), [aiAnalysis]);
  const hasProfile = aiAnalysis !== null;

  const verifiedCount = skillTagsRaw.filter(s => s.verified).length;
  const unverifiedCount = skillTagsRaw.filter(s => s.unverified).length;
  const pendingCount = skillTagsRaw.filter(s => !s.verified && !s.unverified).length;

  return (
    <div style={{ display: 'grid', gap: 20 }}>

      {/* Header */}
      <div className="gradient-banner">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>🧠 Skills & Matching Intelligence</div>
            <div style={{ fontSize: 13, opacity: .8 }}>
              {hasProfile
                ? `${skillTagsRaw.length} skills extracted from your LinkedIn · ${verifiedCount} verified via GitHub`
                : 'Analyze your LinkedIn profile to unlock skill intelligence'}
            </div>
          </div>
          {!hasProfile && (
            <a href="/onboarding" className="btn" style={{ background: 'rgba(255,255,255,.15)', color: '#fff', borderColor: 'rgba(255,255,255,.2)', textDecoration: 'none' }}>
              Analyze Profile →
            </a>
          )}
        </div>
      </div>

      {/* Stat row */}
      <div className="grid-4">
        <div className="card" style={{ padding: '16px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--accent-purple)', fontFamily: 'monospace' }}>{skillTagsRaw.length}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Total Skills</div>
        </div>
        <div className="card" style={{ padding: '16px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#10b981', fontFamily: 'monospace' }}>{verifiedCount}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>GitHub Verified</div>
        </div>
        <div className="card" style={{ padding: '16px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#dc2626', fontFamily: 'monospace' }}>{unverifiedCount}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Not Verified</div>
        </div>
        <div className="card" style={{ padding: '16px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#d97706', fontFamily: 'monospace' }}>
            {aiAnalysis?.placementScore ?? '—'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Placement Score</div>
        </div>
      </div>

      {/* Radar + Weak Areas */}
      <div className="grid-2-main">
        <div className="card">
          <div className="section-label"><strong>🎯 Skill Radar</strong></div>
          <RadarChart scores={radarScores} companyReqs={companyRequirements[0].requirements} />
          {aiAnalysis?.weakAreas && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>
                Weak Areas to Improve
              </div>
              {aiAnalysis.weakAreas.map((area, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 12px', marginBottom: 6,
                  background: 'rgba(220,38,38,.06)', border: '1px solid rgba(220,38,38,.15)',
                  borderRadius: 'var(--radius-md)',
                }}>
                  <Target size={13} style={{ color: '#dc2626' }} />
                  <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{area}</span>
                  <a href="#" style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--accent-purple)' }}>Learn →</a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Skills List */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div className="section-label" style={{ marginBottom: 0 }}><strong>🤖 AI-Extracted Skills</strong></div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['all', 'verified', 'unverified', 'pending'].map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`btn btn-sm ${activeFilter === f ? 'btn-accent' : ''}`}
                  style={{ fontSize: 11, padding: '4px 10px' }}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {!hasProfile && (
            <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>No skills extracted yet</div>
              <div style={{ fontSize: 12 }}>Link your LinkedIn profile in Onboarding to auto-extract skills</div>
            </div>
          )}

          {hasProfile && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, maxHeight: 380, overflowY: 'auto' }}>
              {filteredSkills.map((skill, i) => (
                <SkillBadge key={i} skill={skill} />
              ))}
              {filteredSkills.length === 0 && (
                <div style={{ gridColumn: '1/-1', padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                  No skills in this category
                </div>
              )}
            </div>
          )}

          {/* GitHub verification CTA */}
          {hasProfile && verifiedCount === 0 && (
            <div style={{
              marginTop: 14, padding: 12,
              background: 'rgba(108,71,255,.06)', border: '1px solid rgba(108,71,255,.2)',
              borderRadius: 'var(--radius-md)',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <GitBranch size={16} style={{ color: 'var(--accent-purple)' }} />
              <div style={{ flex: 1, fontSize: 12, color: 'var(--text-secondary)' }}>
                Add your GitHub username in Onboarding to verify skills with real code evidence
              </div>
              <a href="/onboarding" style={{ fontSize: 12, color: 'var(--accent-purple)', textDecoration: 'none', fontWeight: 600 }}>Add →</a>
            </div>
          )}
        </div>
      </div>

      {/* Strength Summary */}
      {aiAnalysis?.strengthSummary && (
        <div className="card" style={{ padding: '16px 20px' }}>
          <div className="section-label"><strong>💬 AI Strength Summary</strong></div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, margin: 0 }}>
            {aiAnalysis.strengthSummary}
          </p>
        </div>
      )}

      {/* Full Company Mapping Table */}
      <div className="card">
        <div className="section-label"><strong>📊 Skill vs Company Requirements Mapping</strong></div>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>
          Your skill levels compared to what each company expects — colour coded for quick gap analysis.
        </p>
        <SkillMappingTable skills={radarScores} companyRequirements={companyRequirements} />
      </div>

      {/* Top Roles */}
      {aiAnalysis?.topRoles && (
        <div className="card" style={{ padding: '16px 20px' }}>
          <div className="section-label"><strong>🚀 AI-Suggested Top Roles</strong></div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 4 }}>
            {aiAnalysis.topRoles.map((role, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 16px',
                background: i === 0 ? 'linear-gradient(135deg, rgba(108,71,255,.12), rgba(232,67,147,.08))' : 'var(--bg-elevated)',
                border: `1px solid ${i === 0 ? 'rgba(108,71,255,.3)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-md)',
              }}>
                <TrendingUp size={14} style={{ color: i === 0 ? 'var(--accent-purple)' : 'var(--text-muted)' }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{role}</span>
                {i === 0 && <span className="pill pill-success" style={{ fontSize: 10 }}>Best Match</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
