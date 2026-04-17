/**
 * JobsPage — /jobs
 * Rich job listings matched to user profile roles.
 * Fully self-contained with local data (no broken API dependency).
 */
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { Briefcase, Search, Filter, ExternalLink, Bot, Clock, MapPin, TrendingUp, Star } from 'lucide-react';

// ── Static job pool ────────────────────────────────────────────────
const ALL_JOBS = [
  {
    id: 1, title: 'Software Development Engineer',
    company: 'Amazon', logo: '🛒', location: 'Bengaluru, India',
    type: 'Full-time', salary: '₹18–32 LPA', postedDays: 1,
    tags: ['DSA', 'Java', 'System Design', 'LLD'],
    matchScore: 88, roles: ['Software Engineer', 'SDE'],
    applyUrl: 'https://amazon.jobs',
    description: 'Build world-class distributed systems. Strong DSA and OOP required.',
    deadline: '2026-04-30',
  },
  {
    id: 2, title: 'Analyst Engineer – Technology',
    company: 'Goldman Sachs', logo: '🏦', location: 'Bengaluru, India',
    type: 'Full-time', salary: '₹22–40 LPA', postedDays: 2,
    tags: ['SQL', 'Python', 'System Design', 'Data Structures'],
    matchScore: 87, roles: ['Analyst', 'Data Analyst', 'Software Engineer'],
    applyUrl: 'https://goldmansachs.com/careers',
    description: 'Work on high-frequency trading platforms and internal tooling.',
    deadline: '2026-04-25',
  },
  {
    id: 3, title: 'Software Engineer – Cloud',
    company: 'Microsoft', logo: '🪟', location: 'Hyderabad, India',
    type: 'Full-time', salary: '₹20–38 LPA', postedDays: 3,
    tags: ['Azure', 'C#', 'Distributed Systems', 'Kubernetes'],
    matchScore: 82, roles: ['Cloud Engineer', 'Software Engineer', 'SDE'],
    applyUrl: 'https://careers.microsoft.com',
    description: 'Build next-gen features on Azure cloud platform.',
    deadline: '2026-05-05',
  },
  {
    id: 4, title: 'Specialist Programmer',
    company: 'Infosys', logo: '🔵', location: 'Pune / Bengaluru',
    type: 'Full-time', salary: '₹6–9 LPA', postedDays: 1,
    tags: ['Java', 'Spring Boot', 'SQL', 'REST APIs'],
    matchScore: 81, roles: ['Software Engineer', 'Backend Engineer', 'SDE'],
    applyUrl: 'https://infosys.com/careers',
    description: 'Join the digital transformation division. Java & SQL mandatory.',
    deadline: '2026-04-22',
  },
  {
    id: 5, title: 'Software Engineer – Backend',
    company: 'Flipkart', logo: '🛍️', location: 'Bengaluru, India',
    type: 'Full-time', salary: '₹16–28 LPA', postedDays: 4,
    tags: ['Go', 'Microservices', 'Kafka', 'System Design'],
    matchScore: 79, roles: ['Backend Engineer', 'Software Engineer'],
    applyUrl: 'https://flipkartcareers.com',
    description: 'Scale e-commerce infrastructure to serve 400M+ users.',
    deadline: '2026-05-10',
  },
  {
    id: 6, title: 'Data Analyst – Business Intelligence',
    company: 'PhonePe', logo: '📱', location: 'Bengaluru, India',
    type: 'Full-time', salary: '₹12–20 LPA', postedDays: 2,
    tags: ['SQL', 'Python', 'Tableau', 'Statistics'],
    matchScore: 76, roles: ['Data Analyst', 'Analyst'],
    applyUrl: 'https://phonepe.com/careers',
    description: 'Derive actionable insights from massive payment transaction data.',
    deadline: '2026-04-28',
  },
  {
    id: 7, title: 'Associate Software Engineer',
    company: 'TCS', logo: '🏢', location: 'Pan-India',
    type: 'Full-time', salary: '₹3.6–7 LPA', postedDays: 0,
    tags: ['Java', 'Python', 'SQL', 'OOPS'],
    matchScore: 75, roles: ['Software Engineer', 'SDE', 'Backend Engineer'],
    applyUrl: 'https://nextstep.tcs.com',
    description: 'Rotational program across technology and digital departments.',
    deadline: '2026-04-20',
  },
  {
    id: 8, title: 'Machine Learning Engineer',
    company: 'Google', logo: '🔍', location: 'Hyderabad, India',
    type: 'Full-time', salary: '₹35–65 LPA', postedDays: 5,
    tags: ['Python', 'TensorFlow', 'ML', 'Statistics', 'System Design'],
    matchScore: 62, roles: ['ML Engineer', 'AI Engineer'],
    applyUrl: 'https://careers.google.com',
    description: 'Train and deploy ML models at Google scale.',
    deadline: '2026-05-15',
  },
  {
    id: 9, title: 'Product Analyst',
    company: 'Swiggy', logo: '🍔', location: 'Bengaluru, India',
    type: 'Full-time', salary: '₹10–18 LPA', postedDays: 3,
    tags: ['SQL', 'Product Thinking', 'Python', 'A/B Testing'],
    matchScore: 71, roles: ['Product Analyst', 'Data Analyst', 'Analyst'],
    applyUrl: 'https://careers.swiggy.com',
    description: 'Shape the product experience for 80M+ food delivery users.',
    deadline: '2026-05-01',
  },
  {
    id: 10, title: 'DevOps Engineer',
    company: 'Razorpay', logo: '💳', location: 'Bengaluru, India',
    type: 'Full-time', salary: '₹14–24 LPA', postedDays: 6,
    tags: ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Terraform'],
    matchScore: 68, roles: ['DevOps Engineer', 'Cloud Engineer'],
    applyUrl: 'https://razorpay.com/jobs',
    description: "Manage infrastructure for India's leading payments platform.",
    deadline: '2026-05-08',
  },
  {
    id: 11, title: 'Frontend Engineer',
    company: 'Zepto', logo: '⚡', location: 'Mumbai, India',
    type: 'Full-time', salary: '₹12–22 LPA', postedDays: 2,
    tags: ['React', 'TypeScript', 'Performance', 'CSS'],
    matchScore: 74, roles: ['Frontend Engineer', 'Software Engineer', 'SDE'],
    applyUrl: 'https://zepto.com/careers',
    description: 'Build lightning-fast UIs for 10-minute grocery delivery.',
    deadline: '2026-04-26',
  },
  {
    id: 12, title: 'Quantitative Analyst – Intern to FTE',
    company: 'JP Morgan Chase', logo: '🏛️', location: 'Mumbai, India',
    type: 'Full-time', salary: '₹20–35 LPA', postedDays: 7,
    tags: ['Python', 'Statistics', 'SQL', 'Finance'],
    matchScore: 65, roles: ['Analyst', 'Data Analyst', 'Quantitative Analyst'],
    applyUrl: 'https://jpmorgan.com/careers',
    description: 'Develop quant models for risk management and trading.',
    deadline: '2026-05-20',
  },
];

const TYPES = ['All', 'Full-time', 'Internship', 'Remote'];

function matchColor(score) {
  if (score >= 80) return '#10b981';
  if (score >= 65) return '#d97706';
  return '#6b7280';
}

function DeadlineBadge({ deadline }) {
  if (!deadline) return null;
  const days = Math.ceil((new Date(deadline) - new Date()) / 86400000);
  if (days < 0) return <span style={{ fontSize: 10, color: '#91979f', marginLeft: 6 }}>Closed</span>;
  const color = days <= 3 ? '#dc2626' : days <= 7 ? '#d97706' : '#6b7280';
  return (
    <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 99, fontWeight: 700, background: `${color}14`, color }}>
      {days}d left
    </span>
  );
}

function JobCard({ job, topRole }) {
  const mc = matchColor(job.matchScore);
  const postedLabel = job.postedDays === 0 ? 'Today' : job.postedDays === 1 ? '1 day ago' : `${job.postedDays} days ago`;
  const isTopMatch = job.roles.some(r => r.toLowerCase().includes((topRole || '').toLowerCase().slice(0, 6)));

  return (
    <div style={{
      background: 'var(--bg-card)', border: `1px solid var(--border)`,
      borderRadius: 'var(--radius-lg)', padding: '18px 20px',
      display: 'flex', flexDirection: 'column', gap: 12,
      transition: 'box-shadow .2s, border-color .2s',
      position: 'relative', overflow: 'hidden',
    }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(108,71,255,.12)'; e.currentTarget.style.borderColor = '#6c47ff44'; }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = ''; }}
    >
      {/* Top-match badge */}
      {isTopMatch && (
        <div style={{ position: 'absolute', top: 0, right: 0, background: 'linear-gradient(135deg, #6c47ff, #e84393)', color: '#fff', fontSize: 9, fontWeight: 800, padding: '3px 10px', borderRadius: '0 var(--radius-lg) 0 10px', letterSpacing: '.04em' }}>
          ⭐ TOP MATCH
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div style={{ width: 42, height: 42, borderRadius: 10, background: 'var(--bg-elevated)', border: '1px solid var(--border)', display: 'grid', placeItems: 'center', fontSize: 20, flexShrink: 0 }}>
          {job.logo}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: 2 }}>{job.title}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
            {job.company}
            <span style={{ width: 3, height: 3, borderRadius: 99, background: 'var(--text-muted)', display: 'inline-block' }} />
            <MapPin size={10} style={{ display: 'inline' }} /> {job.location}
          </div>
        </div>
        {/* Match score */}
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: mc, fontFamily: 'monospace', lineHeight: 1 }}>{job.matchScore}%</div>
          <div style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 700 }}>MATCH</div>
        </div>
      </div>

      {/* Description */}
      <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>{job.description}</div>

      {/* Tags */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {job.tags.map(t => (
          <span key={t} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 99, background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontWeight: 600 }}>
            {t}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 4 }}>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', gap: 10 }}>
          <span>💰 {job.salary}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Clock size={10} /> {postedLabel}</span>
          <DeadlineBadge deadline={job.deadline} />
        </div>
        <a
          href={job.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700,
            background: 'linear-gradient(135deg, #6c47ff, #e84393)',
            color: '#fff', textDecoration: 'none',
            transition: 'opacity .15s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          Apply <ExternalLink size={11} />
        </a>
      </div>
    </div>
  );
}

export default function JobsPage() {
  const { aiAnalysis } = useProfile();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortBy, setSortBy] = useState('match'); // match | recent | deadline

  const topRole = aiAnalysis?.topRoles?.[0] ?? 'Software Engineer';

  const filtered = useMemo(() => {
    let jobs = [...ALL_JOBS];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      jobs = jobs.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Type filter
    if (typeFilter !== 'All') {
      jobs = jobs.filter(j => j.type === typeFilter);
    }

    // Sort
    if (sortBy === 'match') jobs.sort((a, b) => b.matchScore - a.matchScore);
    else if (sortBy === 'recent') jobs.sort((a, b) => a.postedDays - b.postedDays);
    else if (sortBy === 'deadline') jobs.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    return jobs;
  }, [search, typeFilter, sortBy]);

  const topMatches = filtered.filter(j => j.matchScore >= 80).length;
  const urgentDeadlines = ALL_JOBS.filter(j => {
    const days = Math.ceil((new Date(j.deadline) - new Date()) / 86400000);
    return days >= 0 && days <= 5;
  }).length;

  return (
    <div style={{ display: 'grid', gap: 20 }}>

      {/* Header */}
      <div className="gradient-banner">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Briefcase size={20} /> Job Matches
            </div>
            <div style={{ fontSize: 13, opacity: .8 }}>
              Curated listings for <strong>{topRole}</strong> · {ALL_JOBS.length} live openings · AI-matched to your profile
            </div>
          </div>
          <button
            onClick={() => navigate('/ai-mentor')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,.15)', color: '#fff', fontWeight: 700, fontSize: 13 }}
          >
            <Bot size={14} /> Ask AI Mentor
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-4">
        {[
          { label: 'Total Openings', val: ALL_JOBS.length, color: 'var(--accent-purple)', icon: '💼' },
          { label: 'Strong Matches (≥80%)', val: ALL_JOBS.filter(j => j.matchScore >= 80).length, color: '#10b981', icon: '⭐' },
          { label: 'Urgent Deadlines', val: urgentDeadlines, color: '#dc2626', icon: '🔥' },
          { label: 'New Today', val: ALL_JOBS.filter(j => j.postedDays <= 1).length, color: '#0891b2', icon: '✨' },
        ].map(({ label, val, color, icon }) => (
          <div key={label} className="card" style={{ padding: '14px 18px', textAlign: 'center' }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color, fontFamily: 'monospace' }}>{val}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="card" style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search */}
          <div style={{ flex: 1, minWidth: 200, display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 12px' }}>
            <Search size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search jobs, companies, skills..."
              style={{ background: 'transparent', border: 0, outline: 'none', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'inherit', width: '100%' }}
            />
          </div>

          {/* Type filter */}
          <div style={{ display: 'flex', gap: 6 }}>
            {TYPES.map(t => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`btn btn-sm${typeFilter === t ? ' btn-accent' : ''}`}
                style={{ fontSize: 12 }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
            <TrendingUp size={13} />
            <span>Sort:</span>
            {[['match', 'Match %'], ['recent', 'Newest'], ['deadline', 'Deadline']].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setSortBy(val)}
                className={`btn btn-sm${sortBy === val ? ' btn-accent' : ''}`}
                style={{ fontSize: 11 }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Result count */}
        <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text-muted)' }}>
          Showing <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> of {ALL_JOBS.length} jobs
          {search && <> matching "<strong>{search}</strong>"</>}
          {topMatches > 0 && <span style={{ marginLeft: 8, color: '#10b981', fontWeight: 700 }}>· {topMatches} strong matches</span>}
        </div>
      </div>

      {/* No results */}
      {filtered.length === 0 && (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 6 }}>No jobs found</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>Try a different search term or clear your filters.</div>
          <button className="btn btn-accent btn-sm" onClick={() => { setSearch(''); setTypeFilter('All'); }}>Clear Filters</button>
        </div>
      )}

      {/* Jobs grid */}
      {filtered.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 14 }}>
          {filtered.map(job => (
            <JobCard key={job.id} job={job} topRole={aiAnalysis?.topRoles?.[0]} />
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="card" style={{ padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', border: 'none' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 4 }}>Want personalized job strategy?</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.7)' }}>Ask your AI mentor which roles to prioritize and how to prep.</div>
        </div>
        <button
          onClick={() => navigate('/ai-mentor')}
          style={{ padding: '8px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,.15)', color: '#fff', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, backdropFilter: 'blur(10px)' }}
        >
          <Bot size={14} /> Chat with AI Mentor →
        </button>
      </div>
    </div>
  );
}
