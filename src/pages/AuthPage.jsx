import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Lock, Mail, Eye, EyeOff, GraduationCap, Shield,
    ArrowRight, Sparkles, UserPlus, GitBranch, Globe,
    CheckCircle, AlertCircle, Zap,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

// ── OAuth provider button component ──────────────────────────────
function OAuthBtn({ icon: Icon, label, color, onClick, disabled }) {
    return (
        <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            disabled={disabled}
            onClick={onClick}
            style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 8, padding: '10px 14px', borderRadius: 12,
                border: '1px solid var(--border-strong)',
                background: 'var(--bg-elevated)',
                color: 'var(--text-primary)',
                cursor: 'pointer', fontSize: 13, fontWeight: 600,
                fontFamily: 'inherit', opacity: disabled ? 0.5 : 1,
                transition: 'all 0.15s',
            }}
        >
            <Icon size={16} color={color} />
            {label}
        </motion.button>
    );
}

// ── Modes: 'login' | 'signup' | 'reset' | 'reset-sent' ──────────
export default function AuthPage() {
    const navigate = useNavigate();
    const { signIn, signUp, signInWithOAuth, resetPassword, user } = useAuth();

    const [mode, setMode] = useState('login');
    const [role, setRole] = useState('student');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');
    const [loading, setLoading] = useState(false);
    const [oauthLoading, setOauthLoading] = useState('');

    // Scroll to top on mount
    useEffect(() => { window.scrollTo(0, 0); }, []);

    // Redirect if already logged in
    useEffect(() => {
        if (user) navigate(role === 'tpc' ? '/admin' : '/dashboard', { replace: true });
    }, [user, role, navigate]);

    const reset = () => { setError(''); setInfo(''); };

    // ── Email/password submit ──────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        reset();
        setLoading(true);

        try {
            if (mode === 'signup') {
                const data = await signUp(email, password, { role });
                if (data?.session) {
                    // Auto-confirm enabled — go straight to dashboard
                    navigate(role === 'tpc' ? '/admin' : '/dashboard', { replace: true });
                } else {
                    // Email confirmation required
                    setMode('reset-sent');
                    setInfo('Account created! Check your email to confirm before signing in.');
                }
                return;
            }

            await signIn(email, password);
            navigate(role === 'tpc' ? '/admin' : '/dashboard', { replace: true });

        } catch (err) {
            // "User already registered" → try sign in
            if (err.message?.includes('already registered') || err.message?.includes('already exists')) {
                try {
                    await signIn(email, password);
                    navigate(role === 'tpc' ? '/admin' : '/dashboard', { replace: true });
                    return;
                } catch (signInErr) {
                    setError('Account already exists. ' + (signInErr.message || 'Wrong password?'));
                }
            } else if (err.message?.includes('Invalid login credentials') || err.message?.includes('invalid_credentials')) {
                setError('Wrong email or password. Try again or reset your password below.');
            } else if (err.message?.includes('Email not confirmed')) {
                setError('Please confirm your email before signing in.');
            } else {
                setError(err.message || 'Authentication failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    // ── Reset password ────────────────────────────────────────────
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!email) { setError('Enter your email address above first.'); return; }
        reset();
        setLoading(true);
        try {
            await resetPassword(email);
            setMode('reset-sent');
            setInfo(`Password reset link sent to ${email}. Check your inbox.`);
        } catch (err) {
            setError(err.message || 'Could not send reset email. Try again.');
        } finally {
            setLoading(false);
        }
    };

    // ── OAuth ─────────────────────────────────────────────────────
    const handleOAuth = async (provider) => {
        reset();
        setOauthLoading(provider);
        try {
            await signInWithOAuth(provider);
            // User will be redirected by Supabase — no further action needed
        } catch (err) {
            setError(`${provider} sign-in failed: ${err.message}`);
            setOauthLoading('');
        }
    };

    // ── Computed ──────────────────────────────────────────────────
    const isResetSent = mode === 'reset-sent';
    const isReset = mode === 'reset';
    const isSignup = mode === 'signup';
    const isLogin = mode === 'login';

    const submitDisabled = !email || !password || password.length < 6 || loading;

    return (
        <div className="auth-page">
            {/* Background blobs */}
            <motion.div
                animate={{ x: [0, 30, -20, 0], y: [0, -20, 30, 0], scale: [1, 1.1, 0.95, 1] }}
                transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
                className="landing-blob blob-1"
            />
            <motion.div
                animate={{ x: [0, -30, 20, 0], y: [0, 20, -30, 0], scale: [1, 0.95, 1.1, 1] }}
                transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
                className="landing-blob blob-2"
            />

            {/* Loading overlay */}
            <AnimatePresence>
                {(loading || oauthLoading) && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="auth-loading-overlay">
                        <div className="auth-loading-content">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                                className="auth-loading-icon"
                            >
                                <Sparkles size={28} color="#fff" />
                            </motion.div>
                            <motion.p animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}
                                className="auth-loading-text">
                                {oauthLoading ? `Connecting to ${oauthLoading}...` : isSignup ? 'Creating your account...' : 'Signing you in...'}
                            </motion.p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Auth Card */}
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="auth-card-wrapper"
            >
                <div className="auth-card">
                    {/* Logo + Title */}
                    <div className="auth-header">
                        <div className="auth-logo-icon">
                            <Zap size={22} color="#fff" />
                        </div>
                        <h1 className="auth-title">
                            {isResetSent ? (info.startsWith('Account') ? '🎉 Account Created' : '📬 Email Sent')
                                : isReset ? 'Reset Password'
                                : isSignup ? 'Create Account'
                                : 'Welcome Back'}
                        </h1>
                        <p className="auth-subtitle">
                            {isResetSent ? info
                                : isReset ? 'Enter your email and we\'ll send a reset link'
                                : isSignup ? 'Sign up for your Predicta account'
                                : 'Sign in to your Predicta account'}
                        </p>
                    </div>

                    {/* ── Reset sent / email confirm state ── */}
                    {isResetSent ? (
                        <div style={{ textAlign: 'center', padding: '16px 0' }}>
                            <div style={{
                                width: 64, height: 64, borderRadius: 99,
                                background: 'linear-gradient(135deg, #10b981, #34d399)',
                                display: 'grid', placeItems: 'center', margin: '0 auto 20px',
                            }}>
                                <CheckCircle size={32} color="#fff" />
                            </div>
                            <button className="auth-submit-btn"
                                onClick={() => { setMode('login'); setInfo(''); setError(''); }}>
                                Back to Sign In <ArrowRight size={16} />
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Role Tabs (student / TPC) */}
                            <div className="auth-tabs-container">
                                <div className="auth-tabs">
                                    {[
                                        { id: 'student', label: 'Student', icon: GraduationCap },
                                        { id: 'tpc', label: 'TPC Admin', icon: Shield },
                                    ].map(tab => (
                                        <button key={tab.id}
                                            onClick={() => { setRole(tab.id); reset(); }}
                                            className={`auth-tab ${role === tab.id ? 'auth-tab-active' : ''}`}>
                                            <tab.icon size={15} />
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* OAuth buttons (student only) */}
                            {role === 'student' && (
                                <>
                                    <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                                        <OAuthBtn icon={Globe} label="Continue with Google" color="#4285f4"
                                            disabled={!!oauthLoading} onClick={() => handleOAuth('google')} />
                                        <OAuthBtn icon={GitBranch} label="Continue with GitHub" color="var(--text-primary)"
                                            disabled={!!oauthLoading} onClick={() => handleOAuth('github')} />
                                    </div>
                                    <div className="auth-divider">
                                        <span>or with email</span>
                                    </div>
                                </>
                            )}

                            {role === 'tpc' && (
                                <div className="auth-divider">
                                    <span>{isSignup ? 'Create with email' : 'Sign in with email'}</span>
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="auth-form">
                                <div className="auth-field">
                                    <label className="auth-label">Email</label>
                                    <div className="auth-input-wrapper">
                                        <Mail size={15} className="auth-input-icon" />
                                        <input type="email" value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="your@email.com"
                                            className="auth-input" autoComplete="email" />
                                    </div>
                                </div>

                                {!isReset && (
                                    <div className="auth-field">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                            <label className="auth-label" style={{ marginBottom: 0 }}>Password</label>
                                            {isLogin && (
                                                <button type="button"
                                                    onClick={() => { setMode('reset'); reset(); }}
                                                    style={{
                                                        background: 'none', border: 'none', cursor: 'pointer',
                                                        fontSize: 12, color: 'var(--accent-purple)', fontFamily: 'inherit', fontWeight: 600,
                                                    }}>
                                                    Forgot password?
                                                </button>
                                            )}
                                        </div>
                                        <div className="auth-input-wrapper">
                                            <Lock size={15} className="auth-input-icon" />
                                            <input
                                                type={showPass ? 'text' : 'password'}
                                                value={password}
                                                onChange={e => setPassword(e.target.value)}
                                                placeholder={isSignup ? 'Min 6 characters' : 'Your password'}
                                                className="auth-input auth-input-password"
                                                autoComplete={isSignup ? 'new-password' : 'current-password'}
                                                minLength={6}
                                            />
                                            <button type="button" onClick={() => setShowPass(!showPass)} className="auth-eye-btn">
                                                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Error / info */}
                                <AnimatePresence>
                                    {error && (
                                        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }} className="auth-error"
                                            style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                                            <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                                            {error}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Submit */}
                                {isReset ? (
                                    <button type="button" onClick={handleResetPassword}
                                        disabled={!email || loading}
                                        className="auth-submit-btn">
                                        Send Reset Link <ArrowRight size={16} />
                                    </button>
                                ) : (
                                    <button type="submit" disabled={submitDisabled} className="auth-submit-btn">
                                        {isSignup
                                            ? <><UserPlus size={16} /> Create Account</>
                                            : <><ArrowRight size={16} /> Sign In</>}
                                    </button>
                                )}
                            </form>

                            {/* Bottom link */}
                            <div className="auth-bottom-link">
                                {isReset ? (
                                    <><button onClick={() => { setMode('login'); reset(); }}>← Back to Sign In</button></>
                                ) : isLogin ? (
                                    <>Don't have an account?{' '}
                                        <button onClick={() => { setMode('signup'); reset(); }}>Sign Up</button></>
                                ) : (
                                    <>Already have an account?{' '}
                                        <button onClick={() => { setMode('login'); reset(); }}>Sign In</button></>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
