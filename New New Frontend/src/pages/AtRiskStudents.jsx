import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ChevronRight, Clock, TrendingDown, MessageSquare, Send } from 'lucide-react';
import { STUDENTS } from '../data';

const urgencyColors = { high: '#ef4444', medium: '#f59e0b' };

export default function AtRiskStudents() {
    const atRisk = STUDENTS.filter(s => s.risk === 'high' || s.riskScore > 0.4);

    return (
        <div className="px-6 py-5 overflow-y-auto h-full">
            <div className="text-[11px] text-gray-400 flex items-center gap-1.5 mb-4">
                Homepage <ChevronRight size={10} /> Student Management <ChevronRight size={10} /> <span className="text-gray-700 font-semibold">At-Risk Students</span>
            </div>

            <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold text-gray-900 mb-2"
            >
                At-Risk Students
            </motion.h1>
            <p className="text-sm text-gray-400 mb-6">Students who need immediate attention based on AI risk assessment</p>

            {/* Alert Banner */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="px-5 py-4 rounded-2xl bg-gradient-to-r from-red-50 to-orange-50 border border-red-200/50 flex items-center gap-4 mb-6"
            >
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                    <AlertTriangle size={18} className="text-red-500" />
                </div>
                <div className="flex-1">
                    <div className="text-sm font-bold text-red-700">{atRisk.length} students require intervention</div>
                    <div className="text-xs text-red-500/70">Based on activity, completion rate, and application progress</div>
                </div>
                <button className="px-4 py-2 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20">
                    Send Bulk Alert
                </button>
            </motion.div>

            {/* At-Risk Cards */}
            <div className="space-y-4">
                {atRisk.map((s, i) => (
                    <motion.div
                        key={s.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 + i * 0.08 }}
                        className="rounded-2xl border border-gray-200 bg-white p-5 hover:shadow-lg hover:shadow-gray-100 transition-all"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-400 to-orange-500 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-red-500/20">
                                    {s.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <div className="text-base font-bold text-gray-800">{s.name}</div>
                                    <div className="text-xs text-gray-400">{s.branch} · CGPA: {s.cgpa}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <div className="text-[10px] text-gray-400 uppercase tracking-wider">Risk Score</div>
                                    <div className="text-xl font-black" style={{ color: s.riskScore > 0.6 ? '#ef4444' : '#f59e0b' }}>
                                        {Math.round(s.riskScore * 100)}%
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Risk Indicators */}
                        <div className="grid grid-cols-4 gap-3 mb-4">
                            <div className="px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-100">
                                <div className="text-[10px] text-gray-400 font-medium mb-0.5">Completion</div>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full" style={{ width: `${s.completion}%`, backgroundColor: s.completion < 40 ? '#ef4444' : '#f59e0b' }} />
                                    </div>
                                    <span className="text-xs font-bold text-gray-700">{s.completion}%</span>
                                </div>
                            </div>
                            <div className="px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-100">
                                <div className="text-[10px] text-gray-400 font-medium mb-0.5">Applications</div>
                                <div className="text-sm font-bold text-gray-800">{s.applied}</div>
                            </div>
                            <div className="px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-100">
                                <div className="text-[10px] text-gray-400 font-medium mb-0.5">Last Active</div>
                                <div className="text-sm font-bold text-gray-800 flex items-center gap-1">
                                    <Clock size={12} className="text-gray-400" /> {s.lastActive}
                                </div>
                            </div>
                            <div className="px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-100">
                                <div className="text-[10px] text-gray-400 font-medium mb-0.5">Targets</div>
                                <div className="text-xs font-medium text-gray-600 truncate">{s.targets.join(', ')}</div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-500 text-white text-xs font-bold hover:bg-indigo-600 transition-colors shadow-md shadow-indigo-500/20">
                                <MessageSquare size={12} /> Send Reminder
                            </button>
                            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-all">
                                <TrendingDown size={12} /> View Progress
                            </button>
                            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-all">
                                <Send size={12} /> Assign Mentor
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
