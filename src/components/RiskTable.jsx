import { useMemo, useState } from 'react';
import { Search, ChevronDown, ChevronUp, Send } from 'lucide-react';

export default function RiskTable({ rows = [] }) {
  const [query, setQuery] = useState('');
  const [risk, setRisk] = useState('ALL');
  const [open, setOpen] = useState(null);
  const [sortBy, setSortBy] = useState('riskScore');
  const [sortDir, setSortDir] = useState('desc');

  const toggleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('desc'); }
  };

  const filtered = useMemo(() => rows
    .filter((r) => risk === 'ALL' || (r.riskScore > 0.7 ? 'HIGH' : r.riskScore > 0.4 ? 'MEDIUM' : 'LOW') === risk)
    .filter((r) => r.name.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      if (sortBy === 'name') return dir * a.name.localeCompare(b.name);
      return dir * (a.riskScore - b.riskScore);
    }), [rows, query, risk, sortBy, sortDir]);

  const SortIcon = ({ col }) => {
    if (sortBy !== col) return null;
    return sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
  };

  return (
    <div className="card">
      <div className="section-label">
        <strong>Student Risk Monitor</strong>
        <span className="live-dot">LIVE</span>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <div className="input" style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
          <Search size={14} style={{ color: 'var(--text-muted)' }} />
          <input style={{ background: 'transparent', border: 0, color: 'inherit', outline: 'none', width: '100%', fontFamily: 'inherit', fontSize: 13 }} placeholder="Search students..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <select className="input" value={risk} onChange={(e) => setRisk(e.target.value)}>
          <option value="ALL">All Risk</option>
          <option value="HIGH">High Risk</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low Risk</option>
        </select>
      </div>

      <div style={{ maxHeight: 400, overflow: 'auto' }}>
        <table className="table">
          <thead>
            <tr>
              <th onClick={() => toggleSort('name')} style={{ cursor: 'pointer' }}>Student <SortIcon col="name" /></th>
              <th>Branch</th>
              <th onClick={() => toggleSort('riskScore')} style={{ cursor: 'pointer' }}>Score <SortIcon col="riskScore" /></th>
              <th>Risk</th>
              <th>Status</th>
              <th>Active</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => {
              const level = r.riskScore > 0.7 ? 'HIGH' : r.riskScore > 0.4 ? 'MEDIUM' : 'LOW';
              const levelClass = level === 'HIGH' ? 'pill-urgent' : level === 'MEDIUM' ? 'pill-high' : 'pill-success';
              const score = Math.round((1 - r.riskScore) * 100);
              const scoreColor = score > 60 ? '#059669' : score > 40 ? '#d97706' : '#dc2626';

              return (
                <tr key={r.id} onClick={() => setOpen(open === i ? null : i)} style={{ cursor: 'pointer' }}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{r.name}</td>
                  <td>{r.branch}</td>
                  <td><span className="mono" style={{ color: scoreColor, fontWeight: 700 }}>{score}</span></td>
                  <td><span className={`pill ${levelClass}`} style={{ fontSize: 10 }}>{level}</span></td>
                  <td><span className={`pill ${r.placementStatus === 'Placed' ? 'pill-success' : 'pill-high'}`} style={{ fontSize: 10 }}>{r.placementStatus}</span></td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.lastActive}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-purple" onClick={(e) => { e.stopPropagation(); }}>
                      <Send size={10} /> Alert
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
