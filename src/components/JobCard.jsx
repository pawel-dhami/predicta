/**
 * src/components/JobCard.jsx
 *
 * Individual job listing card for the Jobs page.
 * Receives a standardised job object from /api/jobs/fetch.
 * Styles match the existing .card class exactly — no new design tokens.
 */

function daysAgo(dateStr) {
  if (!dateStr) return null;
  const posted = new Date(dateStr);
  if (isNaN(posted)) return null;
  const diff = Math.floor((Date.now() - posted) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Today';
  if (diff === 1) return '1 day ago';
  return `${diff} days ago`;
}

export default function JobCard({ job }) {
  const {
    title = 'Untitled Role',
    company = 'Unknown Company',
    location = '',
    employmentType = 'Full-time',
    salary = null,
    postedAt = null,
    applyUrl = null,
  } = job;

  const posted = daysAgo(postedAt);

  return (
    <div className="job-card">
      {/* Header row: title + employment type pill */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div>
          <div style={{
            fontWeight: 700,
            fontSize: 15,
            color: 'var(--text-primary)',
            marginBottom: 2,
            lineHeight: 1.35,
          }}>
            {title}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            {company}{location ? ` · ${location}` : ''}
          </div>
        </div>
        <span
          className="pill"
          style={{
            flexShrink: 0,
            background: 'var(--bg-elevated)',
            color: 'var(--text-muted)',
            border: '1px solid var(--border)',
            fontSize: 11,
          }}
        >
          {employmentType}
        </span>
      </div>

      {/* Meta row: salary + days ago */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        marginTop: 10,
        fontSize: 12,
        color: 'var(--text-muted)',
      }}>
        <span>💰 {salary ?? 'Salary not disclosed'}</span>
        {posted && <span>🕐 {posted}</span>}
      </div>

      {/* Apply button */}
      <div style={{ marginTop: 14 }}>
        {applyUrl ? (
          <a
            href={applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-accent"
            style={{ display: 'inline-flex', textDecoration: 'none', fontSize: 13 }}
          >
            Apply Now →
          </a>
        ) : (
          <button className="btn" disabled style={{ fontSize: 13, opacity: 0.5 }}>
            Link unavailable
          </button>
        )}
      </div>
    </div>
  );
}
