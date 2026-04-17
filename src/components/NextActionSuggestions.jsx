import { ArrowRight, BookOpen, Briefcase, MessageSquare } from 'lucide-react';

const ACTION_CONFIG = {
  Apply: { icon: Briefcase, color: '#059669', bg: 'rgba(16,185,129,.06)', border: 'rgba(16,185,129,.15)' },
  Upskill: { icon: BookOpen, color: '#d97706', bg: 'rgba(245,158,11,.06)', border: 'rgba(245,158,11,.15)' },
  'Mock Interview': { icon: MessageSquare, color: '#7c3aed', bg: 'rgba(124,58,237,.06)', border: 'rgba(124,58,237,.15)' },
};

export default function NextActionSuggestions({ actions }) {
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      {actions.map((action) => {
        const config = ACTION_CONFIG[action.type] || ACTION_CONFIG.Apply;
        const Icon = config.icon;
        return (
          <div key={action.id} className="action-card" style={{ borderColor: config.border }}>
            <div className="action-icon" style={{ background: config.bg, border: `1px solid ${config.border}` }}>
              <Icon size={16} color={config.color} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: config.color, marginBottom: 2 }}>
                {action.type}
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{action.text}</div>
            </div>
            <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
          </div>
        );
      })}
    </div>
  );
}
