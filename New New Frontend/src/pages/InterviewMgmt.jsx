import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Calendar, Clock, Video, Users, CheckCircle, XCircle, MapPin, Plus } from 'lucide-react';

const INTERVIEWS = [
    { id: 1, student: 'Arjun Sharma', company: 'Amazon', role: 'SDE-1', date: 'Apr 12, 2026', time: '10:00 AM', type: 'Technical', mode: 'Video', status: 'scheduled', round: 'Round 2' },
    { id: 2, student: 'Priya Patel', company: 'NVIDIA', role: 'ML Engineer', date: 'Apr 12, 2026', time: '2:00 PM', type: 'HR', mode: 'In-Person', status: 'scheduled', round: 'Final' },
    { id: 3, student: 'Dev Malhotra', company: 'Google', role: 'L3 SWE', date: 'Apr 10, 2026', time: '11:30 AM', type: 'System Design', mode: 'Video', status: 'completed', round: 'Round 1' },
    { id: 4, student: 'Sneha Kumar', company: 'Microsoft', role: 'SDE', date: 'Apr 9, 2026', time: '3:00 PM', type: 'Technical', mode: 'Video', status: 'completed', round: 'Round 1' },
    { id: 5, student: 'Rahul Singh', company: 'TCS', role: 'Developer', date: 'Apr 14, 2026', time: '9:30 AM', type: 'Aptitude', mode: 'In-Person', status: 'scheduled', round: 'Round 1' },
    { id: 6, student: 'Ananya Roy', company: 'Flipkart', role: 'SDE-1', date: 'Apr 8, 2026', time: '4:00 PM', type: 'HR', mode: 'Video', status: 'cancelled', round: 'Final' },
];

const statusStyles = {
    scheduled: { label: 'Scheduled', color: '#6366f1', bg: '#eef2ff' },
    completed: { label: 'Completed', color: '#10b981', bg: '#ecfdf5' },
    cancelled: { label: 'Cancelled', color: '#ef4444', bg: '#fef2f2' },
};

export default function InterviewMgmt() {
    const [filter, setFilter] = useState('all');
    const filtered = filter === 'all' ? INTERVIEWS : INTERVIEWS.filter(i => i.status === filter);

    return (
        <div className="px-6 py-5 overflow-y-auto h-full">
            <div className="text-[11px] text-gray-400 flex items-center gap-1.5 mb-4">
                Homepage <ChevronRight size={10} /> <span className="text-gray-700 font-semibold">Interview Management</span>
            </div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Interview Management</h1>
                    <p className="text-sm text-gray-400 mt-1">Schedule and track all placement interviews</p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold shadow-lg shadow-indigo-500/20">
                    <Plus size={16} /> Schedule Interview
                </button>
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Upcoming', value: INTERVIEWS.filter(i => i.status === 'scheduled').length, color: '#6366f1' },
                    { label: 'Completed', value: INTERVIEWS.filter(i => i.status === 'completed').length, color: '#10b981' },
                    { label: 'Cancelled', value: INTERVIEWS.filter(i => i.status === 'cancelled').length, color: '#ef4444' },
                    { label: 'This Week', value: 4, color: '#f59e0b' },
                ].map((s, i) => (
                    <div key={i} className="px-5 py-4 rounded-2xl border border-gray-200 bg-white text-center">
                        <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
                        <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-1">{s.label}</div>
                    </div>
                ))}
            </motion.div>

            {/* Filter */}
            <div className="flex gap-2 mb-5">
                {['all', 'scheduled', 'completed', 'cancelled'].map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all capitalize
                            ${filter === f ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                        {f === 'all' ? 'All' : f}
                    </button>
                ))}
            </div>

            {/* Interview Cards */}
            <div className="space-y-3">
                {filtered.map((iv, i) => {
                    const st = statusStyles[iv.status];
                    return (
                        <motion.div key={iv.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.04 }}
                            className="rounded-2xl border border-gray-200 bg-white p-5 hover:shadow-lg hover:shadow-gray-100 transition-all flex items-center gap-5">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                                {iv.student.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold text-gray-800">{iv.student}</div>
                                <div className="text-xs text-gray-400">{iv.company} · {iv.role} · {iv.round}</div>
                            </div>
                            <div className="flex items-center gap-6 text-xs text-gray-500">
                                <div className="flex items-center gap-1.5"><Calendar size={12} className="text-gray-400" /> {iv.date}</div>
                                <div className="flex items-center gap-1.5"><Clock size={12} className="text-gray-400" /> {iv.time}</div>
                                <div className="flex items-center gap-1.5">
                                    {iv.mode === 'Video' ? <Video size={12} /> : <MapPin size={12} />} {iv.mode}
                                </div>
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                                    style={{ color: st.color, backgroundColor: st.bg, border: `1px solid ${st.color}20` }}>
                                    {st.label}
                                </span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
