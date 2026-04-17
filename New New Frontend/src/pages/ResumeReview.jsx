import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, FileText, Upload, CheckCircle, AlertCircle, Clock, Eye, Download, Star } from 'lucide-react';

const RESUMES = [
    { student: 'Arjun Sharma', version: 'v3.2', updated: 'Apr 8, 2026', score: 78, issues: 2, strengths: 5, status: 'reviewed' },
    { student: 'Priya Patel', version: 'v2.1', updated: 'Apr 7, 2026', score: 92, issues: 0, strengths: 8, status: 'reviewed' },
    { student: 'Dev Malhotra', version: 'v1.4', updated: 'Apr 6, 2026', score: 65, issues: 4, strengths: 3, status: 'pending' },
    { student: 'Sneha Kumar', version: 'v2.0', updated: 'Apr 5, 2026', score: 71, issues: 3, strengths: 4, status: 'reviewed' },
    { student: 'Rahul Singh', version: 'v1.1', updated: 'Apr 4, 2026', score: 45, issues: 7, strengths: 1, status: 'needs_work' },
];

const scoreColor = (s) => s >= 80 ? '#10b981' : s >= 60 ? '#f59e0b' : '#ef4444';
const statusConfig = {
    reviewed: { label: 'Reviewed', color: '#10b981', icon: CheckCircle },
    pending: { label: 'Pending', color: '#f59e0b', icon: Clock },
    needs_work: { label: 'Needs Work', color: '#ef4444', icon: AlertCircle },
};

export default function ResumeReview() {
    return (
        <div className="px-6 py-5 overflow-y-auto h-full">
            <div className="text-[11px] text-gray-400 flex items-center gap-1.5 mb-4">
                Homepage <ChevronRight size={10} /> Career Guidance <ChevronRight size={10} /> <span className="text-gray-700 font-semibold">Resume Review</span>
            </div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Resume Review</h1>
                    <p className="text-sm text-gray-400 mt-1">AI-powered resume analysis and improvement suggestions</p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold shadow-lg shadow-indigo-500/20">
                    <Upload size={16} /> Upload Resume
                </button>
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Total Reviewed', value: RESUMES.filter(r => r.status === 'reviewed').length, color: '#10b981' },
                    { label: 'Pending Review', value: RESUMES.filter(r => r.status === 'pending').length, color: '#f59e0b' },
                    { label: 'Needs Work', value: RESUMES.filter(r => r.status === 'needs_work').length, color: '#ef4444' },
                    { label: 'Avg Score', value: Math.round(RESUMES.reduce((a, r) => a + r.score, 0) / RESUMES.length), color: '#6366f1' },
                ].map((s, i) => (
                    <div key={i} className="px-5 py-4 rounded-2xl border border-gray-200 bg-white text-center">
                        <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
                        <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-1">{s.label}</div>
                    </div>
                ))}
            </motion.div>

            {/* Resume Cards */}
            <div className="space-y-3">
                {RESUMES.map((r, i) => {
                    const sc = statusConfig[r.status];
                    const SC = sc.icon;
                    return (
                        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.04 }}
                            className="rounded-2xl border border-gray-200 bg-white p-5 hover:shadow-lg hover:shadow-gray-100 transition-all">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                                    {r.student.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-bold text-gray-800">{r.student}</div>
                                    <div className="text-xs text-gray-400">{r.version} · Updated {r.updated}</div>
                                </div>
                                <div className="flex items-center gap-6">
                                    {/* Score */}
                                    <div className="text-center">
                                        <div className="text-xl font-black" style={{ color: scoreColor(r.score) }}>{r.score}</div>
                                        <div className="text-[9px] text-gray-400 uppercase tracking-wider">Score</div>
                                    </div>
                                    {/* Issues */}
                                    <div className="text-center">
                                        <div className="text-sm font-bold text-red-500">{r.issues}</div>
                                        <div className="text-[9px] text-gray-400 uppercase tracking-wider">Issues</div>
                                    </div>
                                    {/* Strengths */}
                                    <div className="text-center">
                                        <div className="text-sm font-bold text-green-500">{r.strengths}</div>
                                        <div className="text-[9px] text-gray-400 uppercase tracking-wider">Strengths</div>
                                    </div>
                                    {/* Status */}
                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
                                        style={{ color: sc.color, backgroundColor: `${sc.color}12`, border: `1px solid ${sc.color}20` }}>
                                        <SC size={10} /> {sc.label}
                                    </span>
                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all"><Eye size={14} className="text-gray-400" /></button>
                                        <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all"><Download size={14} className="text-gray-400" /></button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
