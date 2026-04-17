import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import LandingHero from './pages/LandingHero';
import AuthPage from './pages/AuthPage';
import AuthCallback from './pages/AuthCallback';
import OnboardingPage from './pages/OnboardingPage';
import DashboardLayout from './pages/DashboardLayout';
import StudentDashboard from './pages/StudentDashboard';
import JobsPage from './pages/JobsPage';
import AdminPanel from './pages/AdminPanel';
import SkillsPage from './pages/SkillsPage';
import RoadmapPage from './pages/RoadmapPage';
import ApplicationsPage from './pages/ApplicationsPage';
import AIMentorPage from './pages/AIMentorPage';
import AlertsPage from './pages/AlertsPage';
import NotFoundPage from './pages/NotFoundPage';

// Scroll to top on every route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display: 'grid', placeItems: 'center', height: '100vh', background: 'var(--bg-root)' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="pulse" style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--accent-purple)', margin: '0 auto 12px' }} />
        <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Loading...</div>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display: 'grid', placeItems: 'center', height: '100vh', background: 'var(--bg-root)' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="pulse" style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--accent-purple)', margin: '0 auto 12px' }} />
        <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Loading...</div>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  const role = user?.user_metadata?.role;
  if (role !== 'tpc' && role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route path="/" element={<LandingHero />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />

          {/* OAuth callback — must be public, processes the token hash */}
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Protected Dashboard Routes */}
          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/applications" element={<ApplicationsPage />} />
            <Route path="/skills" element={<SkillsPage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/ai-mentor" element={<AIMentorPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            {/* Admin Routes — require TPC role */}
            <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
            <Route path="/admin/analytics" element={<AdminRoute><AdminPanel /></AdminRoute>} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}
