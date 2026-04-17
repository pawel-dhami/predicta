import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, BarChart3, TrendingUp, Users, PieChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, LineChart, Line } from 'recharts';

const BATCH_DATA = [
    { batch: 'CSE 2024', placed: 85, total: 120, avgPkg: 18.5, topPkg: 42 },
    { batch: 'ECE 2024', placed: 42, total: 80, avgPkg: 12.3, topPkg: 28 },
    { batch: 'MCA 2024', placed: 35, total: 60, avgPkg: 14.1, topPkg: 32 },
    { batch: 'ME 2024', placed: 28, total: 50, avgPkg: 8.5, topPkg: 18 },
    { batch: 'EE 2024', placed: 32, total: 55, avgPkg: 10.2, topPkg: 22 },
];

const CHART_DATA = BATCH_DATA.map(b => ({ name: b.batch, placed: b.placed, unplaced: b.total - b.placed }));

const TREND_DATA = [
    { year: '2020', rate: 52 }, { year: '2021', rate: 58 }, { year: '2022', rate: 65 },
    { year: '2023', rate: 71 }, { year: '2024', rate: 78 }, { year: '2025', rate: 82 }, { year: '2026', rate: 88 },
];

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'];

function ChartTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-lg">
            <p className="text-xs text-gray-400 mb-1">{label}</p>
            {payload.map((p, i) => (
                <p key={i} className="text-sm font-bold" style={{ color: p.fill || p.color }}>{p.name}: {p.value}</p>
            ))}
        </div>
    );
}

export default function BatchAnalytics() {
    return (
        <div className="px-6 py-5 overflow-y-auto h-full">
            <div className="text-[11px] text-gray-400 flex items-center gap-1.5 mb-4">
                Homepage <ChevronRight size={10} /> Analytics <ChevronRight size={10} /> <span className="text-gray-700 font-semibold">Batch Analytics</span>
            </div>

            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold text-gray-900 mb-6">
                Batch Analytics
            </motion.h1>

            <div className="grid grid-cols-12 gap-5 mb-6">
                {/* Bar Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="col-span-7 rounded-2xl border border-gray-200 bg-white p-5"
                >
                    <h3 className="text-sm font-bold text-gray-800 mb-4">Placement by Branch</h3>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={CHART_DATA} barCategoryGap="20%">
                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 10 }} tickLine={false} axisLine={{ stroke: '#e5e7eb' }} />
                                <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
                                <Tooltip content={<ChartTooltip />} />
                                <Bar dataKey="placed" name="Placed" radius={[6, 6, 0, 0]}>
                                    {CHART_DATA.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Bar>
                                <Bar dataKey="unplaced" name="Unplaced" fill="#e5e7eb" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Year Trend */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    className="col-span-5 rounded-2xl border border-gray-200 bg-white p-5"
                >
                    <h3 className="text-sm font-bold text-gray-800 mb-4">Placement Rate Trend</h3>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={TREND_DATA}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                <XAxis dataKey="year" tick={{ fill: '#9ca3af', fontSize: 10 }} tickLine={false} axisLine={{ stroke: '#e5e7eb' }} />
                                <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} domain={[40, 100]} />
                                <Tooltip content={<ChartTooltip />} />
                                <Line type="monotone" dataKey="rate" stroke="#6366f1" strokeWidth={2.5}
                                    dot={{ fill: '#6366f1', r: 4, strokeWidth: 0 }}
                                    activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff', strokeWidth: 3 }}
                                    name="Placement %" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Batch Table */}
            <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="rounded-2xl border border-gray-200 bg-white overflow-hidden"
            >
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100">
                            {['Batch', 'Placed', 'Total', 'Rate', 'Avg Package', 'Top Package'].map(h => (
                                <th key={h} className="text-left px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {BATCH_DATA.map((b, i) => (
                            <motion.tr
                                key={i}
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 + i * 0.04 }}
                                className="border-b border-gray-50 hover:bg-indigo-50/30 transition-colors"
                            >
                                <td className="px-5 py-3.5 text-sm font-bold text-gray-800">{b.batch}</td>
                                <td className="px-5 py-3.5 text-sm font-semibold text-green-600">{b.placed}</td>
                                <td className="px-5 py-3.5 text-sm text-gray-500">{b.total}</td>
                                <td className="px-5 py-3.5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full rounded-full bg-indigo-500" style={{ width: `${(b.placed / b.total) * 100}%` }} />
                                        </div>
                                        <span className="text-xs font-bold text-gray-700">{Math.round((b.placed / b.total) * 100)}%</span>
                                    </div>
                                </td>
                                <td className="px-5 py-3.5 text-sm font-bold text-gray-800">{b.avgPkg} LPA</td>
                                <td className="px-5 py-3.5 text-sm font-bold text-indigo-600">{b.topPkg} LPA</td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </motion.div>
        </div>
    );
}
