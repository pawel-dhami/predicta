import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Zap, Sparkles, ArrowRight, Brain, Target, MessageSquare,
    BarChart3, Users, ChevronRight, Star, Rocket, FileText,
    Sun, Moon, CalendarCheck, TrendingUp, BookOpen, Play
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
};

const staggerChildren = {
    initial: {},
    whileInView: { transition: { staggerChildren: 0.12 } },
    viewport: { once: true },
};

// Animated counter hook
function useCountUp(target, duration = 2000, delay = 800) {
    const [count, setCount] = useState(0);
    const [started, setStarted] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => setStarted(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    useEffect(() => {
        if (!started) return;
        const steps = 60;
        const increment = target / steps;
        const interval = duration / steps;
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, interval);
        return () => clearInterval(timer);
    }, [started, target, duration]);

    return count;
}

const features = [
    {
        icon: Brain,
        title: 'AI Career Compass',
        desc: 'Agentic AI analyzes your profile and creates a personalized roadmap to your dream placement.',
        color: '#6366f1',
        gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        link: '/dashboard',
        cta: 'See your roadmap',
    },
    {
        icon: FileText,
        title: 'Smart CV Analysis',
        desc: 'Upload your resume or link LinkedIn — our AI extracts skills, identifies gaps, and builds your digital profile.',
        color: '#10b981',
        gradient: 'linear-gradient(135deg, #10b981, #34d399)',
        link: '/onboarding',
        cta: 'Analyze my CV',
    },
    {
        icon: MessageSquare,
        title: 'Mock Interview AI',
        desc: 'Practice with an AI interviewer that simulates real company rounds — from system design to behavioral.',
        color: '#f59e0b',
        gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
        link: '/ai-mentor',
        cta: 'Start a mock',
    },
    {
        icon: Target,
        title: 'Company Matching',
        desc: 'Get matched to companies based on your skills, gaps, and career aspirations with real-time probability scores.',
        color: '#ec4899',
        gradient: 'linear-gradient(135deg, #ec4899, #f472b6)',
        link: '/dashboard',
        cta: 'View matches',
    },
];

const quickLinks = [
    { icon: TrendingUp, label: 'My Dashboard', sub: 'Placement score & roadmap', link: '/dashboard', color: '#6366f1' },
    { icon: Play, label: 'AI Mock Interview', sub: 'Start practicing now', link: '/ai-mentor', color: '#f59e0b' },
    { icon: BarChart3, label: 'Skills & Matching', sub: 'See company fit scores', link: '/skills', color: '#10b981' },
    { icon: CalendarCheck, label: 'My Roadmap', sub: 'Today\'s AI tasks', link: '/roadmap', color: '#ec4899' },
    { icon: BookOpen, label: 'Applications', sub: 'Track your pipeline', link: '/applications', color: '#8b5cf6' },
];

const stats = [
    { value: '94%', label: 'Placement Rate', icon: Rocket },
    { value: '500+', label: 'Companies', icon: Users },
    { value: '10K+', label: 'Students Placed', icon: Star },
    { value: '50+', label: 'AI Mock Sessions', icon: Zap },
];

// Skill chip modal
const skillActions = {
    'Sys Design ✗': {
        title: 'Boost System Design',
        desc: 'This is your biggest blocker — Goldman Sachs and Infosys both require it.',
        actions: [
            { label: '📅 Schedule a mock interview this week', primary: true },
            { label: '📚 Start System Design crash course' },
            { label: '🤖 Ask AI Mentor for a study plan' },
        ],
    },
    'DSA ⚠': {
        title: 'Strengthen DSA',
        desc: 'DSA is above average but TCS expects 8/10. 5 more problems will close the gap.',
        actions: [
            { label: '💻 Solve 5 medium problems today', primary: true },
            { label: '🤖 Get AI-generated problem set' },
        ],
    },
};

export default function LandingHero() {
    const navigate = useNavigate();
    const { theme, toggle } = useTheme();
    const score = useCountUp(78, 2000, 800);
    const [activeSkill, setActiveSkill] = useState(null);

    return (
        <div className="landing-page" data-theme={theme}>
            {/* ── Animated Background ── */}
            <div className="landing-bg">
                <motion.div
                    animate={{ x: [0, 30, -20, 0], y: [0, -20, 30, 0], scale: [1, 1.1, 0.95, 1] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="landing-blob blob-1"
                />
                <motion.div
                    animate={{ x: [0, -30, 20, 0], y: [0, 20, -30, 0], scale: [1, 0.95, 1.1, 1] }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                    className="landing-blob blob-2"
                />
                <motion.div
                    animate={{ x: [0, 20, -15, 0], y: [0, -15, 20, 0] }}
                    transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
                    className="landing-blob blob-3"
                />
            </div>

            {/* ── Nav Bar ── */}
            <motion.nav
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="landing-nav"
            >
                <div className="landing-nav-inner">
                    <div className="landing-logo">
                        <div className="landing-logo-icon">
                            <Zap size={20} color="#fff" />
                        </div>
                        <span className="landing-logo-text" style={{ color: 'var(--text-primary)' }}>Predicta</span>
                    </div>

                    {/* Quick links — minimal pill row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        {quickLinks.map((q) => (
                            <motion.button
                                key={q.label}
                                whileHover={{ backgroundColor: `${q.color}12`, color: q.color }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => navigate(q.link)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 5,
                                    padding: '5px 11px', borderRadius: 8,
                                    background: 'transparent', border: 'none',
                                    cursor: 'pointer', fontSize: 12, fontWeight: 500,
                                    color: 'var(--text-secondary)', fontFamily: 'inherit',
                                    transition: 'all 0.15s',
                                }}
                            >
                                <q.icon size={13} />
                                {q.label}
                            </motion.button>
                        ))}
                    </div>

                    <div className="landing-nav-links">
                        <a href="#features" style={{ color: 'var(--text-secondary)' }}>Features</a>
                        <a href="#stats" style={{ color: 'var(--text-secondary)' }}>Impact</a>

                        {/* Theme toggle */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <Sun size={13} style={{ color: theme === 'light' ? '#f59e0b' : 'var(--text-muted)' }} />
                            <label className="theme-toggle" title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
                                <input type="checkbox" checked={theme === 'dark'} onChange={toggle} />
                                <div className="theme-toggle-track">
                                    <div className="theme-toggle-thumb">{theme === 'dark' ? '🌙' : '☀️'}</div>
                                </div>
                            </label>
                            <Moon size={13} style={{ color: theme === 'dark' ? '#8b5cf6' : 'var(--text-muted)' }} />
                        </div>

                        <button className="landing-nav-signin" onClick={() => navigate('/login')}>
                            Sign In
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* ── Hero Section ── */}
            <section className="landing-hero-section">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="landing-hero-content"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="landing-badge"
                    >
                        <Sparkles size={14} />
                        <span>Powered by Agentic AI</span>
                    </motion.div>

                    <h1 className="landing-headline">
                        Your AI-Powered
                        <br />
                        <span className="landing-headline-gradient">Placement Copilot</span>
                    </h1>

                    <p className="landing-subtext">
                        From CV analysis to mock interviews — Predicta uses agentic AI to build your
                        career roadmap, match you to dream companies, and maximize your placement probability.
                    </p>

                    <div className="landing-cta-row">
                        <motion.button
                            whileHover={{ scale: 1.04, boxShadow: '0 8px 30px rgba(99,102,241,0.4)' }}
                            whileTap={{ scale: 0.97 }}
                            className="landing-cta-primary"
                            onClick={() => navigate('/onboarding')}
                        >
                            Get Started Free
                            <ArrowRight size={18} />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            className="landing-cta-secondary"
                            onClick={() => navigate('/login')}
                        >
                            I have an account
                        </motion.button>
                    </div>

                    {/* Social proof */}
                    <div className="landing-social-proof">
                        <div className="landing-avatars">
                            {['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'].map((c, i) => (
                                <div key={i} className="landing-avatar" style={{ backgroundColor: c, zIndex: 5 - i }}>
                                    {['AS', 'PP', 'RS', 'SK', 'DM'][i]}
                                </div>
                            ))}
                        </div>
                        <span className="landing-social-text">
                            <strong>10,000+</strong> students already placed
                        </span>
                    </div>
                </motion.div>

                {/* Hero Visual — interactive card */}
                <motion.div
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="landing-hero-visual"
                >
                    <div className="landing-hero-card">
                        <div className="landing-hero-card-header">
                            <div className="landing-hero-card-dots">
                                <span style={{ background: '#ef4444' }} />
                                <span style={{ background: '#f59e0b' }} />
                                <span style={{ background: '#10b981' }} />
                            </div>
                            <span className="landing-hero-card-title">predicta.ai — career_compass</span>
                        </div>
                        <div className="landing-hero-card-body">
                            {/* Animated score */}
                            <div className="landing-hero-metric">
                                <div className="landing-hero-metric-label">Placement Probability</div>
                                <div className="landing-hero-metric-value">
                                    <motion.span
                                        key={score}
                                        style={{
                                            background: 'linear-gradient(135deg, #6366f1, #ec4899)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}
                                    >
                                        {score}%
                                    </motion.span>
                                </div>
                                <div className="landing-hero-progress">
                                    <motion.div
                                        className="landing-hero-progress-fill"
                                        initial={{ width: '0%' }}
                                        animate={{ width: `${score}%` }}
                                        transition={{ duration: 0.05 }}
                                    />
                                </div>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                                    ↗ +12% since last week · 2 skills need attention
                                </div>
                            </div>

                            {/* Clickable skill chips */}
                            <div className="landing-hero-skills">
                                {['Python ✓', 'DSA ⚠', 'Sys Design ✗', 'SQL ✓', 'ML/AI ✓'].map((s, i) => (
                                    <motion.button
                                        key={s}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1.2 + i * 0.1 }}
                                        whileHover={{ scale: 1.06 }}
                                        whileTap={{ scale: 0.96 }}
                                        onClick={() => skillActions[s] && setActiveSkill(s)}
                                        className={`landing-skill-chip ${s.includes('✗') ? 'skill-gap' : s.includes('⚠') ? 'skill-warn' : 'skill-ok'}`}
                                        style={{
                                            cursor: skillActions[s] ? 'pointer' : 'default',
                                            border: skillActions[s] ? undefined : 'none',
                                        }}
                                    >
                                        {s}
                                    </motion.button>
                                ))}
                            </div>

                            {/* AI suggestion — now a button */}
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.8 }}
                                whileHover={{ scale: 1.02, boxShadow: '0 4px 16px rgba(99,102,241,0.2)' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/ai-mentor')}
                                className="landing-hero-ai-msg"
                                style={{
                                    width: '100%', cursor: 'pointer', textAlign: 'left',
                                    border: '1px solid rgba(99,102,241,0.25)',
                                    borderRadius: 10, background: 'rgba(99,102,241,0.06)',
                                    padding: '8px 12px', display: 'flex', alignItems: 'center',
                                    justifyContent: 'space-between', gap: 8,
                                    fontFamily: 'inherit',
                                }}
                            >
                                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 12 }}>
                                    <Sparkles size={12} color="#6366f1" />
                                    AI: Focus on System Design — schedule a mock this week
                                </span>
                                <span style={{
                                    fontSize: 11, fontWeight: 700, color: '#fff', padding: '3px 10px',
                                    borderRadius: 999, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                                    whiteSpace: 'nowrap',
                                }}>
                                    Open AI Mentor →
                                </span>
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* ── Features Section ── */}
            <section id="features" className="landing-features-section">
                <motion.div {...fadeUp} className="landing-section-header">
                    <span className="landing-section-badge">Features</span>
                    <h2 className="landing-section-title">Everything you need to ace placements</h2>
                    <p className="landing-section-subtitle">
                        Our agentic AI platform works round the clock to prepare you for success
                    </p>
                </motion.div>

                <motion.div {...staggerChildren} className="landing-features-grid">
                    {features.map((f, i) => (
                        <motion.button
                            key={f.title}
                            {...fadeUp}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="landing-feature-card"
                            onClick={() => navigate(f.link)}
                            style={{ cursor: 'pointer', textAlign: 'left', border: 'none', fontFamily: 'inherit' }}
                        >
                            <div className="landing-feature-icon" style={{ background: f.gradient }}>
                                <f.icon size={22} color="#fff" />
                            </div>
                            <h3 className="landing-feature-title">{f.title}</h3>
                            <p className="landing-feature-desc">{f.desc}</p>
                            <div className="landing-feature-link" style={{ color: f.color }}>
                                {f.cta} <ChevronRight size={14} />
                            </div>
                        </motion.button>
                    ))}
                </motion.div>
            </section>

            {/* ── Stats Section ── */}
            <section id="stats" className="landing-stats-section">
                <div className="landing-stats-bg" />
                <motion.div {...staggerChildren} className="landing-stats-grid">
                    {stats.map((s, i) => (
                        <motion.div
                            key={s.label}
                            {...fadeUp}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="landing-stat-card"
                        >
                            <s.icon size={24} className="landing-stat-icon" />
                            <div className="landing-stat-value">{s.value}</div>
                            <div className="landing-stat-label">{s.label}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* ── CTA Section ── */}
            <section className="landing-cta-section">
                <motion.div {...fadeUp} className="landing-cta-card">
                    <h2 className="landing-cta-title">Ready to supercharge your placements?</h2>
                    <p className="landing-cta-subtitle">
                        Join thousands of students who have already transformed their career journey with Predicta
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.04, boxShadow: '0 8px 30px rgba(255,255,255,0.2)' }}
                        whileTap={{ scale: 0.97 }}
                        className="landing-cta-btn-white"
                        onClick={() => navigate('/onboarding')}
                    >
                        Start Your Journey <ArrowRight size={18} />
                    </motion.button>
                </motion.div>
            </section>

            {/* ── Footer ── */}
            <footer className="landing-footer">
                <div className="landing-footer-inner">
                    <div className="landing-logo" style={{ gap: '8px' }}>
                        <div className="landing-logo-icon" style={{ width: 28, height: 28 }}>
                            <Zap size={14} color="#fff" />
                        </div>
                        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>Predicta</span>
                    </div>
                    <p className="landing-footer-text">© 2026 Predicta. AI-Powered Placement Intelligence.</p>
                </div>
            </footer>

            {/* ── Skill Modal ── */}
            <AnimatePresence>
                {activeSkill && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="modal-overlay"
                        onClick={() => setActiveSkill(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                            className="modal-content"
                            onClick={e => e.stopPropagation()}
                            style={{ maxWidth: 420 }}
                        >
                            <div style={{ marginBottom: 6 }}>
                                <span style={{
                                    fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                                    letterSpacing: '0.08em', color: '#ef4444',
                                }}>SKILL GAP DETECTED</span>
                            </div>
                            <h3 style={{ fontSize: 20, marginBottom: 8 }}>
                                {skillActions[activeSkill]?.title}
                            </h3>
                            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>
                                {skillActions[activeSkill]?.desc}
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {skillActions[activeSkill]?.actions.map((a, i) => (
                                    <motion.button
                                        key={i}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => { setActiveSkill(null); navigate('/ai-mentor'); }}
                                        style={{
                                            padding: '12px 16px', borderRadius: 12,
                                            border: a.primary ? 'none' : '1px solid var(--border)',
                                            background: a.primary
                                                ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                                                : 'var(--bg-elevated)',
                                            color: a.primary ? '#fff' : 'var(--text-primary)',
                                            cursor: 'pointer', fontSize: 14, fontWeight: 600,
                                            fontFamily: 'inherit', textAlign: 'left',
                                            boxShadow: a.primary ? '0 4px 16px rgba(99,102,241,0.3)' : 'none',
                                        }}
                                    >
                                        {a.label}
                                    </motion.button>
                                ))}
                            </div>
                            <button
                                onClick={() => setActiveSkill(null)}
                                style={{
                                    marginTop: 16, width: '100%', padding: '8px',
                                    background: 'none', border: 'none', color: 'var(--text-muted)',
                                    cursor: 'pointer', fontSize: 13, fontFamily: 'inherit',
                                }}
                            >
                                Dismiss
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
