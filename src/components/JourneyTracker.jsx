export default function JourneyTracker({ stages }) {
  return (
    <div style={{ display: 'grid', gap: 0, padding: '4px 0' }}>
      {stages.map((stage, i) => (
        <div key={stage.name}>
          <div className="journey-step">
            <div className={`step-dot ${stage.status}`}>
              {stage.status === 'completed' ? '✓' : stage.status === 'current' ? '→' : (i + 1)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontWeight: stage.status === 'current' ? 700 : 500,
                color: stage.status === 'pending' ? 'var(--text-muted)' : 'var(--text-primary)',
                fontSize: 14,
              }}>
                {stage.name}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                {stage.status === 'completed' ? 'Completed' : stage.status === 'current' ? 'In Progress' : 'Upcoming'}
              </div>
            </div>
            {stage.status === 'completed' && <span className="pill pill-success" style={{ fontSize: 10 }}>Done</span>}
            {stage.status === 'current' && <span className="pill pill-purple" style={{ fontSize: 10 }}>Active</span>}
          </div>
          {i < stages.length - 1 && (
            <div className="step-line" style={{
              background: stage.status === 'completed' ? 'var(--accent-green)' : 'var(--border)',
            }} />
          )}
        </div>
      ))}
    </div>
  );
}
