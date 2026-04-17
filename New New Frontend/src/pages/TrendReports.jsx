import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, TrendingUp, BarChart3, ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';

const MONTHLY_DATA = [
    { month: 'Jan', placed: 5, applied: 28 }, { month: 'Feb', placed: 8, applied: 35 },
    { month: 'Mar', placed: 12, applied: 42 }, { month: 'Apr', placed: 18, applied: 55 },
    { month: 'May', placed: 22, applied: 60 }, { month: 'Jun', placed: 15, applied: 45 },
    { month: 'Jul', placed: 10, applied: 38 }, { month: 'Aug', placed: 25, applied: 70 },
    { month: 'Sep', placed: 30, applied: 82 }, { month: 'Oct', placed: 35, applied: 90 },
    { month: 'Nov', placed: 28, applied: 65 }, { month: 'Dec', placed: 20, applied: 50 },
];

const PKG_TREND = [
    { year: '2020', avg: 8.5, top: 22 }, { year: '2021', avg: 10.2, top: 28 },
    { year: '2022', avg: 12.8, top: 35 }, { year: '2023', avg: 14.5, top: 42 },
    { year: '2024', avg: 16.2, top: 48 }, { year: '2025', avg: 18.5, top: 55 },
];

const DOMAIN_SPLIT = [
    { domain: 'Software Dev', pct: 42, color: '#6366f1' },
    { domain: 'Data Science', pct: 22, color: '#10b981' },
    { domain: 'Core Eng', pct: 18, color: '#f59e0b' },
    { domain: 'Management', pct: 12, color: '#ec4899' },
    { domain: 'Others', pct: 6, color: '#64748b' },
];

function Tip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-lg">
            <p className="text-xs text-gray-400 mb-1">{label}</p>
            {payload.map((p, i) => <p key={i} className="text-sm font-bold" style={{ color: p.stroke || p.color }}>{p.name}: {p.value}</p>)}
        </div>
    );
}

export default function TrendReports() {
    const [period, setPeriod] = useState('1 Year');

    return (
        <div className="px-6 py-5 overflow-y-auto h-full">
            <div className="text-[11px] text-gray-400 flex items-center gap-1.5 mb-4">
                Homepage <ChevronRight size={10} /> Analytics <ChevronRight size={10} /> <span className="text-gray-700 font-semibold">Trend Reports</span>
            </div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Trend Reports</h1>
                    <p className="text-sm text-gray-400 mt-1">Historical placement trends and analytics</p>
                </div>
                <div className="flex gap-1 p-0.5 rounded-xl bg-gray-100">
                    {['6 Months', '1 Year', '3 Years'].map(p => (
                        <button key={p} onClick={() => setPeriod(p)}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${period === p ? 'bg-white text-gray-700 shadow-sm' : 'text-gray-400'}`}>
                            {p}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* KPIs */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'YoY Growth', value: '+23%', up: true, color: '#10b981' },
                    { label: 'Avg Package', value: '18.5 LPA', up: true, color: '#6366f1' },
                    { label: 'Placement Rate', value: '82%', up: true, color: '#f59e0b' },
                    { label: 'Rejection Rate', value: '12%', up: false, color: '#ef4444' },
                ].map((k, i) => (
                    <div key={i} className="px-5 py-4 rounded-2xl border border-gray-200 bg-white">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{k.label}</span>
                            <span className={`text-xs font-bold flex items-center gap-0.5 ${k.up ? 'text-green-500' : 'text-red-500'}`}>
                                {k.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {k.value}
                            </span>
                        </div>
                        <div className="text-xl font-bold" style={{ color: k.color }}>{k.value}</div>
                    </div>
                ))}
            </motion.div>

            <div className="grid grid-cols-12 gap-5 mb-6">
                {/* Monthly Trend */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    className="col-span-8 rounded-2xl border border-gray-200 bg-white p-5">
                    <h3 className="text-sm font-bold text-gray-800 mb-4">Monthly Placement vs Application Trend</h3>
                    <div className="h-[260px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={MONTHLY_DATA}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 10 }} tickLine={false} axisLine={{ stroke: '#e5e7eb' }} />
                                <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
                                <Tooltip content={<Tip />} />
                                <Area type="monotone" dataKey="applied" stroke="#6366f1" fill="#6366f1" fillOpacity={0.08} strokeWidth={2} name="Applied" />
                                <Area type="monotone" dataKey="placed" stroke="#10b981" fill="#10b981" fillOpacity={0.08} strokeWidth={2} name="Placed" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Domain Split */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="col-span-4 rounded-2xl border border-gray-200 bg-white p-5">
                    <h3 className="text-sm font-bold text-gray-800 mb-4">Domain Distribution</h3>
                    <div className="space-y-4">
                        {DOMAIN_SPLIT.map((d, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-xs mb-1.5">
                                    <span className="text-gray-500 font-medium">{d.domain}</span>
                                    <span className="font-bold" style={{ color: d.color }}>{d.pct}%</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${d.pct}%` }}
                                        transition={{ duration: 1, delay: 0.2 + i * 0.1 }}
                                        className="h-full rounded-full" style={{ backgroundColor: d.color }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Package Trend */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                className="rounded-2xl border border-gray-200 bg-white p-5">
                <h3 className="text-sm font-bold text-gray-800 mb-4">Package Trend (LPA)</h3>
                <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={PKG_TREND}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                            <XAxis dataKey="year" tick={{ fill: '#9ca3af', fontSize: 10 }} tickLine={false} axisLine={{ stroke: '#e5e7eb' }} />
                            <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<Tip />} />
                            <Line type="monotone" dataKey="avg" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: '#6366f1', r: 4 }} name="Average" />
                            <Line type="monotone" dataKey="top" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: '#10b981', r: 3 }} name="Top" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>
        </div>
    );
}
