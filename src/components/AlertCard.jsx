import { useState } from 'react';
import { AlertTriangle, Bell, Info, X, Clock, ArrowRight } from 'lucide-react';

const config = {
  urgent: { color: '#dc2626', bg: 'rgba(239,68,68,.05)', border: 'rgba(239,68,68,.15)', icon: AlertTriangle, label: 'URGENT' },
  warning: { color: '#d97706', bg: 'rgba(245,158,11,.05)', border: 'rgba(245,158,11,.15)', icon: Bell, label: 'WARNING' },
  info: { color: '#0891b2', bg: 'rgba(6,182,212,.05)', border: 'rgba(6,182,212,.15)', icon: Info, label: 'INFO' },
};

export default function AlertCard({ alert }) {
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;

  const cfg = config[alert.type] || config.info;
  const Icon = cfg.icon;

  return (
    <div className="fade-in" style={{
      display: 'flex', gap: 12, alignItems: 'flex-start',
      padding: '14px 16px',
      background: cfg.bg,
      borderRadius: 'var(--radius-lg)',
      border: `1px solid ${cfg.border}`,
      marginBottom: 8,
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: 10,
        background: `${cfg.color}10`,
        display: 'grid', placeItems: 'center',
        flexShrink: 0,
      }}>
        <Icon size={16} color={cfg.color} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: cfg.color }}>{cfg.label}</span>
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.5, color: 'var(--text-primary)' }}>{alert.text}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={11} /> {alert.time}</span>
          {alert.deadline && <span>📅 {alert.deadline}</span>}
          {alert.actionText && (
            <button className="btn btn-sm" style={{ borderColor: cfg.color, color: cfg.color, padding: '3px 10px', fontSize: 11 }}>
              {alert.actionText} <ArrowRight size={10} />
            </button>
          )}
        </div>
      </div>

      <button
        onClick={() => setHidden(true)}
        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4, flexShrink: 0 }}
      >
        <X size={14} />
      </button>
    </div>
  );
}
