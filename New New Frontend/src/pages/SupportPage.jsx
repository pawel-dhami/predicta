import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, HelpCircle, MessageCircle, Book, Video, Mail, Search, ChevronDown, ExternalLink } from 'lucide-react';

const FAQS = [
    { q: 'How do I update my placement profile?', a: 'Navigate to Settings > Profile Information. You can update your name, email, and other details. Your placement profile is automatically synced.' },
    { q: 'How does the AI risk assessment work?', a: 'Our AI analyzes multiple factors including application count, skill completion, activity frequency, and interview performance to generate a risk score between 0-100.' },
    { q: 'Can I export student data?', a: 'Yes! Use the Download button in the top header or go to any student list page and click the Export button to download data as CSV.' },
    { q: 'How do mock interviews work?', a: 'Our AI simulates real interview scenarios from top companies. Select a scenario, start the session, and interact with the AI interviewer in real-time.' },
    { q: 'What formats does the resume review support?', a: 'We support PDF, DOC, and DOCX formats. Maximum file size is 5MB. Our AI will analyze content, formatting, and keyword optimization.' },
];

export default function SupportPage() {
    const [openFaq, setOpenFaq] = useState(null);
    const [search, setSearch] = useState('');
    
    const filteredFaqs = FAQS.filter(f => 
        f.q.toLowerCase().includes(search.toLowerCase()) || 
        f.a.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="px-6 py-5 overflow-y-auto h-full">
            <div className="text-[11px] text-gray-400 flex items-center gap-1.5 mb-4">
                Homepage <ChevronRight size={10} /> <span className="text-gray-700 font-semibold">Help & Support</span>
            </div>

            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold text-gray-900 mb-2">
                Help & Support
            </motion.h1>
            <p className="text-sm text-gray-400 mb-6">Find answers or get in touch with our team</p>

            {/* Quick Actions */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-3 gap-4 mb-8">
                {[
                    { icon: Book, label: 'Documentation', desc: 'Browse guides & tutorials', color: '#6366f1' },
                    { icon: MessageCircle, label: 'Live Chat', desc: 'Chat with support team', color: '#10b981' },
                    { icon: Mail, label: 'Email Support', desc: 'support@placementiq.com', color: '#f59e0b' },
                ].map((a, i) => (
                    <motion.button key={i} whileHover={{ y: -2 }}
                        className="p-5 rounded-2xl border border-gray-200 bg-white hover:shadow-lg hover:shadow-gray-100 transition-all text-left group">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${a.color}12`, color: a.color }}>
                            <a.icon size={20} />
                        </div>
                        <div className="text-sm font-bold text-gray-800 group-hover:text-indigo-600 transition-colors flex items-center gap-1">
                            {a.label} <ExternalLink size={10} className="text-gray-300" />
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">{a.desc}</div>
                    </motion.button>
                ))}
            </motion.div>

            {/* Search */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-6">
                <div className="relative max-w-lg">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search FAQs..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all" />
                </div>
            </motion.div>

            {/* FAQs */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <HelpCircle size={16} className="text-indigo-500" /> Frequently Asked Questions
                </h3>
                <div className="space-y-2">
                    {filteredFaqs.map((faq, i) => (
                        <div key={i} className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
                            <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-all">
                                <span className="text-sm font-semibold text-gray-700">{faq.q}</span>
                                <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }}>
                                    <ChevronDown size={16} className="text-gray-400" />
                                </motion.div>
                            </button>
                            {openFaq === i && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                                    className="px-5 pb-4">
                                    <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                                </motion.div>
                            )}
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
