import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Sparkles, Briefcase, MapPin, Clock, Star, PlusCircle, ExternalLink } from 'lucide-react';

const OPPORTUNITIES = [
    { company: 'Meta', role: 'Frontend Engineer', package: '35-55 LPA', location: 'Hyderabad', deadline: 'Apr 15, 2026', type: 'Full-time', skills: ['React', 'JavaScript', 'System Design'], isNew: true },
    { company: 'Tesla', role: 'Embedded Systems Eng', package: '28-45 LPA', location: 'Pune', deadline: 'Apr 18, 2026', type: 'Full-time', skills: ['C++', 'RTOS', 'PCB Design'], isNew: true },
    { company: 'Uber', role: 'Backend Engineer', package: '22-38 LPA', location: 'Bangalore', deadline: 'Apr 20, 2026', type: 'Full-time', skills: ['Go', 'Microservices', 'Kafka'], isNew: false },
    { company: 'Stripe', role: 'Software Engineer', package: '30-50 LPA', location: 'Remote', deadline: 'Apr 22, 2026', type: 'Full-time', skills: ['Python', 'APIs', 'Payments'], isNew: true },
    { company: 'Razorpay', role: 'SDE-1', package: '16-24 LPA', location: 'Bangalore', deadline: 'Apr 25, 2026', type: 'Full-time', skills: ['Java', 'Spring Boot', 'MySQL'], isNew: false },
    { company: 'Coinbase', role: 'Blockchain Dev', package: '40-60 LPA', location: 'Remote', deadline: 'Apr 30, 2026', type: 'Contract', skills: ['Solidity', 'Rust', 'DeFi'], isNew: true },
];

const companyColors = {
    Meta: '#0668E1', Tesla: '#cc0000', Uber: '#000000', Stripe: '#635bff', Razorpay: '#072654', Coinbase: '#0052ff'
};

export default function NewOpportunities() {
    return (
        <div className="px-6 py-5 overflow-y-auto h-full">
            <div className="text-[11px] text-gray-400 flex items-center gap-1.5 mb-4">
                Homepage <ChevronRight size={10} /> Company Relations <ChevronRight size={10} /> <span className="text-gray-700 font-semibold">New Opportunities</span>
            </div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">New Opportunities</h1>
                    <p className="text-sm text-gray-400 mt-1">Fresh openings from recruitment partners</p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-xl transition-all">
                    <PlusCircle size={16} /> Add Opportunity
                </button>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
                {OPPORTUNITIES.map((opp, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}
                        className="rounded-2xl border border-gray-200 bg-white p-5 hover:shadow-lg hover:shadow-gray-100 transition-all group cursor-pointer relative overflow-hidden"
                    >
                        {opp.isNew && (
                            <div className="absolute top-4 right-4">
                                <span className="text-[9px] font-bold tracking-wider px-2 py-1 rounded-full bg-green-50 text-green-500 border border-green-200 uppercase flex items-center gap-1">
                                    <Sparkles size={8} /> New
                                </span>
                            </div>
                        )}

                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-lg"
                                style={{ backgroundColor: companyColors[opp.company] || '#6366f1' }}>
                                {opp.company[0]}
                            </div>
                            <div>
                                <div className="text-base font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">{opp.company}</div>
                                <div className="text-sm text-gray-500">{opp.role}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-4">
                            <div className="px-3 py-2 rounded-xl bg-gray-50">
                                <div className="text-[10px] text-gray-400 mb-0.5 flex items-center gap-1"><Briefcase size={8} /> Package</div>
                                <div className="text-xs font-bold text-gray-800">{opp.package}</div>
                            </div>
                            <div className="px-3 py-2 rounded-xl bg-gray-50">
                                <div className="text-[10px] text-gray-400 mb-0.5 flex items-center gap-1"><MapPin size={8} /> Location</div>
                                <div className="text-xs font-bold text-gray-800">{opp.location}</div>
                            </div>
                            <div className="px-3 py-2 rounded-xl bg-gray-50">
                                <div className="text-[10px] text-gray-400 mb-0.5 flex items-center gap-1"><Clock size={8} /> Deadline</div>
                                <div className="text-xs font-bold text-gray-800">{opp.deadline.split(',')[0]}</div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-4">
                            {opp.skills.map(sk => (
                                <span key={sk} className="text-[10px] px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-500 font-semibold border border-indigo-100">{sk}</span>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <button className="flex-1 py-2 rounded-xl bg-indigo-500 text-white text-xs font-bold hover:bg-indigo-600 transition-colors text-center">
                                Notify Students
                            </button>
                            <button className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-all flex items-center gap-1">
                                Details <ExternalLink size={10} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
