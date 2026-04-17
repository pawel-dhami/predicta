import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Download, Users, TrendingUp, Award, ChevronRight, MoreHorizontal } from 'lucide-react';
import { STUDENTS } from '../data';

const riskColors = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' };

export default function ActiveStudents() {
    const [search, setSearch] = useState('');
    const activeStudents = STUDENTS.filter(s => s.status === 'active' || s.status === 'placed');
    const filtered = activeStudents.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="px-6 py-5 overflow-y-auto h-full">
            {/* Breadcrumb */}
            <div className="text-[11px] text-gray-400 flex items-center gap-1.5 mb-4">
                Homepage <ChevronRight size={10} /> Student Management <ChevronRight size={10} /> <span className="text-gray-700 font-semibold">Active Students</span>
            </div>

            <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold text-gray-900 mb-5"
            >
                Active Students
            </motion.h1>

            {/* Stats Row */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-4 gap-4 mb-6"
            >
                {[
                    { label: 'Total Active', value: activeStudents.length, icon: Users, color: '#6366f1', bg: '#eef2ff' },
                    { label: 'Avg CGPA', value: (activeStudents.reduce((a, s) => a + s.cgpa, 0) / activeStudents.length).toFixed(1), icon: Award, color: '#10b981', bg: '#ecfdf5' },
                    { label: 'Avg Completion', value: `${Math.round(activeStudents.reduce((a, s) => a + s.completion, 0) / activeStudents.length)}%`, icon: TrendingUp, color: '#f59e0b', bg: '#fefce8' },
                    { label: 'Total Offers', value: activeStudents.reduce((a, s) => a + s.offers, 0), icon: Award, color: '#ec4899', bg: '#fdf2f8' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 + i * 0.05 }}
                        className="px-5 py-4 rounded-2xl border border-gray-200 bg-white flex items-center gap-4"
                    >
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: stat.bg, color: stat.color }}>
                            <stat.icon size={18} />
                        </div>
                        <div>
                            <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{stat.label}</div>
                            <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Search & Actions */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-between mb-5"
            >
                <div className="relative flex-1 max-w-md">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input
                        type="text" value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search students..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                    />
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-all">
                        <Filter size={14} /> Filter
                    </button>
                    <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-all">
                        <Download size={14} /> Export
                    </button>
                </div>
            </motion.div>

            {/* Table */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="rounded-2xl border border-gray-200 bg-white overflow-hidden"
            >
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100">
                            {['Student', 'Branch', 'CGPA', 'Risk', 'Completion', 'Applied', 'Interviews', 'Offers', 'Last Active', ''].map((h, i) => (
                                <th key={i} className="text-left px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((s, i) => (
                            <motion.tr
                                key={s.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + i * 0.03 }}
                                className="border-b border-gray-50 hover:bg-indigo-50/30 transition-colors cursor-pointer group"
                            >
                                <td className="px-4 py-3.5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white">
                                            {s.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <span className="text-sm font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">{s.name}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3.5 text-xs text-gray-500">{s.branch}</td>
                                <td className="px-4 py-3.5 text-sm font-bold text-gray-800">{s.cgpa}</td>
                                <td className="px-4 py-3.5">
                                    <span className="text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full uppercase"
                                        style={{ color: riskColors[s.risk], backgroundColor: `${riskColors[s.risk]}12`, border: `1px solid ${riskColors[s.risk]}30` }}>
                                        {s.risk}
                                    </span>
                                </td>
                                <td className="px-4 py-3.5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full rounded-full bg-indigo-500" style={{ width: `${s.completion}%` }} />
                                        </div>
                                        <span className="text-xs font-semibold text-gray-500">{s.completion}%</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3.5 text-sm font-semibold text-gray-700">{s.applied}</td>
                                <td className="px-4 py-3.5 text-sm font-semibold text-gray-700">{s.interviews}</td>
                                <td className="px-4 py-3.5">
                                    <span className={`text-sm font-bold ${s.offers > 0 ? 'text-green-500' : 'text-gray-300'}`}>{s.offers}</span>
                                </td>
                                <td className="px-4 py-3.5 text-xs text-gray-400">{s.lastActive}</td>
                                <td className="px-4 py-3.5">
                                    <MoreHorizontal size={16} className="text-gray-300 hover:text-gray-500 cursor-pointer" />
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </motion.div>
        </div>
    );
}
