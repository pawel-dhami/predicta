import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home, LayoutDashboard, Users, Building2, Target, BarChart3,
    MessageSquare, Compass, Settings, HelpCircle, ChevronDown, ChevronRight,
    Search, Bell, Download, Printer, AlertTriangle, TrendingUp
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { STUDENT_DETAIL, APP_TREND } from './data';

// ── Icon Map ──
const ICONS = {
    Home, LayoutDashboard, Users, Building2, Target, BarChart3,
    MessageSquare, Compass, Settings, HelpCircle
};

const NAV_ITEMS = [
    { label: 'Home', icon: 'Home' },
    { label: 'Dashboard', icon: 'LayoutDashboard', active: true },
    {
        label: 'Student Mgmt', icon: 'Users', children: [
            'Active Students', 'At-Risk Students'
        ]
    },
    {
        label: 'Company Relations', icon: 'Building2', children: [
            'Partner Companies', 'New Opportunities'
        ]
    },
    { label: 'Placement Tracking', icon: 'Target' },
    {
        label: 'Analytics', icon: 'BarChart3', children: [
            'Batch Analytics', 'Trend Reports'
        ]
    },
    { label: 'Interview Mgmt', icon: 'MessageSquare' },
    {
        label: 'Career Guidance', icon: 'Compass', children: [
            'Resume Review', 'Mock Interviews'
        ]
    },
    { label: 'Settings', icon: 'Settings' },
    { label: 'Support', icon: 'HelpCircle' },
];

// ── Avatar Stack ──
function AvatarStack({ people, extra = 0 }) {
    return (
        <div className="flex items-center">
            <div className="flex -space-x-2.5">
                {people.map((p, i) => (
                    <div key={i} className="w-8 h-8 rounded-full flex items-center justify-center text-[9px] font-bold text-white border-2 border-white shadow-sm"
                        style={{ backgroundColor: p.color, zIndex: people.length - i }}>
                        {p.initials}
                    </div>
                ))}
            </div>
            {extra > 0 && (
                <span className="ml-1 text-xs font-semibold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
                    +{extra}
                </span>
            )}
        </div>
    );
}

// ── Custom Chart Tooltip ──
function ChartTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-lg">
            <p className="text-xs text-gray-400 mb-1">{label}</p>
            <p className="text-sm font-bold text-indigo-600">{payload[0].value} applications</p>
        </div>
    );
}

// ── Sidebar ──
function Sidebar({ user }) {
    const [expanded, setExpanded] = useState({});

    const toggle = (label) => setExpanded(p => ({ ...p, [label]: !p[label] }));

    return (
        <motion.aside
            initial={{ x: -260, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="w-[240px] h-full flex flex-col border-r border-gray-100 bg-white shrink-0"
        >
            {/* Logo */}
            <div className="px-5 py-5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <Target size={18} className="text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900 tracking-tight">PlacementIQ</span>
            </div>

            {/* Breadcrumb-style hint */}
            <div className="px-5 mb-2">
                <div className="text-[10px] text-gray-300 flex items-center gap-1 flex-wrap">
                    Homepage <ChevronRight size={8} /> Student Mgmt <ChevronRight size={8} /> <span className="text-gray-500 font-medium">Details</span>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
                {NAV_ITEMS.map((item) => {
                    const Icon = ICONS[item.icon] || Home;
                    const isOpen = expanded[item.label];
                    const hasChildren = item.children?.length > 0;

                    return (
                        <div key={item.label}>
                            <button
                                onClick={() => hasChildren && toggle(item.label)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all
                                    ${item.active
                                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-500/20'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
                            >
                                <Icon size={16} className={item.active ? 'text-white' : ''} />
                                <span className="flex-1 text-left">{item.label}</span>
                                {hasChildren && (
                                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                                        <ChevronDown size={14} className={item.active ? 'text-white/60' : 'text-gray-300'} />
                                    </motion.div>
                                )}
                            </button>
                            <AnimatePresence>
                                {isOpen && hasChildren && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden ml-4 mt-0.5"
                                    >
                                        {item.children.map(child => (
                                            <button key={child}
                                                className="w-full text-left px-4 py-2 text-[12px] text-gray-400 hover:text-indigo-500 hover:bg-indigo-50/50 rounded-lg transition-all">
                                                {child}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </nav>

            {/* Bottom User */}
            <div className="p-4 border-t border-gray-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-[11px] font-bold text-white shadow">
                    {user === 'tpc' ? 'JR' : 'AS'}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-700 truncate">{user === 'tpc' ? 'Mark Bennet' : 'Arjun Sharma'}</div>
                    <div className="text-[10px] text-gray-400">{user === 'tpc' ? 'TPC Admin' : 'Student'}</div>
                </div>
                <Settings size={14} className="text-gray-300 cursor-pointer hover:text-gray-500" />
            </div>
        </motion.aside>
    );
}

// ═══════════════════════════════════════════════════
// ── MAIN DASHBOARD ═══════════════════════════════
// ═══════════════════════════════════════════════════
export default function AdminDashboard({ role = 'tpc' }) {
    const s = STUDENT_DETAIL;
    const [activeTab, setActiveTab] = useState('Profile');
    const [trendPeriod, setTrendPeriod] = useState('30 days');

    return (
        <div className="h-screen flex overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #fbc2eb 100%)' }}>

            {/* Outer gradient padding container */}
            <div className="flex-1 p-3 flex">
                <div className="flex-1 bg-white rounded-3xl shadow-2xl overflow-hidden flex">

                    {/* Left Sidebar */}
                    <Sidebar user={role} />

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col overflow-hidden">

                        {/* Top Header */}
                        <motion.header
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="h-14 flex items-center justify-between px-6 border-b border-gray-100 shrink-0"
                        >
                            <div className="text-[11px] text-gray-400 flex items-center gap-1.5">
                                Homepage <ChevronRight size={10} /> Student Management <ChevronRight size={10} /> Student Register <ChevronRight size={10} /> <span className="text-gray-700 font-semibold">Details</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-xs font-medium text-gray-500 hover:bg-gray-50">
                                    Notes <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-[10px] font-bold flex items-center justify-center">7</span>
                                </button>
                                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-xs font-medium text-gray-500 hover:bg-gray-50">
                                    Tasks <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 text-[10px] font-bold flex items-center justify-center">5</span>
                                </button>
                                <div className="relative">
                                    <Bell size={18} className="text-gray-400 cursor-pointer hover:text-gray-600" />
                                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[8px] font-bold flex items-center justify-center">2</span>
                                </div>
                                <Printer size={16} className="text-gray-300 cursor-pointer hover:text-gray-500" />
                                <Download size={16} className="text-gray-300 cursor-pointer hover:text-gray-500" />
                            </div>
                        </motion.header>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto px-6 py-5">

                            {/* Title */}
                            <motion.h1
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-2xl font-bold text-gray-900 mb-5"
                            >
                                {s.id}: {s.name}'s Placement Profile
                            </motion.h1>

                            {/* Info Cards Row */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="flex gap-3 mb-5"
                            >
                                {[
                                    { label: 'Branch', value: s.branchShort },
                                    { label: 'Latest update', value: s.lastUpdate },
                                    { label: 'Status', value: s.status, dot: true },
                                ].map((c, i) => (
                                    <div key={i} className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 bg-white">
                                        <div className="text-[10px] text-gray-400 font-medium mb-0.5">{c.label}</div>
                                        <div className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
                                            {c.dot && <span className="w-2 h-2 rounded-full bg-green-400" />}
                                            {c.value}
                                        </div>
                                    </div>
                                ))}
                                {/* Readiness Score - highlighted */}
                                <div className="px-5 py-3 rounded-2xl text-white flex-1"
                                    style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
                                    <div className="text-[10px] text-white/70 font-medium mb-0.5">Readiness Score</div>
                                    <div className="text-sm font-bold">{s.readinessLevel} {s.readinessScore}</div>
                                </div>
                                {/* Small gradient accent */}
                                <div className="w-12 rounded-2xl" style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)' }} />
                            </motion.div>

                            {/* Tabs */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                                className="flex items-center justify-between mb-6"
                            >
                                <div className="flex gap-2">
                                    {s.tabs.map(tab => (
                                        <button key={tab.label} onClick={() => setActiveTab(tab.label)}
                                            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all
                                                ${activeTab === tab.label
                                                    ? 'bg-gray-900 text-white border-gray-900'
                                                    : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                                            {tab.label}
                                            {tab.count !== null && (
                                                <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center
                                                    ${activeTab === tab.label ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                    {tab.count}
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                                <span className="px-3 py-1.5 rounded-full bg-amber-50 text-amber-600 text-xs font-semibold border border-amber-200 flex items-center gap-1.5">
                                    <AlertTriangle size={12} /> {s.riskLevel}
                                </span>
                            </motion.div>

                            {/* Department Section */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="mb-6"
                            >
                                <h2 className="text-lg font-bold text-gray-900 mb-3">Target Domain: {s.domain}</h2>
                                <div className="grid grid-cols-12 gap-5">
                                    {/* Description */}
                                    <div className="col-span-5">
                                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-2">Description</p>
                                        <p className="text-[13px] text-gray-500 leading-relaxed">{s.domainDescription}</p>
                                    </div>

                                    {/* Scores */}
                                    <div className="col-span-7 grid grid-cols-2 gap-3">
                                        <div className="px-4 py-3 rounded-2xl border border-gray-200">
                                            <div className="text-[10px] text-gray-400 font-medium mb-1">Career Path</div>
                                            <div className="text-sm font-bold text-gray-800">{s.careerPath}</div>
                                        </div>
                                        <div className="px-4 py-3 rounded-2xl border border-gray-200 relative">
                                            <div className="text-[10px] text-gray-400 font-medium mb-1">Inherent Readiness</div>
                                            <div className="text-2xl font-black text-gray-900">{s.inherentReadiness}</div>
                                            <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-indigo-400" />
                                        </div>
                                        <div className="px-4 py-3 rounded-2xl border border-gray-200 relative"
                                            style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)' }}>
                                            <div className="text-[10px] text-amber-600 font-medium mb-1">Residual Gap Score</div>
                                            <div className="text-2xl font-black text-amber-900">{s.residualGap}</div>
                                            <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-red-400" />
                                        </div>
                                        <div className="px-4 py-3 rounded-2xl border border-gray-200">
                                            <div className="text-[10px] text-gray-400 font-medium mb-1">Methodology</div>
                                            <div className="text-sm font-bold text-gray-800">{s.methodology}</div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Avatars Row */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25 }}
                                className="grid grid-cols-3 gap-5 mb-6"
                            >
                                <div>
                                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-2.5">Mentors</p>
                                    <AvatarStack people={s.mentors} extra={1} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-2.5">TPC Coordinators</p>
                                    <AvatarStack people={s.coordinators} extra={6} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-2.5">Recruiters</p>
                                    <AvatarStack people={s.recruiters} extra={4} />
                                </div>
                            </motion.div>

                            {/* Bottom Row: Skill Gap Card + Trend Chart */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="grid grid-cols-12 gap-4"
                            >
                                {/* Skill Gap Card */}
                                <div className="col-span-3 rounded-2xl p-4 text-white"
                                    style={{ background: 'linear-gradient(180deg, #312e81, #4338ca)' }}>
                                    <p className="text-[10px] text-indigo-200 font-semibold uppercase tracking-wider mb-3">Critical Skill Gap</p>
                                    <h3 className="text-lg font-bold mb-4">{s.skillGap.title}</h3>
                                    <p className="text-xs text-indigo-200 mb-6">{s.skillGap.description}</p>
                                    <div className="flex justify-between items-center border-t border-indigo-400/30 pt-3 mb-3">
                                        <span className="text-xs text-indigo-200">Priority</span>
                                        <span className="w-7 h-7 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">{s.skillGap.priority}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-indigo-200">Threat Level</span>
                                        <span className="text-sm font-bold">{s.skillGap.threat}</span>
                                    </div>
                                </div>

                                {/* Trend Chart */}
                                <div className="col-span-9 rounded-2xl border border-gray-200 p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-base font-bold text-gray-900">Application Trend</h3>
                                        <div className="flex gap-1 p-0.5 rounded-xl bg-gray-100">
                                            {['12 months', '30 days', '1 week'].map(p => (
                                                <button key={p} onClick={() => setTrendPeriod(p)}
                                                    className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all
                                                        ${trendPeriod === p
                                                            ? 'bg-white text-gray-700 shadow-sm'
                                                            : 'text-gray-400 hover:text-gray-600'}`}>
                                                    {p}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="h-[160px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={APP_TREND}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                                <XAxis dataKey="period"
                                                    tick={{ fill: '#9ca3af', fontSize: 10 }}
                                                    axisLine={{ stroke: '#e5e7eb' }}
                                                    tickLine={false} />
                                                <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }}
                                                    axisLine={false} tickLine={false} />
                                                <Tooltip content={<ChartTooltip />} />
                                                <Line type="monotone" dataKey="count"
                                                    stroke="#6366f1" strokeWidth={2.5}
                                                    dot={{ fill: '#6366f1', r: 3, strokeWidth: 0 }}
                                                    activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff', strokeWidth: 3 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
