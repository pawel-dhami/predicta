import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, GraduationCap, Shield, ArrowRight, Sparkles } from 'lucide-react';
import { DEMO_CREDENTIALS } from './data';

export default function LoginPage({ onLogin }) {
    const [role, setRole] = useState('student');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        const creds = role === 'student' ? DEMO_CREDENTIALS.student : DEMO_CREDENTIALS.tpc;

        if (email === creds.email && password === creds.password) {
            setLoading(true);
            setTimeout(() => {
                onLogin(role);
            }, 1200);
        } else {
            setError('Invalid credentials. Check the demo hints below.');
        }
    };

    const fillDemo = () => {
        const creds = role === 'student' ? DEMO_CREDENTIALS.student : DEMO_CREDENTIALS.tpc;
        setEmail(creds.email);
        setPassword(creds.password);
        setError('');
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #fbc2eb 100%)' }}>

            {/* Animated Background Blobs */}
            <motion.div
                animate={{ x: [0, 30, -20, 0], y: [0, -20, 30, 0], scale: [1, 1.1, 0.95, 1] }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full opacity-30"
                style={{ background: 'radial-gradient(circle, #a78bfa, transparent 70%)' }}
            />
            <motion.div
                animate={{ x: [0, -30, 20, 0], y: [0, 20, -30, 0], scale: [1, 0.95, 1.1, 1] }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full opacity-25"
                style={{ background: 'radial-gradient(circle, #fb7185, transparent 70%)' }}
            />

            {/* Auth Loading Overlay */}
            <AnimatePresence>
                {loading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-white/80 backdrop-blur-xl flex items-center justify-center">
                        <div className="flex flex-col items-center gap-5">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl"
                            >
                                <Sparkles size={28} className="text-white" />
                            </motion.div>
                            <motion.p
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="text-indigo-600 font-semibold text-sm tracking-wider"
                            >
                                Authenticating...
                            </motion.p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Login Card */}
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative z-10 w-full max-w-[440px] mx-4"
            >
                <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
                    {/* Header */}
                    <div className="px-8 pt-8 pb-5 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/25">
                            <Shield size={24} className="text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">PlacementIQ</h1>
                        <p className="text-sm text-gray-400 mt-1">Intelligent Placement Intelligence Platform</p>
                    </div>

                    {/* Role Tabs */}
                    <div className="px-8 mb-5">
                        <div className="flex gap-1 p-1 rounded-2xl bg-gray-100/80">
                            {[
                                { id: 'student', label: 'Student', icon: GraduationCap },
                                { id: 'tpc', label: 'TPC Admin', icon: Shield },
                            ].map(tab => (
                                <button key={tab.id} onClick={() => { setRole(tab.id); setError(''); setEmail(''); setPassword(''); }}
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

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="px-8 pb-6 space-y-4">
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
                                    placeholder="Enter your password"
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
                        <button type="submit" disabled={!email || !password}
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed">
                            Sign In <ArrowRight size={16} />
                        </button>
                    </form>

                    {/* Demo Hint */}
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
                </div>
            </motion.div>
        </div>
    );
}
