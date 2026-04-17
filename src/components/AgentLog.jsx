import { Filter, Calendar } from 'lucide-react';

export default function AgentLog({ items }) {
  const riskColors = { LOW: 'pill-success', MEDIUM: 'pill-high', HIGH: 'pill-urgent' };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div className="section-label" style={{ marginBottom: 0 }}>
          <strong>Agent Activity Log</strong>
          <span className="live-dot">LIVE</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-sm"><Filter size={12} /> Filter</button>
          <button className="btn btn-sm"><Calendar size={12} /> Today</button>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Student</th>
            <th>Action Taken</th>
            <th>Risk</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, i) => (
            <tr key={i} className="fade-in" style={{ animationDelay: `${i * .06}s` }}>
              <td className="mono" style={{ fontSize: 12, color: 'var(--text-muted)' }}>{it.time}</td>
              <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{it.student}</td>
              <td>{it.action}</td>
              <td><span className={`pill ${riskColors[it.risk] || 'pill-normal'}`} style={{ fontSize: 10 }}>{it.risk}</span></td>
              <td style={{ color: '#059669', fontWeight: 500 }}>{it.result}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
