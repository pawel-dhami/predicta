import { NavLink, useLocation } from 'react-router-dom';
import { Bell, Bot, Briefcase, ChartNoAxesCombined, ClipboardCheck, LayoutDashboard, Route, Shield, UserRound, Zap, ChevronDown } from 'lucide-react';

const studentLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/jobs', label: 'Jobs', icon: Briefcase },
  { to: '/applications', label: 'Applications', icon: ClipboardCheck },
  { to: '/skills', label: 'Skills & Matching', icon: ChartNoAxesCombined },
  { to: '/roadmap', label: 'My Roadmap', icon: Route },
  { to: '/ai-mentor', label: 'AI Mentor', icon: Bot },
  { to: '/alerts', label: 'Alerts', icon: Bell, badge: 5 },
];

const adminLinks = [
  { to: '/admin', label: 'TPC Dashboard', icon: Shield },
  { to: '/admin/analytics', label: 'Analytics', icon: ChartNoAxesCombined },
];

export default function Sidebar({ onSignOut, userEmail }) {
  const { pathname } = useLocation();
  const displayName = userEmail ? userEmail.split('@')[0] : 'Student';

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800, fontSize: 20, marginBottom: 32, paddingLeft: 8, color: 'var(--text-primary)' }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'linear-gradient(135deg, #6c47ff, #e84393)',
          display: 'grid', placeItems: 'center',
          boxShadow: '0 2px 10px rgba(108,71,255,.3)',
        }}>
          <Zap size={18} color="#fff" />
        </div>
        Predicta
      </div>

      {/* Student Nav */}
      <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--text-muted)', fontWeight: 600, padding: '0 14px', marginBottom: 8 }}>
        Student
      </div>
      <nav style={{ display: 'grid', gap: 2, marginBottom: 24 }}>
        {studentLinks.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.to === '/dashboard'}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <item.icon size={17} />
              {item.label}
            </span>
            {item.badge ? <span className="pill-count">{item.badge}</span> : null}
          </NavLink>
        ))}
      </nav>

      {/* Admin Nav */}
      <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--text-muted)', fontWeight: 600, padding: '0 14px', marginBottom: 8 }}>
        Admin
      </div>
      <nav style={{ display: 'grid', gap: 2 }}>
        {adminLinks.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.to === '/admin'}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <item.icon size={17} />
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* User Profile */}
      <div style={{
        marginTop: 'auto',
        padding: 14,
        background: 'var(--bg-elevated)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 99,
            background: 'linear-gradient(135deg, #6c47ff, #e84393)',
            display: 'grid', placeItems: 'center',
            fontWeight: 700, fontSize: 14, color: '#fff',
          }}>{displayName.charAt(0).toUpperCase()}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{displayName}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>CSE · 4th Year</div>
          </div>
          {onSignOut && (
            <button onClick={onSignOut} className="btn" style={{ padding: 6 }} title="Sign out">
              <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
