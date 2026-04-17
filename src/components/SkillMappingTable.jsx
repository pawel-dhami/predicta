export default function SkillMappingTable({ skills, companyRequirements }) {
  return (
    <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <table className="table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Role</th>
            <th>Match</th>
            <th>Top Gaps</th>
            <th>Probability</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {companyRequirements.map((req) => {
            const keys = Object.keys(req.requirements);
            const deltas = keys.map((k) => ({ key: k, gap: req.requirements[k] - (skills[k] || 0) }));
            const avgGap = deltas.reduce((acc, x) => acc + Math.max(0, x.gap), 0) / keys.length;
            const match = Math.max(30, Math.round(100 - avgGap * 10));
            const gaps = deltas.filter((x) => x.gap > 0).sort((a, b) => b.gap - a.gap);
            const topGaps = gaps.slice(0, 2).map((x) => x.key);
            const probability = Math.max(15, Math.round(match * 0.85 - gaps.length * 3));
            const matchColor = match >= 80 ? '#059669' : match >= 60 ? '#d97706' : '#dc2626';
            const probColor = probability >= 60 ? '#059669' : probability >= 40 ? '#d97706' : '#dc2626';

            return (
              <tr key={req.company}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border)',
                      display: 'grid', placeItems: 'center',
                      fontSize: 11, fontWeight: 700,
                      color: 'var(--accent-purple)',
                    }}>{req.logo}</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{req.company}</span>
                  </div>
                </td>
                <td>{req.role}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="progress-bar" style={{ width: 60 }}>
                      <div className="progress-fill" style={{ width: `${match}%`, background: matchColor }} />
                    </div>
                    <span className="mono" style={{ fontSize: 13, fontWeight: 700, color: matchColor }}>{match}%</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {topGaps.length ? topGaps.map((g) => (
                      <span key={g} className="pill pill-urgent" style={{ fontSize: 10, padding: '1px 7px' }}>+{g}</span>
                    )) : <span className="pill pill-success" style={{ fontSize: 10 }}>✓ Ready</span>}
                  </div>
                </td>
                <td>
                  <span className="mono" style={{ fontSize: 13, fontWeight: 700, color: probColor }}>{probability}%</span>
                </td>
                <td>
                  <button className="btn btn-sm btn-accent">Apply</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
