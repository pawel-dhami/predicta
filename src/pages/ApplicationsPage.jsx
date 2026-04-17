/**
 * ApplicationsPage — /applications
 * Full Kanban-style application pipeline tracker.
 * Stages: Applied → OA → Interview → Offer / Rejected
 * Data: live from /api/applications, seed as fallback
 */
import { useState, useMemo, useEffect } from 'react';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../hooks/useAuth';
import { Briefcase, Plus, ExternalLink, Clock, CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import { APPLICATION_STAGES, APPLICATION_STAGE_COLORS } from '../data/mockStudents';
import { API_BASE } from '../lib/api';

const INITIAL_APPS = [
  { id: 1, company: 'TCS', role: 'Software Engineer', stage: 'INTERVIEW', date: '2026-04-07', deadline: '2026-04-15', logo: 'TC', package: '7 LPA', notes: 'Round 2 technical on Apr 12' },
  { id: 2, company: 'Infosys', role: 'Systems Engineer', stage: 'OA', date: '2026-04-05', deadline: '2026-04-12', logo: 'IN', package: '6.5 LPA', notes: 'OA portal link sent to email' },
  { id: 3, company: 'Goldman Sachs', role: 'Analyst Engineer', stage: 'APPLIED', date: '2026-04-03', deadline: '2026-04-20', logo: 'GS', package: '18 LPA', notes: '2-day deadline — priority application' },
  { id: 4, company: 'Microsoft', role: 'SDE Intern', stage: 'APPLIED', date: '2026-04-01', deadline: '2026-04-25', logo: 'MS', package: '20 LPA', notes: 'Applied via campus portal' },
  { id: 5, company: 'Wipro', role: 'Project Engineer', stage: 'OFFER', date: '2026-03-28', deadline: null, logo: 'WP', package: '5.5 LPA', notes: 'Offer letter received — deciding' },
  { id: 6, company: 'Amazon', role: 'SDE I', stage: 'REJECTED', date: '2026-03-25', deadline: null, logo: 'AZ', package: '24 LPA', notes: 'Did not clear OA' },
];

const STAGE_LABELS = {
  APPLIED: 'Applied',
  OA: 'Online Assessment',
  INTERVIEW: 'Interview',
  OFFER: 'Offer Received',
  REJECTED: 'Rejected',
};

const STAGE_ICONS = {
  APPLIED: <Briefcase size={14} />,
  OA: <AlertCircle size={14} />,
  INTERVIEW: <Clock size={14} />,
  OFFER: <CheckCircle size={14} />,
  REJECTED: <XCircle size={14} />,
};

function AppCard({ app, onMove }) {
  const color = APPLICATION_STAGE_COLORS[app.stage];
  const daysLeft = app.deadline
    ? Math.ceil((new Date(app.deadline) - new Date()) / 86400000)
    : null;

  return (
    <div className="card" style={{ padding: '14px 16px', marginBottom: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8, flexShrink: 0,
          background: 'linear-gradient(135deg, #6c47ff22, #e8439322)',
          border: '1px solid var(--border)',
          display: 'grid', placeItems: 'center',
          fontWeight: 800, fontSize: 12, color: 'var(--text-primary)',
        }}>{app.logo}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>{app.company}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{app.role}</div>
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, color, background: `${color}18`, padding: '2px 8px', borderRadius: 99 }}>
          {app.package}
        </span>
      </div>

      {app.notes && (
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', padding: '8px 10px', background: 'var(--bg-elevated)', borderRadius: 6, marginBottom: 10, lineHeight: 1.5 }}>
          {app.notes}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {daysLeft !== null && (
            <span style={{
              fontSize: 10, padding: '2px 8px', borderRadius: 99, fontWeight: 700,
              background: daysLeft <= 2 ? 'rgba(220,38,38,.1)' : 'rgba(217,119,6,.1)',
              color: daysLeft <= 2 ? '#dc2626' : '#d97706',
            }}>
              {daysLeft <= 0 ? 'Deadline passed' : `${daysLeft}d left`}
            </span>
          )}
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{new Date(app.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {app.stage !== 'OFFER' && app.stage !== 'REJECTED' && (
            <button
              className="btn btn-sm btn-accent"
              style={{ fontSize: 10, padding: '3px 10px' }}
              onClick={() => onMove(app.id, 'next')}
            >
              Advance →
            </button>
          )}
          {app.stage !== 'REJECTED' && app.stage !== 'OFFER' && (
            <button
              className="btn btn-sm"
              style={{ fontSize: 10, padding: '3px 10px', color: '#dc2626' }}
              onClick={() => onMove(app.id, 'reject')}
            >
              Reject
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ApplicationsPage() {
  const { aiAnalysis } = useProfile();
  const { user } = useAuth();
  const [apps, setApps] = useState(INITIAL_APPS);
  const [activeStage, setActiveStage] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newApp, setNewApp] = useState({ company: '', role: '', stage: 'APPLIED', deadline: '', package: '' });
  const [addLoading, setAddLoading] = useState(false);

  // ── Load live applications from the API ────────────────────
  useEffect(() => {
    if (!user?.id) return;
    fetch(`${API_BASE}/api/applications?userId=${user.id}`)
      .then(r => r.json())
      .then(data => {
        if (data?.length) {
          setApps(data.map((a, i) => ({
            id: i + 1,
            company: a.company,
            role: a.role,
            stage: a.stage,
            date: a.date?.split('T')[0] ?? '',
            deadline: a.deadline?.split('T')[0] ?? null,
            logo: a.company.slice(0, 2).toUpperCase(),
            package: 'N/A',
            notes: '',
          })));
        }
      })
      .catch(() => {}); // keep seed on error
  }, [user?.id]);

  // ── Add a new application via API ─────────────────────────
  const submitNewApp = async () => {
    if (!newApp.company || !newApp.role) return;
    setAddLoading(true);
    try {
      // Optimistically add locally
      const optimistic = {
        id: Date.now(),
        company: newApp.company,
        role: newApp.role,
        stage: newApp.stage,
        date: new Date().toISOString().split('T')[0],
        deadline: newApp.deadline || null,
        logo: newApp.company.slice(0, 2).toUpperCase(),
        package: newApp.package || 'N/A',
        notes: '',
      };
      setApps(prev => [optimistic, ...prev]);
      setShowAddModal(false);
      setNewApp({ company: '', role: '', stage: 'APPLIED', deadline: '', package: '' });
      // Persist to Supabase via backend (if endpoint exists; silently ignore if not)
      if (user?.id) {
        fetch(`${API_BASE}/api/applications`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            company: optimistic.company,
            role: optimistic.role,
            stage: optimistic.stage,
            deadline: optimistic.deadline,
          }),
        }).catch(() => {});
      }
    } finally {
      setAddLoading(false);
    }
  };

  const moveApp = (id, direction) => {
    setApps(prev => prev.map(app => {
      if (app.id !== id) return app;
      if (direction === 'reject') return { ...app, stage: 'REJECTED' };
      const idx = APPLICATION_STAGES.indexOf(app.stage);
      const next = APPLICATION_STAGES[Math.min(idx + 1, APPLICATION_STAGES.length - 1)];
      return { ...app, stage: next };
    }));
  };

  const grouped = useMemo(() => {
    const stages = ['APPLIED', 'OA', 'INTERVIEW', 'OFFER', 'REJECTED'];
    const result = {};
    stages.forEach(s => { result[s] = apps.filter(a => a.stage === s); });
    return result;
  }, [apps]);

  const filtered = activeStage === 'ALL' ? apps : apps.filter(a => a.stage === activeStage);

  const activeCount = apps.filter(a => !['OFFER', 'REJECTED'].includes(a.stage)).length;
  const offerCount = apps.filter(a => a.stage === 'OFFER').length;
  const interviewCount = apps.filter(a => a.stage === 'INTERVIEW').length;

  return (
    <div style={{ display: 'grid', gap: 20 }}>

      {/* Header */}
      <div className="gradient-banner">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>📈 Application Tracker</div>
            <div style={{ fontSize: 13, opacity: .8 }}>
              {apps.length} total · {activeCount} active · {offerCount} offer{offerCount !== 1 ? 's' : ''} · {interviewCount} interviews
            </div>
          </div>
          <button
            className="btn"
            style={{ background: 'rgba(255,255,255,.15)', color: '#fff', borderColor: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', gap: 6 }}
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={14} /> Track New
          </button>
        </div>
      </div>

      {/* Pipeline Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
        {['APPLIED', 'OA', 'INTERVIEW', 'OFFER', 'REJECTED'].map(stage => {
          const count = grouped[stage]?.length ?? 0;
          const color = APPLICATION_STAGE_COLORS[stage];
          return (
            <div
              key={stage}
              onClick={() => setActiveStage(activeStage === stage ? 'ALL' : stage)}
              className="card"
              style={{
                padding: '14px 16px', textAlign: 'center', cursor: 'pointer',
                border: `1px solid ${activeStage === stage ? color : 'var(--border)'}`,
                background: activeStage === stage ? `${color}10` : 'var(--bg-card)',
                transition: 'all .2s',
              }}
            >
              <div style={{ fontSize: 22, fontWeight: 800, color, fontFamily: 'monospace' }}>{count}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, fontWeight: 600 }}>{STAGE_LABELS[stage]}</div>
            </div>
          );
        })}
      </div>

      {/* Kanban view — desktop */}
      <div className="card">
        <div className="section-label" style={{ marginBottom: 16 }}>
          <strong>📋 Pipeline Board</strong>
          <button
            onClick={() => setActiveStage('ALL')}
            className="btn btn-sm"
            style={{ marginLeft: 'auto', fontSize: 11 }}
          >All Stages</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {['APPLIED', 'OA', 'INTERVIEW', 'OFFER'].map(stage => {
            const color = APPLICATION_STAGE_COLORS[stage];
            const stageApps = grouped[stage] ?? [];
            return (
              <div key={stage}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 12px', marginBottom: 10,
                  background: `${color}12`,
                  border: `1px solid ${color}40`,
                  borderRadius: 'var(--radius-md)',
                }}>
                  <span style={{ color }}>{STAGE_ICONS[stage]}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color }}>{STAGE_LABELS[stage]}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 800, color }}>{stageApps.length}</span>
                </div>
                {stageApps.map(app => (
                  <AppCard key={app.id} app={app} onMove={moveApp} />
                ))}
                {stageApps.length === 0 && (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 12, border: '2px dashed var(--border)', borderRadius: 'var(--radius-md)' }}>
                    No applications
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Rejected section */}
        {grouped['REJECTED']?.length > 0 && (
          <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(220,38,38,.04)', border: '1px solid rgba(220,38,38,.15)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#dc2626', marginBottom: 10 }}>
              ✕ Rejected ({grouped['REJECTED'].length})
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
              {grouped['REJECTED'].map(app => (
                <div key={app.id} style={{ padding: '8px 12px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', opacity: 0.7 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{app.company}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{app.role}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* AI Insight */}
      {aiAnalysis?.topRoles?.[0] && (
        <div className="card" style={{ padding: '16px 20px', background: 'linear-gradient(135deg, rgba(108,71,255,.06), rgba(232,67,147,.04))', border: '1px solid rgba(108,71,255,.2)' }}>
          <div className="section-label"><strong>🤖 AI Recommendation</strong></div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
            Based on your skills and placement score of <strong>{aiAnalysis.placementScore}/100</strong>,
            you should prioritize applying to <strong>{aiAnalysis.topRoles[0]}</strong> roles.
            Aim for 5–8 active applications at any time to maximize selection probability.
            Focus interview prep on your top company with the nearest deadline.
          </p>
        </div>
      )}

      {/* Add Application Modal */}
      {showAddModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowAddModal(false)}
        >
          <div className="modal-content slide-up" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, margin: 0 }}>Track New Application</h3>
              <button className="btn btn-sm" onClick={() => setShowAddModal(false)} style={{ padding: '4px 8px' }}>
                <X size={14} />
              </button>
            </div>
            <div style={{ display: 'grid', gap: 14 }}>
              {[['company', 'Company Name', 'e.g. Goldman Sachs'], ['role', 'Role / Position', 'e.g. SDE Intern'], ['package', 'Package (optional)', 'e.g. 18 LPA']].map(([field, label, placeholder]) => (
                <div key={field}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>{label}</label>
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={newApp[field]}
                    onChange={e => setNewApp(p => ({ ...p, [field]: e.target.value }))}
                    style={{
                      width: '100%', padding: '10px 14px',
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border)',
                      borderRadius: 8, fontSize: 13,
                      color: 'var(--text-primary)', fontFamily: 'inherit',
                      outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Stage</label>
                  <select
                    value={newApp.stage}
                    onChange={e => setNewApp(p => ({ ...p, stage: e.target.value }))}
                    style={{
                      width: '100%', padding: '10px 14px',
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border)',
                      borderRadius: 8, fontSize: 13,
                      color: 'var(--text-primary)', fontFamily: 'inherit',
                    }}
                  >
                    {APPLICATION_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Deadline</label>
                  <input
                    type="date"
                    value={newApp.deadline}
                    onChange={e => setNewApp(p => ({ ...p, deadline: e.target.value }))}
                    style={{
                      width: '100%', padding: '10px 14px',
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border)',
                      borderRadius: 8, fontSize: 13,
                      color: 'var(--text-primary)', fontFamily: 'inherit',
                    }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                <button
                  className="btn btn-accent"
                  onClick={submitNewApp}
                  disabled={addLoading || !newApp.company || !newApp.role}
                >
                  {addLoading ? 'Saving...' : '+ Add Application'}
                </button>
                <button className="btn" onClick={() => setShowAddModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
