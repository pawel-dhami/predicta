import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Home, ChevronRight, TrendingUp, Users, Building2, Award,
    BarChart3, Bell, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import { APP_TREND, PIPELINE_TREND, FUNNEL_STEPS, STUDENTS, ALERTS } from '../data';

function ChartTooltipCustom({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-lg">
            <p className="text-xs text-gray-400 mb-1">{label}</p>
            {payload.map((p, i) => (
                <p key={i} className="text-sm font-bold" style={{ color: p.color }}>{p.name}: {p.value}</p>
            ))}
        </div>
    );
}

export default function HomePage() {
    return (
        <div className="px-6 py-5 overflow-y-auto h-full">
            <div className="text-[11px] text-gray-400 flex items-center gap-1.5 mb-4">
                <span className="text-gray-700 font-semibold">Homepage</span>
            </div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Welcome back! 👋</h1>
                <p className="text-sm text-gray-400 mt-1">Here's what's happening with your placement program today.</p>
            </motion.div>

            {/* KPI Row */}
            <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="grid grid-cols-4 gap-4 mb-6"
            >
                {[
                    { label: 'Total Students', value: '2,400', change: '+12%', up: true, icon: Users, color: '#6366f1', bg: '#eef2ff' },
                    { label: 'Active Companies', value: '180', change: '+8%', up: true, icon: Building2, color: '#10b981', bg: '#ecfdf5' },
                    { label: 'Placement Rate', value: '67%', change: '+5%', up: true, icon: TrendingUp, color: '#f59e0b', bg: '#fefce8' },
                    { label: 'Total Offers', value: '42', change: '-3%', up: false, icon: Award, color: '#ec4899', bg: '#fdf2f8' },
                ].map((kpi, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }}
                        className="px-5 py-4 rounded-2xl border border-gray-200 bg-white"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: kpi.bg, color: kpi.color }}>
                                <kpi.icon size={18} />
                            </div>
                            <span className={`text-xs font-bold flex items-center gap-0.5 ${kpi.up ? 'text-green-500' : 'text-red-500'}`}>
                                {kpi.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                {kpi.change}
                            </span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
                        <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-0.5">{kpi.label}</div>
                    </motion.div>
                ))}
            </motion.div>

            <div className="grid grid-cols-12 gap-5">
                {/* Pipeline Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                    className="col-span-8 rounded-2xl border border-gray-200 bg-white p-5"
                >
                    <h3 className="text-base font-bold text-gray-900 mb-4">Placement Pipeline</h3>
                    <div className="h-[220px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={PIPELINE_TREND}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                <XAxis dataKey="time" tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={{ stroke: '#e5e7eb' }} tickLine={false} />
                                <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
                                <Tooltip content={<ChartTooltipCustom />} />
                                <Area type="monotone" dataKey="applications" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} strokeWidth={2} name="Applications" />
                                <Area type="monotone" dataKey="offers" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2} name="Offers" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Funnel */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="col-span-4 rounded-2xl border border-gray-200 bg-white p-5"
                >
                    <h3 className="text-base font-bold text-gray-900 mb-4">Conversion Funnel</h3>
                    <div className="space-y-3">
                        {FUNNEL_STEPS.map((step, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-xs mb-1.5">
                                    <span className="text-gray-500 font-medium">{step.label}</span>
                                    <span className="font-bold" style={{ color: step.color }}>{step.count}</span>
                                </div>
                                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(step.count / FUNNEL_STEPS[0].count) * 100}%` }}
                                        transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                                        className="h-full rounded-full"
                                        style={{ backgroundColor: step.color }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Alerts */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                    className="col-span-12 rounded-2xl border border-gray-200 bg-white p-5"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                            <Bell size={16} className="text-indigo-500" /> Recent Alerts
                        </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {ALERTS.map((a, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.05 }}
                                className={`px-4 py-3 rounded-xl border ${a.urgent ? 'border-red-200 bg-red-50/50' : 'border-gray-100 bg-gray-50/50'} flex items-center gap-3`}
                            >
                                <div className={`w-2 h-2 rounded-full shrink-0 ${a.urgent ? 'bg-red-400 animate-pulse' : 'bg-gray-300'}`} />
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs font-semibold text-gray-700 truncate">{a.text}</div>
                                    <div className="text-[10px] text-gray-400">{a.time}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
