import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Code2, Database, Cpu, Briefcase, ChevronDown, ArrowRight, Check, Sparkles,
    Mail, Lock, Eye, EyeOff, UploadCloud, ExternalLink, FileText, Brain,
    ArrowLeft, Shield, SkipForward
} from 'lucide-react';
import { EXTRACTED_CV_DATA, AI_PROFILE_QUESTIONS } from '../shared/data';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { supabase } from '../lib/supabase';
import { API_BASE } from '../lib/api';

const fadeSlide = {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -60 },
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
};

const domainOptions = [
    { id: 'sde', label: 'Software Development', desc: 'Full-stack, backend, mobile apps', icon: Code2, color: '#6366f1', bg: '#eef2ff' },
    { id: 'data', label: 'Data Science / ML', desc: 'Analytics, machine learning, AI', icon: Database, color: '#f59e0b', bg: '#fefce8' },
    { id: 'core', label: 'Core Engineering', desc: 'Electronics, mechanical, embedded', icon: Cpu, color: '#10b981', bg: '#ecfdf5' },
    { id: 'management', label: 'Management / PM', desc: 'Product management, consulting', icon: Briefcase, color: '#ec4899', bg: '#fdf2f8' },
];

const timeOptions = [
    'Less than 1 month',
    '1 – 3 months',
    '3 – 6 months',
    '6 – 12 months',
    'More than 12 months',
];

const TOTAL_STEPS = 6;

export default function OnboardingPage() {
    const navigate = useNavigate();
    const { signUp, signIn, signInWithOAuth, user } = useAuth();
    const { refetch: refetchProfile, linkedinData, aiAnalysis } = useProfile();

    const [step, setStep] = useState(0);

    // If user is already logged in when onboarding loads, skip the auth step
    useEffect(() => {
        if (user && step === 3) {
            setStep(4);
        }
    }, [user, step]);

    // If user lands on /onboarding already authenticated, jump straight to step 4
    useEffect(() => {
        if (user && step === 0) {
            // Only skip straight to profile import if they're mid-flow (came from OAuth redirect)
            // We check if they came via auth/callback by looking at referrer or just allow normal flow
            // Don't skip steps 0-2 (the engagement questions) — only skip step 3 (auth wall)
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Step 0-2: Engagement questions
    const [domain, setDomain] = useState(null);
    const [timeframe, setTimeframe] = useState('');
    const [confidence, setConfidence] = useState(50);
    const [dropOpen, setDropOpen] = useState(false);

    // Step 3: Auth
    const [authEmail, setAuthEmail] = useState('');
    const [authPassword, setAuthPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [authError, setAuthError] = useState('');
    const [authLoading, setAuthLoading] = useState(false);

    // Step 4: CV
    const [cvMethod, setCvMethod] = useState(null); // 'linkedin' | 'upload' | 'skip'
    const [cvProcessing, setCvProcessing] = useState(false);
    const [cvDone, setCvDone] = useState(false);
    const [cvSkipped, setCvSkipped] = useState(false);
    const fileInputRef = useRef(null);

    // Step 4: LinkedIn Analyzer (real API)
    const [linkedinUrl, setLinkedinUrl] = useState('');
    const [githubUsername, setGithubUsername] = useState('');
    const [analyzeError, setAnalyzeError] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    // Local copy of analysis result — avoids hook context timing lag
    const [localAnalysis, setLocalAnalysis] = useState(null);
    const [localLinkedinData, setLocalLinkedinData] = useState(null);


    // Step 5: AI Analysis
    const [aiStep, setAiStep] = useState(0);
    const [aiAnswers, setAiAnswers] = useState([]);
    const [analysisComplete, setAnalysisComplete] = useState(false);

    const confidenceLabel = confidence < 33 ? 'Low' : confidence < 66 ? 'Medium' : 'High';
    const confidenceColor = confidence < 33 ? '#ef4444' : confidence < 66 ? '#f59e0b' : '#10b981';

    const canProceed = () => {
        switch (step) {
            case 0: return !!domain;
            case 1: return !!timeframe;
            case 2: return true;
            case 3: return !!user || (authEmail && authPassword && authPassword.length >= 6); // pass if already logged in
            case 4: return cvDone || cvSkipped;
            case 5: return analysisComplete;
            default: return false;
        }
    };

    const next = () => {
        if (step < TOTAL_STEPS - 1) {
            setStep(step + 1);
        } else {
            // Complete onboarding, go to dashboard
            navigate('/dashboard');
        }
    };

    const back = () => {
        if (step > 0) setStep(step - 1);
    };

    const handleCVProcess = (method) => {
        setCvMethod(method);
        setCvProcessing(true);
        // Simulate processing for upload method
        setTimeout(() => {
            setCvProcessing(false);
            setCvDone(true);
        }, 2500);
    };

    const handleLinkedInAnalyze = async () => {
        if (!linkedinUrl.trim()) return;
        setAnalyzeError('');
        setAnalyzing(true);
        setCvMethod('linkedin');
        setCvProcessing(true);

        // Wait for auth session if needed (OAuth users arrive here already logged in)
        let userId = user?.id;
        if (!userId) {
            for (let i = 0; i < 6; i++) {
                await new Promise(resolve => setTimeout(resolve, 500));
                const { data } = await supabase.auth.getSession();
                userId = data?.session?.user?.id;
                if (userId) break;
            }
        }

        if (!userId) {
            setAnalyzeError('Please complete account creation first (Step 3).');
            setAnalyzing(false);
            setCvProcessing(false);
            return;
        }

        try {
            // Normalize URL — add https:// if missing
            let normalizedUrl = linkedinUrl.trim();
            if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
                normalizedUrl = 'https://' + normalizedUrl;
            }
            normalizedUrl = normalizedUrl.replace(/^http:\/\//, 'https://').replace(/\/+$/, '');

            // Fire the background function — returns 202 immediately, runs up to 15 min
            const res = await fetch('/.netlify/functions/linkedin-analyze-background', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ linkedinUrl: normalizedUrl, userId }),
            });


            // Background functions always return 202; anything else is a launch error
            if (res.status !== 202 && !res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || `Server error ${res.status}`);
            }

            // Also kick off GitHub verify in the background (non-blocking)
            if (githubUsername.trim()) {
                fetch(`${API_BASE}/api/github/verify`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ githubUsername: githubUsername.trim(), userId }),
                }).catch(e => console.warn('[Onboarding] GitHub verify failed:', e.message));
            }

            // Poll useProfile.refetch() every 5s until ai_analysis appears (max 3 min)
            const POLL_INTERVAL = 5_000;
            const MAX_POLLS = 36; // 36 × 5s = 3 minutes
            for (let i = 0; i < MAX_POLLS; i++) {
                await new Promise(r => setTimeout(r, POLL_INTERVAL));
                await refetchProfile();
                // refetchProfile updates context; also check supabase directly for faster detection
                const { data: profileRow } = await supabase
                    .from('profiles')
                    .select('ai_analysis, linkedin_data, onboarding_meta')
                    .eq('user_id', userId)
                    .single();

                if (profileRow?.ai_analysis) {
                    // Store locally for immediate render — context may lag
                    setLocalAnalysis(profileRow.ai_analysis);
                    setLocalLinkedinData(profileRow.linkedin_data ?? null);
                    // Analysis complete!
                    await refetchProfile(); // refresh context for dashboard
                    setCvProcessing(false);
                    setAnalyzing(false);
                    setCvDone(true);
                    return;
                }

                // LinkedIn data landed but AI analysis is pending/failed.
                // Keep the data truthful and let user continue + re-analyze later.
                if (profileRow?.linkedin_data && !profileRow?.onboarding_meta?.analyzing) {
                    setLocalLinkedinData(profileRow.linkedin_data);
                    await refetchProfile();
                    setCvProcessing(false);
                    setAnalyzing(false);
                    setCvDone(true);
                    return;
                }

                // If backend marked error, surface it
                if (profileRow?.onboarding_meta?.error && !profileRow?.onboarding_meta?.analyzing) {
                    throw new Error(profileRow.onboarding_meta.error);
                }
            }

            // Timed out waiting — still let the user proceed; dashboard will show banner
            console.warn('[Onboarding] Poll timeout — analysis may still be running in background');
            setCvProcessing(false);
            setAnalyzing(false);
            setCvDone(true);

        } catch (err) {
            console.error('[Onboarding] LinkedIn analyze error:', err);
            setAnalyzeError(err.message || 'Could not analyze profile. Try again.');

            setCvProcessing(false);
            setAnalyzing(false);
        }
    };

    const handleAiAnswer = (answer) => {
        const newAnswers = [...aiAnswers, answer];
        setAiAnswers(newAnswers);
        if (aiStep < AI_PROFILE_QUESTIONS.length - 1) {
            setAiStep(aiStep + 1);
        } else {
            setAnalysisComplete(true);
        }
    };

    const handleSocialAuth = async (provider) => {
        setAuthError('');
        setAuthLoading(true);
        try {
            await signInWithOAuth(provider);
            // OAuth redirects away — no next() needed, page reloads on callback
        } catch (err) {
            setAuthError(err.message || `${provider} sign-in failed.`);
            setAuthLoading(false);
        }
    };

    const handleSkipCV = async () => {
        if (user?.id) {
            await supabase.from('profiles').upsert({
                user_id: user.id,
                onboarding_meta: {
                    skippedCv: true,
                    canAnalyzeLater: true,
                    skippedAt: new Date().toISOString(),
                },
                updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id' });
        }
        setCvSkipped(true);
        setCvDone(true); // allow proceeding to next step
    };

    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        setAuthError('');
        setAuthLoading(true);
        try {
            // Try sign up first
            const data = await signUp(authEmail, authPassword);
            // If session returned immediately (autoconfirm on), proceed
            if (data?.session) {
                setAuthLoading(false);
                next();
                return;
            }
            // No session yet — try signing in (account was created, or already exists)
            try {
                await signIn(authEmail, authPassword);
            } catch {
                // Sign-in failed but account was created — proceed anyway
            }
            setAuthLoading(false);
            next();
        } catch (err) {
            // "User already registered" — just sign them in
            if (err.message?.includes('already registered') || err.message?.includes('already exists')) {
                try {
                    await signIn(authEmail, authPassword);
                    setAuthLoading(false);
                    next();
                    return;
                } catch (signInErr) {
                    setAuthError(signInErr.message || 'Wrong password for existing account.');
                    setAuthLoading(false);
                    return;
                }
            }
            setAuthError(err.message || 'Sign up failed. Try another email.');
            setAuthLoading(false);
        }
    };

    return (
        <div className="onboarding-page">
            {/* Background */}
            <motion.div
                animate={{ x: [0, 40, -30, 0], y: [0, -30, 40, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                className="landing-blob blob-1"
            />
            <motion.div
                animate={{ x: [0, -20, 30, 0], y: [0, 30, -20, 0] }}
                transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                className="landing-blob blob-2"
            />

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="onboarding-container"
            >
                <div className="onboarding-card">
                    {/* Progress Bar */}
                    <div className="onboarding-progress">
                        <div className="onboarding-progress-bars">
                            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                                <div key={i} className="onboarding-progress-track">
                                    <motion.div
                                        initial={{ width: '0%' }}
                                        animate={{ width: step >= i ? '100%' : '0%' }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                        className="onboarding-progress-fill"
                                    />
                                </div>
                            ))}
                        </div>
                        <p className="onboarding-step-label">Step {step + 1} of {TOTAL_STEPS}</p>
                    </div>

                    {/* Content */}
                    <div className="onboarding-content">
                        <AnimatePresence mode="wait">
                            {/* ── Step 0: Domain ── */}
                            {step === 0 && (
                                <motion.div key="step0" {...fadeSlide} className="onboarding-step">
                                    <div className="onboarding-step-header">
                                        <h2>Which domain are you targeting?</h2>
                                        <p>Select your primary career focus area</p>
                                    </div>
                                    <div className="onboarding-domain-grid">
                                        {domainOptions.map(opt => (
                                            <motion.button
                                                key={opt.id}
                                                whileHover={{ scale: 1.02, y: -2 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setDomain(opt.id)}
                                                className={`onboarding-domain-card ${domain === opt.id ? 'domain-selected' : ''}`}
                                                style={domain === opt.id ? { backgroundColor: opt.bg, borderColor: '#818cf8' } : {}}
                                            >
                                                {domain === opt.id && (
                                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                                                        className="domain-check">
                                                        <Check size={12} color="#fff" />
                                                    </motion.div>
                                                )}
                                                <div className="domain-icon" style={{ backgroundColor: `${opt.color}15`, color: opt.color }}>
                                                    <opt.icon size={20} />
                                                </div>
                                                <div>
                                                    <div className="domain-label">{opt.label}</div>
                                                    <div className="domain-desc">{opt.desc}</div>
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* ── Step 1: Timeframe ── */}
                            {step === 1 && (
                                <motion.div key="step1" {...fadeSlide} className="onboarding-step">
                                    <div className="onboarding-step-header">
                                        <h2>How much time do you have?</h2>
                                        <p>Before your placement season begins</p>
                                    </div>
                                    <div className="onboarding-dropdown-area">
                                        <div className="onboarding-dropdown-wrapper">
                                            <button onClick={() => setDropOpen(!dropOpen)}
                                                className={`onboarding-dropdown-trigger ${dropOpen ? 'dropdown-open' : ''} ${timeframe ? 'dropdown-filled' : ''}`}>
                                                <span className={timeframe ? 'dropdown-value' : 'dropdown-placeholder'}>
                                                    {timeframe || 'Select a timeframe...'}
                                                </span>
                                                <motion.div animate={{ rotate: dropOpen ? 180 : 0 }}>
                                                    <ChevronDown size={18} color="#9ca3af" />
                                                </motion.div>
                                            </button>
                                            <AnimatePresence>
                                                {dropOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="onboarding-dropdown-menu"
                                                    >
                                                        {timeOptions.map((opt, i) => (
                                                            <button key={i}
                                                                onClick={() => { setTimeframe(opt); setDropOpen(false); }}
                                                                className={`onboarding-dropdown-item ${timeframe === opt ? 'dropdown-item-active' : ''}`}>
                                                                <span>{opt}</span>
                                                                {timeframe === opt && <Check size={14} color="#6366f1" />}
                                                            </button>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* ── Step 2: Confidence ── */}
                            {step === 2 && (
                                <motion.div key="step2" {...fadeSlide} className="onboarding-step">
                                    <div className="onboarding-step-header">
                                        <h2>Rate your confidence</h2>
                                        <p>How prepared do you feel for placements?</p>
                                    </div>
                                    <div className="onboarding-confidence-area">
                                        <div className="confidence-display">
                                            <motion.div
                                                key={confidenceLabel}
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="confidence-badge"
                                                style={{ backgroundColor: `${confidenceColor}12`, color: confidenceColor, border: `2px solid ${confidenceColor}20` }}
                                            >
                                                <Sparkles size={18} />
                                                {confidenceLabel}
                                            </motion.div>
                                            <div className="confidence-value">{confidence}%</div>
                                        </div>
                                        <div className="confidence-slider">
                                            <input
                                                type="range" min="0" max="100"
                                                value={confidence}
                                                onChange={e => setConfidence(Number(e.target.value))}
                                                style={{ background: `linear-gradient(to right, ${confidenceColor} ${confidence}%, #e2e8f0 ${confidence}%)` }}
                                            />
                                            <div className="confidence-labels">
                                                <span style={{ color: '#ef4444' }}>Low</span>
                                                <span style={{ color: '#f59e0b' }}>Medium</span>
                                                <span style={{ color: '#10b981' }}>High</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* ── Step 3: Auth ── */}
                            {step === 3 && (
                                <motion.div key="step3" {...fadeSlide} className="onboarding-step">
                                    <div className="onboarding-step-header">
                                        <h2>Create your account</h2>
                                        <p>Choose how you'd like to sign up</p>
                                    </div>
                                    <div className="onboarding-auth-area">
                                        {/* Social buttons */}
                                        <div className="onboarding-social-buttons">
                                            <button
                                                className="auth-social-btn"
                                                onClick={() => handleSocialAuth('google')}
                                                disabled={authLoading}
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24">
                                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                                </svg>
                                                Continue with Google
                                            </button>
                                            <button
                                                className="auth-social-btn"
                                                onClick={() => handleSocialAuth('github')}
                                                disabled={authLoading}
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58l-.01-2.04c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.14 3 .4 2.28-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22l-.01 3.29c0 .32.21.7.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
                                                </svg>
                                                Continue with GitHub
                                            </button>
                                        </div>

                                        <div className="auth-divider"><span>or use email</span></div>

                                        <form onSubmit={handleAuthSubmit} className="onboarding-auth-form">
                                            <div className="auth-field">
                                                <div className="auth-input-wrapper">
                                                    <Mail size={16} className="auth-input-icon" />
                                                    <input type="email" value={authEmail}
                                                        onChange={e => setAuthEmail(e.target.value)}
                                                        placeholder="your@email.edu"
                                                        className="auth-input" />
                                                </div>
                                            </div>
                                            <div className="auth-field">
                                                <div className="auth-input-wrapper">
                                                    <Lock size={16} className="auth-input-icon" />
                                                    <input type={showPass ? 'text' : 'password'} value={authPassword}
                                                        onChange={e => setAuthPassword(e.target.value)}
                                                        placeholder="Create a password"
                                                        className="auth-input auth-input-password" />
                                                    <button type="button" onClick={() => setShowPass(!showPass)} className="auth-eye-btn">
                                                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                                    </button>
                                                </div>
                                            </div>
                                            {authError && (
                                                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                                                    className="auth-error" style={{ marginTop: 8 }}>
                                                    {authError}
                                                </motion.div>
                                            )}
                                        </form>
                                    </div>
                                </motion.div>
                            )}

                            {/* ── Step 4: CV Import ── */}
                            {step === 4 && (
                                <motion.div key="step4" {...fadeSlide} className="onboarding-step">
                                    <div className="onboarding-step-header">
                                        <h2>Import your profile</h2>
                                        <p>Link LinkedIn or upload your CV — we'll build your digital profile</p>
                                    </div>
                                    <div className="onboarding-cv-area">
                                        {!cvProcessing && !cvDone && (
                                            <>
                                            <div className="cv-options">
                                                {/* ── LinkedIn Analyzer (real API) ── */}
                                                <div className="cv-option-card" style={{ cursor: 'default', display: 'flex', flexDirection: 'column', gap: 12 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                        <div className="cv-option-icon" style={{ background: '#0077b5', flexShrink: 0 }}>
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                                                        </div>
                                                        <div>
                                                            <div className="cv-option-label">Analyze LinkedIn Profile</div>
                                                            <div className="cv-option-desc">AI-powered placement analysis in seconds</div>
                                                        </div>
                                                    </div>
                                                    <input
                                                        id="linkedin-url-input"
                                                        type="text"
                                                        value={linkedinUrl}
                                                        onChange={e => { setLinkedinUrl(e.target.value); setAnalyzeError(''); }}
                                                        placeholder="https://linkedin.com/in/your-username"
                                                        className="onboarding-text-input"
                                                        style={{ width: '100%', boxSizing: 'border-box' }}
                                                    />
                                                    <input
                                                        id="github-username-input"
                                                        type="text"
                                                        value={githubUsername}
                                                        onChange={e => setGithubUsername(e.target.value)}
                                                        placeholder="GitHub username (optional — verifies skills)"
                                                        className="onboarding-text-input"
                                                        style={{ width: '100%', boxSizing: 'border-box' }}
                                                    />
                                                    {analyzeError && (
                                                        <div style={{ fontSize: 12, color: '#ef4444', marginTop: -4 }}>{analyzeError}</div>
                                                    )}
                                                    <motion.button
                                                        id="analyze-profile-btn"
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.97 }}
                                                        onClick={handleLinkedInAnalyze}
                                                        disabled={analyzing || !linkedinUrl.trim()}
                                                        className="btn btn-accent"
                                                        style={{ width: '100%', justifyContent: 'center', opacity: (!linkedinUrl.trim() || analyzing) ? 0.5 : 1 }}
                                                    >
                                                        <Sparkles size={14} />
                                                        {analyzing ? 'Analyzing... (~1-2 min)' : 'Analyze Profile'}
                                                    </motion.button>
                                                </div>

                                                <motion.button
                                                    whileHover={{ scale: 1.02, y: -3 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="cv-option-card"
                                                    onClick={() => handleCVProcess('upload')}
                                                >
                                                    <div className="cv-option-icon" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                                                        <UploadCloud size={24} color="#fff" />
                                                    </div>
                                                    <div className="cv-option-label">Upload your CV</div>
                                                    <div className="cv-option-desc">PDF, DOCX - max 10MB</div>
                                                </motion.button>
                                            </div>
                                            <div style={{ textAlign: 'center', marginTop: 16 }}>
                                                <button
                                                    onClick={handleSkipCV}
                                                    style={{
                                                        background: 'none', border: 'none', color: 'var(--text-muted)',
                                                        cursor: 'pointer', fontSize: 13, display: 'inline-flex',
                                                        alignItems: 'center', gap: 6, padding: '8px 16px',
                                                        borderRadius: 8, transition: 'all 0.2s',
                                                    }}
                                                    onMouseOver={e => { e.target.style.color = 'var(--text-primary)'; }}
                                                    onMouseOut={e => { e.target.style.color = 'var(--text-muted)'; }}
                                                >
                                                    <SkipForward size={14} /> Skip for now
                                                </button>
                                            </div>
                                            </>
                                        )}

                                        {/* Processing spinner */}
                                        {cvProcessing && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="cv-processing"
                                            >
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                    className="cv-processing-icon"
                                                >
                                                    <Brain size={32} color="#6366f1" />
                                                </motion.div>
                                                <div className="cv-processing-label">
                                                    {cvMethod === 'linkedin'
                                                        ? 'Scraping LinkedIn & running AI analysis…'
                                                        : 'Analyzing your CV...'}
                                                </div>
                                                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>
                                                    {cvMethod === 'linkedin' && 'This takes 1–2 minutes. Don\'t close this tab.'}
                                                </div>
                                                <motion.div
                                                    className="cv-processing-bar"
                                                    initial={{ width: '0%' }}
                                                    animate={{ width: '90%' }}
                                                    transition={{ duration: 90, ease: 'linear' }}
                                                />
                                                <div className="cv-processing-steps">
                                                    <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }}>
                                                        Scraping LinkedIn... Running AI analysis... Saving to profile...
                                                    </motion.span>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Result card — shown after processing completes */}
                                        {cvDone && (() => {
                                            const analysis = localAnalysis || aiAnalysis;
                                            const liData   = localLinkedinData || linkedinData;
                                            const skills   = analysis?.skillTags ?? [];
                                            const edu      = liData?.education ?? [];
                                            const exp      = liData?.experiences ?? [];
                                            const isPrivate = skills.length === 0 && edu.length === 0;

                                            return (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="cv-result"
                                                >
                                                    <div className="cv-result-header">
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            className="cv-result-check"
                                                        >
                                                            <Check size={20} color="#fff" />
                                                        </motion.div>
                                                        <div>
                                                            <div className="cv-result-title">
                                                                {cvSkipped ? 'Profile Import Skipped' : 'Profile Analyzed & Saved'}
                                                            </div>
                                                            <div className="cv-result-subtitle">
                                                                {cvSkipped
                                                                    ? 'You can analyze your LinkedIn from the dashboard anytime'
                                                                    : isPrivate
                                                                    ? 'LinkedIn profile appears private — limited data extracted'
                                                                    : 'AI analysis complete · Dashboard now shows real data'}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {isPrivate || cvSkipped ? (
                                                        <div className="cv-result-sections">
                                                            <div className="cv-result-section">
                                                                <div className="cv-section-label" style={{ color: cvSkipped ? '#6366f1' : '#f59e0b' }}>
                                                                    {cvSkipped ? '💡 Tip' : '⚠ Private Profile Detected'}
                                                                </div>
                                                                <div className="cv-section-value">
                                                                    {cvSkipped
                                                                        ? 'Click "Analyze Profile" in your dashboard to import your LinkedIn profile anytime.'
                                                                        : 'Your profile may be private or the URL is incorrect. You can analyze it from the dashboard anytime.'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            {/* Real skill tags */}
                                                            <div className="cv-result-skills">
                                                                {skills.slice(0, 8).map((skill, i) => (
                                                                    <motion.span
                                                                        key={skill}
                                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                                        animate={{ opacity: 1, scale: 1 }}
                                                                        transition={{ delay: i * 0.05 }}
                                                                        className="cv-skill-tag"
                                                                    >
                                                                        {skill}
                                                                    </motion.span>
                                                                ))}
                                                            </div>

                                                            <div className="cv-result-sections">
                                                                {edu.length > 0 && (
                                                                    <div className="cv-result-section">
                                                                        <div className="cv-section-label">Education</div>
                                                                        {edu.slice(0, 2).map((e, i) => (
                                                                            <div key={i} className="cv-section-value">
                                                                                {[e.degree, e.field && `in ${e.field}`, e.school && `— ${e.school}`, e.years && `(${e.years})`].filter(Boolean).join(' ')}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                                {exp.length > 0 && (
                                                                    <div className="cv-result-section">
                                                                        <div className="cv-section-label">Experience</div>
                                                                        {exp.slice(0, 2).map((e, i) => (
                                                                            <div key={i} className="cv-section-value">
                                                                                {e.role}{e.company ? ` @ ${e.company}` : ''}{e.duration ? ` (${e.duration})` : ''}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                                {analysis?.placementScore != null && (
                                                                    <div className="cv-result-section">
                                                                        <div className="cv-section-label">Placement Score</div>
                                                                        <div className="cv-section-value" style={{ fontWeight: 700, color: '#6366f1' }}>
                                                                            {analysis.placementScore}/100 · {analysis.experienceLevel}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </>
                                                    )}
                                                </motion.div>
                                            );
                                        })()}
                                    </div>
                                </motion.div>
                            )}

                            {/* ── Step 5: AI Profile Analysis ── */}
                            {step === 5 && (
                                <motion.div key="step5" {...fadeSlide} className="onboarding-step">
                                    <div className="onboarding-step-header">
                                        <h2>{analysisComplete ? 'Your Career DNA' : 'AI Profile Analysis'}</h2>
                                        <p>{analysisComplete ? 'Here\'s what our AI found about you' : 'Help us understand you better with a few quick questions'}</p>
                                    </div>
                                    <div className="onboarding-ai-area">
                                        {!analysisComplete ? (
                                            <AnimatePresence mode="wait">
                                                <motion.div
                                                    key={aiStep}
                                                    initial={{ opacity: 0, x: 30 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -30 }}
                                                    className="ai-question-card"
                                                >
                                                    <div className="ai-question-badge">
                                                        <Brain size={14} />
                                                        <span>Question {aiStep + 1} of {AI_PROFILE_QUESTIONS.length}</span>
                                                    </div>
                                                    <p className="ai-question-text">
                                                        {AI_PROFILE_QUESTIONS[aiStep].question}
                                                    </p>
                                                    <div className="ai-answer-options">
                                                        {AI_PROFILE_QUESTIONS[aiStep].options.map((opt, i) => (
                                                            <motion.button
                                                                key={opt}
                                                                whileHover={{ scale: 1.02, x: 4 }}
                                                                whileTap={{ scale: 0.98 }}
                                                                onClick={() => handleAiAnswer(opt)}
                                                                className="ai-answer-btn"
                                                            >
                                                                <span className="ai-answer-number">{String.fromCharCode(65 + i)}</span>
                                                                {opt}
                                                                <ArrowRight size={14} className="ai-answer-arrow" />
                                                            </motion.button>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            </AnimatePresence>
                                        ) : (() => {
                                            // Use real analysis data if available, otherwise show summary of answers
                                            const analysis = localAnalysis || aiAnalysis;
                                            const realScore = analysis?.placementScore;
                                            const displayScore = realScore ?? confidence;
                                            const realStrengths = analysis?.skillTags?.slice(0, 3).join(', ');
                                            const realGaps = analysis?.weakAreas?.slice(0, 2).join(', ');
                                            const realRole = analysis?.topRoles?.[0];
                                            const domainLabel = domainOptions.find(d => d.id === domain)?.label || 'Software Development';
                                            const scoreArc = Math.PI * 2 * 54 * (1 - displayScore / 100);

                                            return (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="ai-result-card"
                                                >
                                                    {/* Readiness Gauge */}
                                                    <div className="ai-result-gauge">
                                                        <div className="ai-gauge-circle">
                                                            <svg viewBox="0 0 120 120" className="ai-gauge-svg">
                                                                <circle cx="60" cy="60" r="54" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                                                                <motion.circle
                                                                    cx="60" cy="60" r="54" fill="none"
                                                                    stroke="url(#gaugeGradient)" strokeWidth="8"
                                                                    strokeDasharray={Math.PI * 2 * 54}
                                                                    strokeDashoffset={Math.PI * 2 * 54}
                                                                    animate={{ strokeDashoffset: scoreArc }}
                                                                    transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
                                                                    strokeLinecap="round"
                                                                    style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                                                                />
                                                                <defs>
                                                                    <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                                        <stop offset="0%" stopColor="#6366f1" />
                                                                        <stop offset="100%" stopColor="#10b981" />
                                                                    </linearGradient>
                                                                </defs>
                                                            </svg>
                                                            <div className="ai-gauge-value">{displayScore}%</div>
                                                        </div>
                                                        <div className="ai-gauge-label">Placement Readiness</div>
                                                    </div>

                                                    <div className="ai-result-insights">
                                                        <div className="ai-insight-row">
                                                            <span className="ai-insight-label">Detected Strengths</span>
                                                            <span className="ai-insight-value" style={{ color: '#10b981' }}>
                                                                {realStrengths || 'Based on your answers'}
                                                            </span>
                                                        </div>
                                                        <div className="ai-insight-row">
                                                            <span className="ai-insight-label">Critical Gaps</span>
                                                            <span className="ai-insight-value" style={{ color: '#ef4444' }}>
                                                                {realGaps || 'Identified from questionnaire'}
                                                            </span>
                                                        </div>
                                                        <div className="ai-insight-row">
                                                            <span className="ai-insight-label">Best Fit Role</span>
                                                            <span className="ai-insight-value" style={{ color: '#6366f1' }}>
                                                                {realRole || 'See Dashboard for AI recommendations'}
                                                            </span>
                                                        </div>
                                                        <div className="ai-insight-row">
                                                            <span className="ai-insight-label">Domain</span>
                                                            <span className="ai-insight-value">{domainLabel}</span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })()}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Navigation Footer */}
                    <div className="onboarding-footer">
                        <div className="onboarding-footer-buttons">
                            {step > 0 && (
                                <button onClick={back} className="onboarding-back-btn">
                                    <ArrowLeft size={16} />
                                    Back
                                </button>
                            )}
                            <button
                                onClick={step === 3 ? (user ? next : handleAuthSubmit) : next}
                                disabled={!canProceed() || authLoading}
                                className="onboarding-next-btn"
                            >
                                {authLoading && step === 3
                                    ? 'Creating account...'
                                    : step === TOTAL_STEPS - 1
                                        ? 'Enter Dashboard'
                                        : step === 3
                                            ? (user ? 'Continue' : 'Create Account')
                                            : 'Continue'
                                }
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
