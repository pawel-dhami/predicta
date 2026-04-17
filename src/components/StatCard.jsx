export default function StatCard({ title, value, subtitle, accent = '#6c47ff', extra, mono, icon }) {
  return (
    <div className="stat-card fade-in">
      <div className="stat-accent" style={{ background: accent }} />
      <div className="stat-glow" style={{ background: accent }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div className="stat-title">{title}</div>
        {icon && <span style={{ fontSize: 18, opacity: .6 }}>{icon}</span>}
      </div>
      <div className={`stat-value ${mono ? 'mono' : ''}`}>{value}</div>
      {subtitle && <div className="stat-subtitle">{subtitle}</div>}
      {extra && <div className="stat-extra" style={{ color: accent }}>{extra}</div>}
    </div>
  );
}
