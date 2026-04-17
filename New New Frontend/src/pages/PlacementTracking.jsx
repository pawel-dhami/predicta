import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Target, TrendingUp, Calendar, FileText, CheckCircle, Clock, XCircle } from 'lucide-react';
import { STUDENTS } from '../data';

const PLACEMENTS = [
    { student: 'Ananya Roy', company: 'Amazon', role: 'SDE-1', package: '24 LPA', date: 'Apr 1, 2026', status: 'accepted' },
    { student: 'Priya Patel', company: 'NVIDIA', role: 'ML Engineer', package: '32 LPA', date: 'Mar 28, 2026', status: 'accepted' },
    { student: 'Arjun Sharma', company: 'Flipkart', role: 'SDE-1', package: '18 LPA', date: 'Apr 1, 2026', status: 'pending' },
    { student: 'Dev Malhotra', company: 'Google', role: 'L3 SWE', package: '42 LPA', date: 'Apr 5, 2026', status: 'interview' },
    { student: 'Sneha Kumar', company: 'Microsoft', role: 'SDE', package: '28 LPA', date: 'Apr 3, 2026', status: 'rejected' },
];

const statusConfig = {
    accepted: { label: 'Accepted', color: '#10b981', icon: CheckCircle },
    pending: { label: 'Pending', color: '#f59e0b', icon: Clock },
    interview: { label: 'Interview', color: '#6366f1', icon: Calendar },
    rejected: { label: 'Rejected', color: '#ef4444', icon: XCircle },
};

export default function PlacementTracking() {
    return (
        <div className="px-6 py-5 overflow-y-auto h-full">
            <div className="text-[11px] text-gray-400 flex items-center gap-1.5 mb-4">
                Homepage <ChevronRight size={10} /> <span className="text-gray-700 font-semibold">Placement Tracking</span>
            </div>

            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold text-gray-900 mb-2">
                Placement Tracking
            </motion.h1>
            <p className="text-sm text-gray-400 mb-6">Track all placement activities and offer status in real-time</p>

            {/* Summary */}
            <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="grid grid-cols-4 gap-4 mb-6"
            >
                {[
                    { label: 'Total Placed', value: '42', color: '#10b981', bg: '#ecfdf5' },
                    { label: 'In Pipeline', value: '94', color: '#6366f1', bg: '#eef2ff' },
                    { label: 'Interviews', value: '28', color: '#f59e0b', bg: '#fefce8' },
                    { label: 'Pending Offers', value: '15', color: '#ec4899', bg: '#fdf2f8' },
                ].map((s, i) => (
                    <div key={i} className="px-5 py-4 rounded-2xl border border-gray-200 bg-white text-center">
                        <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
                        <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-1">{s.label}</div>
                    </div>
                ))}
            </motion.div>

            {/* Placements Table */}
            <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="rounded-2xl border border-gray-200 bg-white overflow-hidden"
            >
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-800">Recent Placements & Offers</h3>
                    <button className="text-xs font-semibold text-indigo-500 hover:text-indigo-700">View All →</button>
                </div>
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100">
                            {['Student', 'Company', 'Role', 'Package', 'Date', 'Status'].map(h => (
                                <th key={h} className="text-left px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {PLACEMENTS.map((p, i) => {
                            const sc = statusConfig[p.status];
                            return (
                                <motion.tr
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.05 }}
                                    className="border-b border-gray-50 hover:bg-indigo-50/30 transition-colors"
                                >
                                    <td className="px-5 py-3.5 text-sm font-semibold text-gray-800">{p.student}</td>
                                    <td className="px-5 py-3.5 text-sm text-gray-600">{p.company}</td>
                                    <td className="px-5 py-3.5 text-xs text-gray-500">{p.role}</td>
                                    <td className="px-5 py-3.5 text-sm font-bold text-gray-800">{p.package}</td>
                                    <td className="px-5 py-3.5 text-xs text-gray-400">{p.date}</td>
                                    <td className="px-5 py-3.5">
                                        <span className="text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full uppercase flex items-center gap-1 w-max"
                                            style={{ color: sc.color, backgroundColor: `${sc.color}12`, border: `1px solid ${sc.color}30` }}>
                                            <sc.icon size={10} /> {sc.label}
                                        </span>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </motion.div>
        </div>
    );
}
