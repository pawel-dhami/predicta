/**
 * AlertsPage — /alerts
 * Smart alerts, deadlines, and notifications hub with filtering.
 * Action buttons route to the correct pages.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { Bell, AlertTriangle, Info, Clock, CheckCircle, X } from 'lucide-react';
import { alertsSeed } from '../data/mockStudents';

// Map each alert's actionText to a route
const ACTION_ROUTES = {
  'Complete application now': '/applications',
  'Start aptitude sprint':    '/roadmap',
  'View job description':     '/jobs',
  'Prepare now':              '/ai-mentor',
  'Start learning path':      '/roadmap',
  'View job listings':        '/jobs',
  'Start DSA sprint':         '/roadmap',
  'Register now':             '/applications',
  'Open OA portal':           '/applications',
  'View dashboard':           '/dashboard',
  'Complete application':     '/applications',
  'Start aptitude sprint':    '/roadmap',
  'View JD':                  '/jobs',
};

const EXTENDED_ALERTS = [
  // alertsSeed (id 1-5)
  { id: 1, type: 'urgent',  text: 'Goldman Sachs application deadline in 2 days',           time: '2 hours ago',  deadline: '2026-04-25', actionText: 'Complete application now' },
  { id: 2, type: 'warning', text: 'OA score dipped below threshold in aptitude',             time: '5 hours ago',  deadline: null,         actionText: 'Start aptitude sprint' },
  { id: 3, type: 'info',    text: 'New Infosys role matched to your profile',                time: '1 day ago',    deadline: '2026-04-30', actionText: 'View job description' },
  { id: 4, type: 'urgent',  text: 'Mock interview scheduled for tomorrow 10 AM',             time: '3 hours ago',  deadline: '2026-04-15', actionText: 'Prepare now' },
  { id: 5, type: 'warning', text: 'System Design skill below company threshold',             time: '1 day ago',    deadline: null,         actionText: 'Start learning path' },
  { id: 6, type: 'info',    text: 'TCS Digital Engineer role opening — 34 students matched', time: '2 days ago',   deadline: '2026-04-28', actionText: 'View job listings' },
  { id: 7, type: 'warning', text: 'DSA skill score dropped below threshold for Microsoft',   time: '3 days ago',   deadline: null,         actionText: 'Start DSA sprint' },
  { id: 8, type: 'info',    text: 'New campus drive announced: Wipro on Apr 22',             time: '3 days ago',   deadline: '2026-04-22', actionText: 'Register now' },
  { id: 9, type: 'urgent',  text: 'Infosys OA link expires in 6 hours',                     time: '45 min ago',   deadline: '2026-04-18', actionText: 'Open OA portal' },
  { id: 10, type: 'info',   text: 'Profile score improved to 85/100 after LinkedIn analysis',time: '1 day ago',    deadline: null,         actionText: 'View dashboard' },
];

const TYPE_CONFIG = {
  urgent: {
    color: '#dc2626',
    bg: 'rgba(220,38,38,.06)',
    border: 'rgba(220,38,38,.2)',
    icon: AlertTriangle,
    label: 'Urgent',
    pillColor: '#dc2626',
  },
  warning: {
    color: '#d97706',
    bg: 'rgba(217,119,6,.06)',
    border: 'rgba(217,119,6,.2)',
    icon: AlertTriangle,
    label: 'Warning',
    pillColor: '#d97706',
  },
  info: {
    color: '#0891b2',
    bg: 'rgba(8,145,178,.06)',
    border: 'rgba(8,145,178,.2)',
    icon: Info,
    label: 'Info',
    pillColor: '#0891b2',
  },
};

function AlertCard({ alert, onDismiss, onAction }) {
  const cfg = TYPE_CONFIG[alert.type] ?? TYPE_CONFIG.info;
  const Icon = cfg.icon;
  const daysLeft = alert.deadline
    ? Math.ceil((new Date(alert.deadline) - new Date()) / 86400000)
    : null;

  return (
    <div style={{
      display: 'flex', gap: 14, alignItems: 'flex-start',
      padding: '16px 18px',
      background: cfg.bg,
      border: `1px solid ${cfg.border}`,
      borderRadius: 'var(--radius-md)',
      marginBottom: 10,
      transition: 'all .2s',
    }}>
      {/* Icon */}
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: `${cfg.color}18`,
        display: 'grid', placeItems: 'center',
      }}>
        <Icon size={16} style={{ color: cfg.color }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', marginBottom: 6, lineHeight: 1.4 }}>
          {alert.text}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
            <Clock size={10} /> {alert.time}
          </span>
          {daysLeft !== null && (
            <span style={{
              fontSize: 10, padding: '2px 8px', borderRadius: 99,
              fontWeight: 700,
              background: daysLeft <= 2 ? 'rgba(220,38,38,.12)' : 'rgba(217,119,6,.12)',
              color: daysLeft <= 2 ? '#dc2626' : '#d97706',
            }}>
              {daysLeft <= 0 ? 'Overdue' : `${daysLeft}d left`}
            </span>
          )}
          <span style={{
            fontSize: 10, padding: '2px 8px', borderRadius: 99, fontWeight: 700,
            background: `${cfg.pillColor}18`, color: cfg.pillColor,
          }}>{cfg.label}</span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 6, flexShrink: 0, alignItems: 'center' }}>
        <button
          className="btn btn-sm btn-accent"
          style={{ fontSize: 11, whiteSpace: 'nowrap' }}
          onClick={() => onAction(alert.actionText)}
        >
          {alert.actionText}
        </button>
        <button
          onClick={() => onDismiss(alert.id)}
          className="btn btn-sm"
          style={{ padding: '4px 8px', color: 'var(--text-muted)' }}
          title="Dismiss"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  );
}

const PREF_DEFAULTS = {
  'Application deadlines': true,
  'Skill gap warnings': true,
  'New job matches': true,
  'Interview reminders': true,
  'Campus drive announcements': false,
};

export default function AlertsPage() {
  const { aiAnalysis } = useProfile();
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState(EXTENDED_ALERTS);
  const [filter, setFilter] = useState('all');
  const [dismissedAll, setDismissedAll] = useState(false);
  const [prefs, setPrefs] = useState(PREF_DEFAULTS);

  const handleAction = (actionText) => {
    const route = ACTION_ROUTES[actionText] ?? '/dashboard';
    navigate(route);
  };

  const dismiss = (id) => setAlerts(prev => prev.filter(a => a.id !== id));
  const dismissAll = () => { setAlerts([]); setDismissedAll(true); };
  const togglePref = (label) => setPrefs(p => ({ ...p, [label]: !p[label] }));

  const filtered = filter === 'all' ? alerts : alerts.filter(a => a.type === filter);

  const urgentCount = alerts.filter(a => a.type === 'urgent').length;
  const warningCount = alerts.filter(a => a.type === 'warning').length;
  const infoCount = alerts.filter(a => a.type === 'info').length;

  const upcoming = alerts
    .filter(a => a.deadline)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 4);

  return (
    <div style={{ display: 'grid', gap: 20 }}>

      {/* Header */}
      <div className="gradient-banner">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
              🔔 Smart Alerts & Deadlines
              {urgentCount > 0 && (
                <span style={{ background: '#dc2626', color: '#fff', borderRadius: 99, fontSize: 11, padding: '2px 8px', fontWeight: 700 }}>
                  {urgentCount} urgent
                </span>
              )}
            </div>
            <div style={{ fontSize: 13, opacity: .8 }}>
              {alerts.length} active notifications · {upcoming.length} deadlines coming up
            </div>
          </div>
          {alerts.length > 0 && (
            <button
              onClick={dismissAll}
              className="btn"
              style={{ background: 'rgba(255,255,255,.15)', color: '#fff', borderColor: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <CheckCircle size={14} /> Mark All Read
            </button>
          )}
        </div>
      </div>

      {/* Stat row */}
      <div className="grid-4">
        {[
          { label: 'Total Active', val: alerts.length, color: 'var(--accent-purple)' },
          { label: 'Urgent', val: urgentCount, color: '#dc2626' },
          { label: 'Warnings', val: warningCount, color: '#d97706' },
          { label: 'Info', val: infoCount, color: '#0891b2' },
        ].map(({ label, val, color }) => (
          <div key={label} className="card" style={{ padding: '14px 18px', textAlign: 'center' }}>
            <div style={{ fontSize: 26, fontWeight: 800, color, fontFamily: 'monospace' }}>{val}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2-main">
        {/* Alerts list */}
        <div>
          {/* Filter bar */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
            {[['all', 'All', alerts.length], ['urgent', 'Urgent', urgentCount], ['warning', 'Warning', warningCount], ['info', 'Info', infoCount]].map(([val, label, count]) => (
              <button
                key={val}
                onClick={() => setFilter(val)}
                className={`btn btn-sm ${filter === val ? 'btn-accent' : ''}`}
                style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}
              >
                {label}
                <span style={{ background: filter === val ? 'rgba(255,255,255,.3)' : 'var(--bg-elevated)', borderRadius: 99, padding: '0 5px', fontSize: 10, fontWeight: 700 }}>{count}</span>
              </button>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="card" style={{ padding: 40, textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{dismissedAll ? '🎉' : '✅'}</div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6, color: 'var(--text-primary)' }}>
                {dismissedAll ? 'All caught up!' : 'No alerts in this category'}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                {dismissedAll ? "You've reviewed all your notifications." : 'Try switching filters above.'}
              </div>
              {dismissedAll && (
                <button className="btn btn-accent btn-sm" style={{ marginTop: 16 }} onClick={() => { setAlerts(EXTENDED_ALERTS); setDismissedAll(false); }}>
                  Restore Alerts
                </button>
              )}
            </div>
          )}

          {filtered.map(alert => (
            <AlertCard key={alert.id} alert={alert} onDismiss={dismiss} onAction={handleAction} />
          ))}
        </div>

        {/* Sidebar */}
        <div>
          {/* Upcoming deadlines */}
          <div className="card" style={{ marginBottom: 14 }}>
            <div className="section-label"><strong>📅 Upcoming Deadlines</strong></div>
            {upcoming.length === 0 && (
              <div style={{ fontSize: 13, color: 'var(--text-muted)', padding: '12px 0' }}>No upcoming deadlines.</div>
            )}
            {upcoming.map(alert => {
              const daysLeft = Math.ceil((new Date(alert.deadline) - new Date()) / 86400000);
              const color = daysLeft <= 2 ? '#dc2626' : daysLeft <= 5 ? '#d97706' : '#10b981';
              return (
                <div key={alert.id} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                    background: `${color}10`, border: `1px solid ${color}30`,
                    display: 'grid', placeItems: 'center', textAlign: 'center',
                  }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color, fontFamily: 'monospace', lineHeight: 1 }}>{Math.max(0, daysLeft)}</div>
                    <div style={{ fontSize: 8, color, fontWeight: 700 }}>DAYS</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4, marginBottom: 3 }}>{alert.text}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                        {new Date(alert.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                      <button
                        className="btn btn-sm"
                        style={{ fontSize: 10, padding: '2px 8px', color: 'var(--accent-purple)' }}
                        onClick={() => handleAction(alert.actionText)}
                      >
                        {alert.actionText} →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Alert preferences with working toggles */}
          <div className="card" style={{ padding: '16px 18px' }}>
            <div className="section-label"><strong>⚙️ Alert Preferences</strong></div>
            {Object.entries(prefs).map(([label, active]) => (
              <div
                key={label}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                onClick={() => togglePref(label)}
              >
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{label}</span>
                <div style={{
                  width: 36, height: 20, borderRadius: 99,
                  background: active ? 'var(--accent-purple)' : 'var(--border)',
                  position: 'relative', transition: 'background .2s',
                }}>
                  <div style={{
                    width: 14, height: 14, borderRadius: 99, background: '#fff',
                    position: 'absolute', top: 3,
                    left: active ? 18 : 4,
                    transition: 'left .2s',
                    boxShadow: '0 1px 4px rgba(0,0,0,.2)',
                  }} />
                </div>
              </div>
            ))}
            <div style={{ marginTop: 12, fontSize: 11, color: 'var(--text-muted)' }}>
              Changes apply to future notifications only.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
