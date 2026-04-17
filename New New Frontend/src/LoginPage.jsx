import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, GraduationCap, Shield, ArrowRight, Sparkles, User } from 'lucide-react';

const GithubIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
);
import { DEMO_CREDENTIALS } from './data';

// Simple SVG icons for social auth
const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
);

const LinkedInIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
);

export default function LoginPage({ onLogin, isModal = false }) {
    const [mode, setMode] = useState('login'); // login | signup
    const [role, setRole] = useState('student');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (mode === 'signup') {
            if (!name.trim()) { setError('Please enter your name.'); return; }
            // For demo, signup always succeeds
            setLoading(true);
            setTimeout(() => onLogin(role), 1200);
            return;
        }

        const creds = role === 'student' ? DEMO_CREDENTIALS.student : DEMO_CREDENTIALS.tpc;
        if (email === creds.email && password === creds.password) {
            setLoading(true);
            setTimeout(() => onLogin(role), 1200);
        } else {
            setError('Invalid credentials. Check the demo hints below.');
        }
    };

    const handleSocialAuth = (provider) => {
        setLoading(true);
        // Simulate social auth
        setTimeout(() => onLogin(role), 1500);
    };

    const fillDemo = () => {
        const creds = role === 'student' ? DEMO_CREDENTIALS.student : DEMO_CREDENTIALS.tpc;
        setEmail(creds.email);
        setPassword(creds.password);
        setError('');
    };

    const switchMode = () => {
        setMode(mode === 'login' ? 'signup' : 'login');
        setError('');
        setEmail('');
        setPassword('');
        setName('');
    };

    // Loading overlay
    const LoadingOverlay = () => (
        <AnimatePresence>
            {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className={`fixed inset-0 ${isModal ? 'z-[60]' : 'z-50'} bg-white/80 backdrop-blur-xl flex items-center justify-center`}>
                    <div className="flex flex-col items-center gap-5">
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl">
                            <Sparkles size={28} className="text-white" />
                        </motion.div>
                        <motion.p animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}
                            className="text-indigo-600 font-semibold text-sm tracking-wider">
                            {mode === 'signup' ? 'Creating Account...' : 'Authenticating...'}
                        </motion.p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    const AuthCard = () => (
        <div className={`${isModal ? 'bg-white/95 backdrop-blur-2xl' : 'bg-white/90 backdrop-blur-2xl'} rounded-3xl shadow-2xl border border-white/50 overflow-hidden`}>
            {/* Header */}
            <div className={`px-8 pt-8 pb-5 text-center ${isModal ? '' : ''}`}
                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' }}>
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center mx-auto mb-4 shadow-lg border border-white/30">
                    <Shield size={24} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                    {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                </h1>
                <p className="text-sm text-white/60 mt-1">
                    {mode === 'login' ? 'Sign in to PlacementIQ' : 'Join PlacementIQ today'}
                </p>
            </div>

            {/* Role Toggle */}
            <div className="px-8 mt-5 mb-4">
                <div className="flex gap-1 p-1 rounded-2xl bg-gray-100/80">
                    {[
                        { id: 'student', label: 'Student', icon: GraduationCap },
                        { id: 'tpc', label: 'TPC Admin', icon: Shield },
                    ].map(tab => (
                        <button key={tab.id} onClick={() => { setRole(tab.id); setError(''); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300
                                ${role === tab.id
                                    ? 'bg-white text-indigo-600 shadow-md shadow-indigo-500/10'
                                    : 'text-gray-400 hover:text-gray-600'}`}>
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Social Auth Buttons */}
            <div className="px-8 mb-4">
                <div className="grid grid-cols-3 gap-2">
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        onClick={() => handleSocialAuth('google')}
                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-all text-sm font-medium text-gray-600">
                        <GoogleIcon /> Google
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        onClick={() => handleSocialAuth('linkedin')}
                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-all text-sm font-medium text-gray-600">
                        <LinkedInIcon /> LinkedIn
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        onClick={() => handleSocialAuth('github')}
                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-all text-sm font-medium text-gray-600">
                        <GithubIcon /> GitHub
                    </motion.button>
                </div>
                <div className="flex items-center gap-3 my-4">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-xs text-gray-400 font-medium">or continue with email</span>
                    <div className="flex-1 h-px bg-gray-200" />
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-8 pb-5 space-y-3.5">
                {/* Name field (signup only) */}
                <AnimatePresence>
                    {mode === 'signup' && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Full Name</label>
                            <div className="relative">
                                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                                <input type="text" value={name} onChange={e => setName(e.target.value)}
                                    placeholder="Your full name"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Email</label>
                    <div className="relative">
                        <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                            placeholder={role === 'student' ? 'arjun@university.edu' : 'admin@tpc.edu'}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all" />
                    </div>
                </div>

                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Password</label>
                    <div className="relative">
                        <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                        <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                            placeholder={mode === 'signup' ? 'Create a password' : 'Enter your password'}
                            className="w-full pl-10 pr-11 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all" />
                        <button type="button" onClick={() => setShowPass(!showPass)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                {/* Error */}
                <AnimatePresence>
                    {error && (
                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                            className="text-sm text-red-500 bg-red-50 px-4 py-2.5 rounded-xl border border-red-100">
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Submit */}
                <button type="submit" disabled={!email || !password || (mode === 'signup' && !name.trim())}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed">
                    {mode === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight size={16} />
                </button>
            </form>

            {/* Toggle login/signup */}
            <div className="px-8 pb-4 text-center">
                <p className="text-xs text-gray-400">
                    {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
                    <button onClick={switchMode} className="text-indigo-500 font-semibold hover:text-indigo-700 transition-colors">
                        {mode === 'login' ? 'Sign Up' : 'Sign In'}
                    </button>
                </p>
            </div>

            {/* Demo Hint (login only) */}
            {mode === 'login' && (
                <div className="mx-8 mb-6 px-4 py-3 rounded-xl bg-indigo-50/80 border border-indigo-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider mb-0.5">Demo Credentials</p>
                            <p className="text-xs text-indigo-500/70">
                                {role === 'student' ? 'arjun@university.edu / student123' : 'admin@tpc.edu / admin123'}
                            </p>
                        </div>
                        <button type="button" onClick={fillDemo}
                            className="text-[10px] font-bold text-indigo-500 bg-indigo-100 px-3 py-1.5 rounded-lg hover:bg-indigo-200 transition-colors tracking-wider uppercase">
                            Auto-fill
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    if (isModal) {
        return (
            <>
                <LoadingOverlay />
                <AuthCard />
            </>
        );
    }

    // Standalone full-page
    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #fbc2eb 100%)' }}>
            <motion.div animate={{ x: [0, 30, -20, 0], y: [0, -20, 30, 0], scale: [1, 1.1, 0.95, 1] }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full opacity-30"
                style={{ background: 'radial-gradient(circle, #a78bfa, transparent 70%)' }} />
            <LoadingOverlay />
            <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6 }} className="relative z-10 w-full max-w-[460px] mx-4">
                <AuthCard />
            </motion.div>
        </div>
    );
}
