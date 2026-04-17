export default function RecommendationCard({ item, onApply }) {
  const priorityClass = item.priority === 'URGENT' ? 'pill-urgent' : item.priority === 'HIGH' ? 'pill-high' : 'pill-normal';
  const probColor = item.selectionProbability >= 70 ? 'var(--accent-green)' : item.selectionProbability >= 50 ? 'var(--accent-yellow)' : 'var(--accent-red)';

  return (
    <div className="card fade-in" style={{ padding: 18, marginTop: 12, borderLeft: '3px solid var(--accent-purple)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className={`pill ${priorityClass}`}>{item.priority}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="mono" style={{ fontSize: 12, color: probColor, fontWeight: 600 }}>{item.selectionProbability}% chance</span>
          <span style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'var(--bg-elevated)',
            display: 'grid', placeItems: 'center',
            fontWeight: 700, fontSize: 12,
            border: '1px solid var(--border)',
            color: 'var(--accent-purple)',
          }}>{item.initials}</span>
        </div>
      </div>

      <div style={{ marginTop: 10 }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>{item.company}</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{item.role}</div>
      </div>

      <div style={{ marginTop: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
          <span style={{ color: 'var(--text-muted)' }}>Match Score</span>
          <span className="mono" style={{ color: 'var(--accent-purple)', fontWeight: 700 }}>{item.match}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${item.match}%`, background: 'linear-gradient(90deg, #6c47ff, #e84393)' }} />
        </div>
      </div>

      <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Gaps:</span>
        {item.gaps.map((g) => <span key={g} className="pill pill-urgent" style={{ fontSize: 11, padding: '2px 8px' }}>+{g}</span>)}
      </div>

      <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
        <button className="btn btn-accent btn-sm" onClick={() => onApply(item)}>Apply Now</button>
        <button className="btn btn-outline-purple btn-sm">View JD</button>
      </div>

      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 10, lineHeight: 1.5, padding: '8px 12px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)' }}>
        🤖 {item.reasoning}
      </div>
    </div>
  );
}
