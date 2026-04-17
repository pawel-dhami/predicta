import React from 'react';
import { motion } from 'framer-motion';
import { Building2, ChevronRight, Globe, Users, Briefcase, Star, ExternalLink, MapPin } from 'lucide-react';

const PARTNERS = [
    { name: 'Amazon', logo: 'A', color: '#f97316', roles: ['SDE-1', 'SDE-2', 'Data Engineer'], hires: 12, location: 'Bangalore, Hyderabad', rating: 4.5, package: '24-42 LPA', status: 'Active' },
    { name: 'Google', logo: 'G', color: '#4285f4', roles: ['L3 SWE', 'L4 SWE', 'ML Engineer'], hires: 8, location: 'Bangalore, Gurugram', rating: 4.8, package: '32-58 LPA', status: 'Active' },
    { name: 'Microsoft', logo: 'M', color: '#00a4ef', roles: ['SDE', 'PM', 'Data Scientist'], hires: 15, location: 'Hyderabad, Noida', rating: 4.6, package: '22-45 LPA', status: 'Active' },
    { name: 'Flipkart', logo: 'F', color: '#ffc220', roles: ['SDE-1', 'Backend Eng'], hires: 10, location: 'Bangalore', rating: 4.2, package: '18-35 LPA', status: 'Active' },
    { name: 'NVIDIA', logo: 'N', color: '#76b900', roles: ['ML Engineer', 'GPU Architect'], hires: 5, location: 'Pune, Bangalore', rating: 4.7, package: '28-50 LPA', status: 'Upcoming' },
    { name: 'Adobe', logo: 'Ad', color: '#ff0000', roles: ['SDE', 'UX Engineer'], hires: 7, location: 'Noida, Bangalore', rating: 4.4, package: '20-38 LPA', status: 'Active' },
];

export default function PartnerCompanies() {
    return (
        <div className="px-6 py-5 overflow-y-auto h-full">
            <div className="text-[11px] text-gray-400 flex items-center gap-1.5 mb-4">
                Homepage <ChevronRight size={10} /> Company Relations <ChevronRight size={10} /> <span className="text-gray-700 font-semibold">Partner Companies</span>
            </div>

            <motion.h1
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold text-gray-900 mb-2"
            >Partner Companies</motion.h1>
            <p className="text-sm text-gray-400 mb-6">{PARTNERS.length} active recruitment partners</p>

            {/* Summary */}
            <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="grid grid-cols-3 gap-4 mb-6"
            >
                {[
                    { label: 'Total Partners', value: PARTNERS.length, icon: Building2, color: '#6366f1', bg: '#eef2ff' },
                    { label: 'Total Hires', value: PARTNERS.reduce((a, p) => a + p.hires, 0), icon: Users, color: '#10b981', bg: '#ecfdf5' },
                    { label: 'Open Roles', value: PARTNERS.reduce((a, p) => a + p.roles.length, 0), icon: Briefcase, color: '#f59e0b', bg: '#fefce8' },
                ].map((s, i) => (
                    <div key={i} className="px-5 py-4 rounded-2xl border border-gray-200 bg-white flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: s.bg, color: s.color }}>
                            <s.icon size={18} />
                        </div>
                        <div>
                            <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{s.label}</div>
                            <div className="text-xl font-bold text-gray-900">{s.value}</div>
                        </div>
                    </div>
                ))}
            </motion.div>

            {/* Company Cards */}
            <div className="grid grid-cols-2 gap-4">
                {PARTNERS.map((p, i) => (
                    <motion.div
                        key={p.name}
                        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }}
                        className="rounded-2xl border border-gray-200 bg-white p-5 hover:shadow-lg hover:shadow-gray-100 transition-all group cursor-pointer"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg"
                                    style={{ backgroundColor: p.color, boxShadow: `0 4px 15px ${p.color}30` }}>
                                    {p.logo}
                                </div>
                                <div>
                                    <div className="text-base font-bold text-gray-800 group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                                        {p.name} <ExternalLink size={12} className="text-gray-300" />
                                    </div>
                                    <div className="text-xs text-gray-400 flex items-center gap-1"><MapPin size={10} /> {p.location}</div>
                                </div>
                            </div>
                            <span className={`text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full uppercase ${p.status === 'Active' ? 'text-green-500 bg-green-50 border border-green-200' : 'text-amber-500 bg-amber-50 border border-amber-200'}`}>
                                {p.status}
                            </span>
                        </div>
                        <div className="grid grid-cols-3 gap-3 mb-3">
                            <div className="px-3 py-2 rounded-xl bg-gray-50">
                                <div className="text-[10px] text-gray-400 mb-0.5">Hires</div>
                                <div className="text-sm font-bold text-gray-800">{p.hires}</div>
                            </div>
                            <div className="px-3 py-2 rounded-xl bg-gray-50">
                                <div className="text-[10px] text-gray-400 mb-0.5">Rating</div>
                                <div className="text-sm font-bold text-gray-800 flex items-center gap-1"><Star size={10} className="text-amber-400" /> {p.rating}</div>
                            </div>
                            <div className="px-3 py-2 rounded-xl bg-gray-50">
                                <div className="text-[10px] text-gray-400 mb-0.5">Package</div>
                                <div className="text-xs font-bold text-gray-800">{p.package}</div>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {p.roles.map(r => (
                                <span key={r} className="text-[10px] px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-500 font-semibold border border-indigo-100">{r}</span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
