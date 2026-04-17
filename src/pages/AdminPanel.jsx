import { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import RiskTable from '../components/RiskTable';
import AgentLog from '../components/AgentLog';
import { batchRealtimeMetrics, mockStudents } from '../data/mockStudents';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, Area, AreaChart, CartesianGrid } from 'recharts';
import { API_BASE } from '../lib/api';

const logs = [
  { time: '10:21', student: 'Arjun S.', action: 'Generated personalized roadmap', risk: 'MEDIUM', result: 'Roadmap sent' },
  { time: '11:05', student: 'Batch', action: 'Sent deadline alert to 12 students', risk: 'HIGH', result: '12 Delivered' },
  { time: '11:40', student: 'Priya N.', action: 'Matched 5 students to Infosys JD', risk: 'LOW', result: '5 matches' },
  { time: '12:10', student: 'Sahil M.', action: 'Flagged System Design skill gap', risk: 'MEDIUM', result: 'Alert sent' },
  { time: '12:45', student: 'Batch', action: 'Updated selection probabilities', risk: 'LOW', result: '284 updated' },
  { time: '13:15', student: 'Neha J.', action: 'Scheduled mock interview prep', risk: 'HIGH', result: 'Pending' },
];

const skillDistribution = [
  { skill: 'DSA', avg: 6.8 },
  { skill: 'SQL', avg: 7.2 },
  { skill: 'Comm', avg: 7.5 },
  { skill: 'SysDes', avg: 4.8 },
  { skill: 'Projects', avg: 7.0 },
  { skill: 'Aptitude', avg: 6.4 },
];

const companyMatches = [
  { company: 'Infosys', matched: 74, openRoles: 22, placed: 18 },
  { company: 'TCS', matched: 91, openRoles: 30, placed: 24 },
  { company: 'Goldman Sachs', matched: 26, openRoles: 8, placed: 5 },
  { company: 'Microsoft', matched: 15, openRoles: 5, placed: 3 },
  { company: 'Amazon', matched: 20, openRoles: 6, placed: 2 },
];

export default function AdminPanel() {
  const [updatedAt, setUpdatedAt] = useState(new Date().toLocaleTimeString());
  const [activeTab, setActiveTab] = useState('funnel');

  // ── Live data from backend ─────────────────────────────────────
  const [metrics, setMetrics] = useState(batchRealtimeMetrics);
  const [riskRows, setRiskRows] = useState(mockStudents);

  useEffect(() => {
    // Refresh clock every 5s
    const id = setInterval(() => setUpdatedAt(new Date().toLocaleTimeString()), 5000);

    // Fetch live batch metrics
    fetch(`${API_BASE}/api/admin/batch-metrics`)
      .then(r => r.json())
      .then(data => {
        if (data?.totalStudents !== undefined) {
          setMetrics(prev => ({
            ...prev,
            totalStudents: data.totalStudents,
            placed: data.placed,
            atRisk: data.atRisk,
            activeApplications: data.activeApplications,
            avgScore: data.avgScore,
            placementRate: data.placementRate,
            avgPackage: data.avgPackage !== 'N/A' ? data.avgPackage : prev.avgPackage,
            highestPackage: data.highestPackage !== 'N/A' ? data.highestPackage : prev.highestPackage,
            registered: data.totalStudents,
            skillReady: Math.round(data.totalStudents * 0.74),
            applied: data.activeApplications,
            interview: Math.round(data.activeApplications * 0.47),
            offer: data.placed,
          }));
        }
      })
      .catch(() => {});

    // Fetch at-risk students
    fetch(`${API_BASE}/api/admin/risk-students`)
      .then(r => r.json())
      .then(data => {
        if (data?.length) {
          setRiskRows(data.map(s => ({
            ...s,
            applications: [],
          })));
        }
      })
      .catch(() => {});

    return () => clearInterval(id);
  }, []);

  // Build funnel from live metrics
  const funnelData = [
    { name: 'Registered', value: metrics.registered || metrics.totalStudents, color: '#6c47ff' },
    { name: 'Skill Ready', value: metrics.skillReady || Math.round((metrics.totalStudents || 0) * 0.74), color: '#8b5cf6' },
    { name: 'Applied',    value: metrics.applied || metrics.activeApplications, color: '#c084fc' },
    { name: 'Interview',  value: metrics.interview || Math.round((metrics.activeApplications || 0) * 0.47), color: '#e84393' },
    { name: 'Offer',      value: metrics.offer || metrics.placed, color: '#10b981' },
  ];

  const trendData = [
    { month: 'Jan', placements: 12 },
    { month: 'Feb', placements: 28 },
    { month: 'Mar', placements: 45 },
    { month: 'Apr', placements: metrics.placed || 97 },
  ];

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      {/* ── Gradient Live Banner — like reference ─────────────── */}
      <div className="gradient-banner">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18, fontWeight: 800 }}>📊 Real-time Analytics for TPC</span>
              <span style={{ background: 'rgba(255,255,255,.2)', padding: '2px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600 }}>● LIVE</span>
            </div>
            <div style={{ fontSize: 13, opacity: .8, marginTop: 4 }}>
              Live batch monitoring · Last updated at <span className="mono">{updatedAt}</span>
            </div>
          </div>
          <button className="btn" style={{ background: 'rgba(255,255,255,.15)', color: '#fff', borderColor: 'rgba(255,255,255,.2)' }}>Export Report</button>
        </div>
      </div>

      {/* ── Stat Cards ────────────────────────────────────────── */}
      <div className="grid-4" style={{ gridTemplateColumns: 'repeat(5, minmax(0,1fr))' }}>
        <StatCard title="Total Students" value={metrics.totalStudents} accent="#6c47ff" icon="👥" subtitle="Batch 2026" />
        <StatCard title="Placed" value={`${metrics.placed} (${metrics.placementRate}%)`} accent="#10b981" icon="✅" subtitle="YTD placements" />
        <StatCard title="At Risk" value={metrics.atRisk} accent="#dc2626" icon="⚠️" subtitle="Need intervention" />
        <StatCard title="Active Apps" value={metrics.activeApplications} accent="#d97706" icon="📋" subtitle="All companies" />
        <StatCard title="Avg Score" value={`${metrics.avgScore}/100`} accent="#7c3aed" mono icon="📊" subtitle="Batch average" />
      </div>

      <div className="grid-2">
        <StatCard title="Average Package" value={metrics.avgPackage} accent="#6c47ff" mono icon="💰" subtitle="Mean CTC" />
        <StatCard title="Highest Package" value={metrics.highestPackage} accent="#10b981" mono icon="🏆" subtitle="Best offer" />
      </div>

      {/* ── Risk Table + Analytics ─────────────────────────────── */}
      <div className="grid-2-main">
        <RiskTable rows={riskRows} />
        <div className="card">
          <div className="section-label" style={{ marginBottom: 6 }}>
            <strong>📈 Batch Analytics</strong>
          </div>

          {/* Tab nav — like reference */}
          <div className="tab-nav" style={{ marginBottom: 16 }}>
            {['funnel', 'skills', 'companies'].map((tab) => (
              <button
                key={tab}
                className={`tab-item ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'funnel' ? '🔽 Funnel' : tab === 'skills' ? '🧠 Skills' : '🏢 Companies'}
              </button>
            ))}
          </div>

          {activeTab === 'funnel' && (
            <div className="fade-in">
              <div style={{ display: 'grid', gap: 8 }}>
                {funnelData.map((f) => (
                  <div key={f.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ width: 80, fontSize: 12, color: 'var(--text-muted)', textAlign: 'right' }}>{f.name}</span>
                    <div className="funnel-bar" style={{ width: `${(f.value / funnelData[0].value) * 100}%`, background: f.color, minWidth: 60 }}>
                      {f.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Trend line — like reference incident frequency chart */}
              <div style={{ marginTop: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Placement Trend</div>
                <div style={{ height: 160 }}>
                  <ResponsiveContainer>
                    <AreaChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ebe5f5" />
                      <XAxis dataKey="month" tick={{ fill: '#9890aa', fontSize: 12 }} axisLine={{ stroke: '#ebe5f5' }} />
                      <YAxis tick={{ fill: '#9890aa', fontSize: 12 }} axisLine={{ stroke: '#ebe5f5' }} />
                      <Tooltip contentStyle={{ background: '#fff', border: '1px solid #ebe5f5', borderRadius: 10, fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,.08)' }} />
                      <Area type="monotone" dataKey="placements" stroke="#6c47ff" fill="url(#purpleGrad)" strokeWidth={2.5} dot={{ r: 4, fill: '#6c47ff', stroke: '#fff', strokeWidth: 2 }} />
                      <defs>
                        <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6c47ff" stopOpacity={0.2} />
                          <stop offset="100%" stopColor="#6c47ff" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="fade-in" style={{ height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={skillDistribution} layout="vertical">
                  <XAxis type="number" domain={[0, 10]} tick={{ fill: '#9890aa', fontSize: 11 }} axisLine={{ stroke: '#ebe5f5' }} />
                  <YAxis type="category" dataKey="skill" tick={{ fill: '#5c5478', fontSize: 12 }} width={60} axisLine={{ stroke: '#ebe5f5' }} />
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid #ebe5f5', borderRadius: 10, fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,.08)' }} />
                  <Bar dataKey="avg" radius={[0, 6, 6, 0]}>
                    {skillDistribution.map((entry) => (
                      <Cell key={entry.skill} fill={entry.avg >= 7 ? '#10b981' : entry.avg >= 5 ? '#d97706' : '#dc2626'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {activeTab === 'companies' && (
            <div className="fade-in">
              <table className="table">
                <thead>
                  <tr><th>Company</th><th>Matched</th><th>Open Roles</th><th>Placed</th></tr>
                </thead>
                <tbody>
                  {companyMatches.map((c) => (
                    <tr key={c.company}>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{c.company}</td>
                      <td className="mono">{c.matched}</td>
                      <td>{c.openRoles}</td>
                      <td>
                        <span className="pill pill-success" style={{ fontSize: 10, fontWeight: 700 }}>{c.placed}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Agent Log ─────────────────────────────────────────── */}
      <AgentLog items={logs} />
    </div>
  );
}
