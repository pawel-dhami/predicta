import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Brain, Target, BarChart3, Users, Shield, Sparkles,
    ArrowRight, Zap, TrendingUp, Award, ChevronRight, Sun, Moon,
    GraduationCap, Briefcase, CheckCircle
} from 'lucide-react';

const FEATURES = [
    { icon: Target, title: 'Smart Placement Tracking', desc: 'AI-powered matching of students to their ideal companies', color: '#6366f1' },
    { icon: BarChart3, title: 'Real-time Analytics', desc: 'Live dashboards with batch, trend and individual reports', color: '#10b981' },
    { icon: Users, title: 'Student Management', desc: 'Full lifecycle tracking from skill gap to final offer', color: '#f59e0b' },
    { icon: Zap, title: 'Career Intelligence', desc: 'Mock interviews, roadmaps, and next-action recommendations', color: '#ec4899' },
];

const STATS = [
    { value: '2,400+', label: 'Students Placed' },
    { value: '95%', label: 'Success Rate' },
    { value: '180+', label: 'Partner Companies' },
    { value: '64%', label: 'Avg Match Score' },
];

const TESTIMONIALS = [
    { name: 'Priya Patel', role: 'CSE B.Tech · Placed at NVIDIA', text: 'PlacementIQ helped me identify my skill gaps and land my dream job in just 3 months.', avatar: 'PP', color: '#8b5cf6' },
    { name: 'Rahul Joshi', role: 'TPC Coordinator', text: 'Managing 2,400 students is now effortless. The analytics dashboard saved us hundreds of hours.', avatar: 'RJ', color: '#10b981' },
    { name: 'Dev Malhotra', role: 'MCA · Placed at Google', text: 'The mock interview AI was incredibly realistic. It prepared me for every curveball question.', avatar: 'DM', color: '#f59e0b' },
];

export default function LandingPage({ onOpenLogin }) {
    const [darkMode, setDarkMode] = useState(true);

    return (
        <div className="min-h-screen overflow-y-auto relative transition-colors duration-500"
            style={{
                background: darkMode
                    ? 'linear-gradient(135deg, #0f0c29 0%, #1a1145 30%, #302b63 60%, #24243e 100%)'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #fbc2eb 100%)'
            }}>

            {/* Animated Background Orbs */}
            <motion.div
                animate={{ x: [0, 60, -40, 0], y: [0, -40, 60, 0], scale: [1, 1.2, 0.9, 1] }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                className="fixed top-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
                style={{ background: 'radial-gradient(circle, #6366f1, transparent 65%)' }}
            />
            <motion.div
                animate={{ x: [0, -50, 30, 0], y: [0, 30, -50, 0], scale: [1, 0.9, 1.15, 1] }}
                transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                className="fixed bottom-[-15%] right-[-10%] w-[700px] h-[700px] rounded-full opacity-15 pointer-events-none"
                style={{ background: 'radial-gradient(circle, #ec4899, transparent 65%)' }}
            />

            {/* Grid overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '80px 80px'
                }} />

            {/* ══ Navbar ══ */}
            <motion.nav
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="sticky top-0 z-30 flex items-center justify-between px-8 py-4 max-w-7xl mx-auto backdrop-blur-xl bg-black/10 rounded-b-2xl"
            >
                <div className="flex items-center gap-3">
                    <motion.div
                        className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30"
                        animate={{ boxShadow: ["0 0 20px rgba(99,102,241,0.3)", "0 0 40px rgba(139,92,246,0.4)", "0 0 20px rgba(99,102,241,0.3)"] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    >
                        <Brain size={20} className="text-white" />
                    </motion.div>
                    <span className="text-xl font-bold text-white tracking-tight">PlacementIQ</span>
                </div>

                <div className="flex items-center gap-4">
                    {/* Dark/Light Toggle */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setDarkMode(!darkMode)}
                        className="w-10 h-10 rounded-xl border border-white/20 bg-white/10 backdrop-blur-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all"
                    >
                        <AnimatePresence mode="wait">
                            {darkMode ? (
                                <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                                    <Sun size={18} />
                                </motion.div>
                            ) : (
                                <motion.div key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                                    <Moon size={18} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>

                    {/* Login Button */}
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(99,102,241,0.5)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onOpenLogin}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-xl transition-all"
                    >
                        <Shield size={16} />
                        Login / Sign Up
                    </motion.button>
                </div>
            </motion.nav>

            {/* ══ Hero Section ══ */}
            <div className="relative z-10 max-w-7xl mx-auto px-8 pt-16 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left: Text */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex items-center gap-2 mb-6"
                        >
                            <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold tracking-wider uppercase flex items-center gap-1.5">
                                <Sparkles size={12} /> AI-Powered Platform
                            </span>
                        </motion.div>

                        <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight mb-6 tracking-tight">
                            Your Career <br />
                            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Intelligence Hub
                            </span>
                        </h1>

                        <p className="text-lg text-white/50 leading-relaxed mb-10 max-w-lg">
                            Transform placement outcomes with AI-driven analytics, smart matching,
                            and real-time career intelligence. Built for students and coordinators.
                        </p>

                        <div className="flex items-center gap-4 flex-wrap">
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(99,102,241,0.5)" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onOpenLogin}
                                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-base shadow-xl shadow-indigo-500/30 hover:shadow-2xl transition-all"
                            >
                                Get Started <ArrowRight size={18} />
                            </motion.button>
                            <a href="#features" className="flex items-center gap-2 px-6 py-4 rounded-2xl border border-white/15 bg-white/5 text-white/70 font-semibold text-sm hover:bg-white/10 hover:text-white transition-all backdrop-blur-xl">
                                Learn More <ChevronRight size={16} />
                            </a>
                        </div>
                    </motion.div>

                    {/* Right: Stats Grid */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                        className="grid grid-cols-2 gap-4"
                    >
                        {STATS.map((s, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + i * 0.1 }}
                                whileHover={{ scale: 1.05, y: -4 }}
                                className="p-6 rounded-2xl bg-white/[0.06] backdrop-blur-2xl border border-white/10 text-center hover:bg-white/[0.1] transition-all cursor-default"
                                style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 8px 32px rgba(0,0,0,0.2)' }}
                            >
                                <div className="text-3xl font-black text-white mb-1">{s.value}</div>
                                <div className="text-xs text-white/40 font-medium tracking-wider uppercase">{s.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* ══ For Whom Section ══ */}
            <div className="relative z-10 max-w-7xl mx-auto px-8 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl font-black text-white mb-3">Built for Everyone</h2>
                    <p className="text-white/40 text-sm max-w-md mx-auto">Whether you're a student preparing for placements or a TPC admin managing thousands, we've got you covered.</p>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="p-8 rounded-3xl bg-white/[0.05] backdrop-blur-2xl border border-white/10 hover:bg-white/[0.08] transition-all"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-5">
                            <GraduationCap size={28} className="text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">For Students</h3>
                        <ul className="space-y-2.5">
                            {['AI-powered skill gap analysis', 'Smart company matching', 'Mock interviews with AI', 'Career roadmap generator', 'Application tracking'].map(f => (
                                <li key={f} className="flex items-center gap-2 text-sm text-white/50">
                                    <CheckCircle size={14} className="text-indigo-400 shrink-0" /> {f}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="p-8 rounded-3xl bg-white/[0.05] backdrop-blur-2xl border border-white/10 hover:bg-white/[0.08] transition-all"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-5">
                            <Briefcase size={28} className="text-purple-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">For TPC Admins</h3>
                        <ul className="space-y-2.5">
                            {['Batch analytics & trend reports', 'Student risk assessment', 'Company relationship management', 'Placement pipeline tracking', 'Interview scheduling & management'].map(f => (
                                <li key={f} className="flex items-center gap-2 text-sm text-white/50">
                                    <CheckCircle size={14} className="text-purple-400 shrink-0" /> {f}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </div>

            {/* ══ Features Grid ══ */}
            <div id="features" className="relative z-10 max-w-7xl mx-auto px-8 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl font-black text-white mb-3">Powerful Features</h2>
                    <p className="text-white/40 text-sm">Everything you need to ace your placement season</p>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {FEATURES.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -6, scale: 1.02 }}
                            className="p-6 rounded-2xl bg-white/[0.05] backdrop-blur-2xl border border-white/10 hover:bg-white/[0.08] transition-all group cursor-default"
                        >
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                                style={{ backgroundColor: `${f.color}20`, color: f.color }}>
                                <f.icon size={22} />
                            </div>
                            <h3 className="text-sm font-bold text-white mb-2">{f.title}</h3>
                            <p className="text-xs text-white/40 leading-relaxed">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* ══ Testimonials ══ */}
            <div className="relative z-10 max-w-7xl mx-auto px-8 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl font-black text-white mb-3">What People Say</h2>
                    <p className="text-white/40 text-sm">Real experiences from our community</p>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {TESTIMONIALS.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="p-6 rounded-2xl bg-white/[0.05] backdrop-blur-2xl border border-white/10"
                        >
                            <p className="text-sm text-white/60 leading-relaxed mb-5 italic">"{t.text}"</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                                    style={{ backgroundColor: t.color }}>{t.avatar}</div>
                                <div>
                                    <div className="text-sm font-semibold text-white">{t.name}</div>
                                    <div className="text-[11px] text-white/40">{t.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* ══ Footer / CTA ══ */}
            <div className="relative z-10 max-w-7xl mx-auto px-8 pb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center p-12 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 backdrop-blur-2xl"
                >
                    <h2 className="text-3xl font-black text-white mb-3">Ready to Transform Your Placements?</h2>
                    <p className="text-white/40 text-sm mb-8 max-w-md mx-auto">Join thousands of students and coordinators already using PlacementIQ.</p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onOpenLogin}
                        className="px-10 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-base shadow-xl shadow-indigo-500/30"
                    >
                        Get Started Free <ArrowRight size={18} className="inline ml-2" />
                    </motion.button>
                </motion.div>
                <div className="mt-12 text-center">
                    <div className="flex items-center justify-center gap-3 text-white/25 text-xs tracking-[0.3em] uppercase">
                        <TrendingUp size={14} /> Trusted by 50+ Universities
                        <span className="mx-2">·</span>
                        <Award size={14} /> Award-Winning AI Engine
                    </div>
                    <p className="text-white/15 text-xs mt-4">© 2026 PlacementIQ. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}
