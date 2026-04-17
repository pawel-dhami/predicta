import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Cpu, MessageSquare, Play, Send, Terminal, Zap, BookOpen, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { GlassCard, CircularGauge, StatusPill, fadeUp } from './components';
import { SKILL_DATA, ROADMAP, COMPANY_RECS, APPLICATION_TRACKER, statusColors } from './data';

function SkillDNA() {
    return (
        <GlassCard className="p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-5 text-[10px] font-bold text-white/40 uppercase tracking-[0.15em]">
                <Cpu size={14} className="text-[#50FFAB]" /> Skill DNA Analysis
            </div>
            <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={SKILL_DATA} margin={{ top: 5, right: 25, bottom: 5, left: 25 }}>
                        <PolarGrid stroke="rgba(255,255,255,0.06)" />
                        <PolarAngleAxis dataKey="skill" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} />
                        <Radar name="You" dataKey="you" stroke="#2E5BFF" fill="#2E5BFF" fillOpacity={0.2} strokeWidth={2} />
                        <Radar name="Target" dataKey="target" stroke="#50FFAB" fill="transparent" strokeWidth={1.5} strokeDasharray="4 4" />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-3 space-y-2.5">
                {SKILL_DATA.map(sk => {
                    const gap = sk.target - sk.you;
                    return (
                        <div key={sk.skill}>
                            <div className="flex justify-between text-[10px] mb-1">
                                <span className="text-white/50">{sk.skill}</span>
                                <span className={gap > 0 ? 'text-[#FFB830]' : 'text-[#50FFAB]'}>{sk.you}/{sk.target}</span>
                            </div>
                            <div className="h-1 bg-white/[0.06] rounded-full relative">
                                <motion.div className="absolute top-0 left-0 h-full rounded-full" initial={{ width: 0 }}
                                    animate={{ width: `${sk.you}%` }} transition={{ duration: 1 }}
                                    style={{ backgroundColor: gap > 0 ? '#FFB830' : '#50FFAB' }} />
                                <div className="absolute top-0 bottom-0 border-r border-dashed border-[#50FFAB]/50" style={{ left: `${sk.target}%` }} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </GlassCard>
    );
}

function AgenticRoadmap({ onStartMock }) {
    return (
        <GlassCard className="p-6 flex flex-col">
            <div className="flex justify-between items-center mb-5">
                <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-[0.15em]">
                    <Target size={14} className="text-[#2E5BFF]" /> Agentic Roadmap
                </div>
                <div className="flex items-center gap-1.5 text-[9px] text-[#50FFAB] border border-[#50FFAB]/30 bg-[#50FFAB]/10 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#50FFAB] animate-pulse" /> AI-GENERATED
                </div>
            </div>
            <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                {ROADMAP.map(t => (
                    <div key={t.id} className={`p-4 rounded-xl border transition-all ${t.status === 'today' ? 'bg-[#2E5BFF]/[0.08] border-[#2E5BFF]/40 shadow-[0_0_20px_rgba(46,91,255,0.1)]' : 'bg-white/[0.02] border-white/[0.06]'}`}>
                        <div className="flex justify-between items-start mb-1.5">
                            <div className={`text-sm font-semibold ${t.status === 'done' ? 'text-white/30 line-through' : 'text-white'}`}>{t.title}</div>
                            <div className={`text-[10px] px-2 py-0.5 rounded font-bold shrink-0 ml-2 ${t.status === 'today' ? 'bg-[#2E5BFF] text-white' : t.status === 'done' ? 'text-[#50FFAB]' : 'text-white/25'}`}>{t.due}</div>
                        </div>
                        <div className="text-xs text-white/40">{t.desc}</div>
                        {t.status === 'today' && (
                            <button onClick={onStartMock} className="mt-3 flex items-center gap-2 text-[10px] font-bold text-[#2E5BFF] bg-[#2E5BFF]/10 px-3 py-1.5 rounded-lg hover:bg-[#2E5BFF]/20 transition-colors">
                                <Play size={12} /> INITIATE SESSION
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </GlassCard>
    );
}

function CompanyMapping() {
    return (
        <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-5 text-[10px] font-bold text-white/40 uppercase tracking-[0.15em]">
                <Target size={14} className="text-[#FFB830]" /> Skill-to-Company Mapping
            </div>
            <div className="space-y-3">
                {COMPANY_RECS.map(c => (
                    <div key={c.name} className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-center gap-4">
                        <CircularGauge value={c.match} size={52} label="" color={c.match > 70 ? "#50FFAB" : c.match > 55 ? "#FFB830" : "#FF4757"} />
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-2">
                                <div className="font-semibold text-sm">{c.name} <span className="text-white/30 text-xs font-normal">· {c.role}</span></div>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {Object.entries(c.skills).map(([skill, match]) => (
                                    <span key={skill} className={`text-[9px] px-2 py-0.5 rounded-full border ${match ? 'border-[#50FFAB]/30 text-[#50FFAB] bg-[#50FFAB]/10' : 'border-[#FF4757]/30 text-[#FF4757] bg-[#FF4757]/10'}`}>
                                        {match ? <CheckCircle size={8} className="inline mr-1" /> : <XCircle size={8} className="inline mr-1" />}{skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </GlassCard>
    );
}

function ApplicationTracker() {
    return (
        <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-5 text-[10px] font-bold text-white/40 uppercase tracking-[0.15em]">
                <Zap size={14} className="text-[#2E5BFF]" /> Application Tracker
            </div>
            <div className="space-y-2">
                {APPLICATION_TRACKER.map((a, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                        <div>
                            <div className="text-sm font-medium">{a.company} <span className="text-white/30 text-xs">· {a.role}</span></div>
                            <div className="text-[10px] text-white/25 mt-0.5">{a.date}</div>
                        </div>
                        <StatusPill status={a.status} />
                    </div>
                ))}
            </div>
        </GlassCard>
    );
}

function NextActionEngine({ onStartMock }) {
    return (
        <GlassCard className="p-5" glow="#2E5BFF">
            <div className="flex items-center gap-2 mb-4 text-[10px] font-bold text-white/40 uppercase tracking-[0.15em]">
                <Zap size={14} className="text-[#50FFAB]" /> Next Action Engine
            </div>
            <div className="space-y-2.5">
                {[
                    { action: "Apply to Flipkart SDE-1", desc: "78% match · deadline in 3 days", icon: <ArrowRight size={14} />, color: "#50FFAB" },
                    { action: "Upskill: System Design", desc: "Recommended: Grokking course", icon: <BookOpen size={14} />, color: "#FFB830" },
                    { action: "Start Mock Interview", desc: "Today 6PM · Google L4 sim", icon: <MessageSquare size={14} />, color: "#2E5BFF", onClick: onStartMock },
                ].map((a, i) => (
                    <button key={i} onClick={a.onClick} className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] transition-all text-left group">
                        <div className="p-2 rounded-lg shrink-0" style={{ backgroundColor: `${a.color}15`, color: a.color }}>{a.icon}</div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium group-hover:text-white transition-colors">{a.action}</div>
                            <div className="text-[10px] text-white/30">{a.desc}</div>
                        </div>
                        <ArrowRight size={14} className="text-white/15 group-hover:text-white/40 transition-colors shrink-0" />
                    </button>
                ))}
            </div>
        </GlassCard>
    );
}

function MockInterview() {
    const [msgs, setMsgs] = useState([{ role: 'ai', text: "Welcome to your System Design mock. I'm simulating a Google L4 round. Design a URL shortening service like bit.ly. Scale: 100M URLs/day. Begin." }]);
    const [input, setInput] = useState('');
    const chatRef = useRef(null);
    useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [msgs]);

    const send = () => {
        if (!input.trim()) return;
        setMsgs(p => [...p, { role: 'user', text: input }]);
        setInput('');
        setTimeout(() => { setMsgs(p => [...p, { role: 'ai', text: "Good start. How would you handle hash collisions at that scale? And where does caching fit?" }]); }, 1000);
    };

    return (
        <GlassCard className="w-full flex flex-col h-full overflow-hidden" glow="#50FFAB">
            <div className="p-4 border-b border-white/10 bg-black/40 flex items-center gap-3 shrink-0">
                <Terminal size={16} className="text-[#50FFAB]" />
                <span className="text-xs font-mono text-[#50FFAB] tracking-[0.2em]">SESSION_ACTIVE :: SYS_DESIGN</span>
            </div>
            <div ref={chatRef} className="flex-1 overflow-y-auto p-6 space-y-4 font-mono text-sm">
                {msgs.map((m, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-4 rounded-2xl ${m.role === 'user' ? 'bg-[#2E5BFF]/15 text-white border border-[#2E5BFF]/30' : 'bg-white/[0.04] text-white/75 border border-white/[0.08]'}`}>
                            {m.text}
                        </div>
                    </motion.div>
                ))}
            </div>
            <div className="p-4 bg-black/40 border-t border-white/10 shrink-0 flex gap-3">
                <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
                    className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-[#2E5BFF]/50 transition-colors" placeholder="> Input response..." />
                <button onClick={send} className="px-6 rounded-xl bg-[#2E5BFF] text-white flex items-center justify-center hover:bg-[#2E5BFF]/80 transition-colors shadow-[0_0_15px_rgba(46,91,255,0.3)]">
                    <Send size={16} />
                </button>
            </div>
        </GlassCard>
    );
}

export default function StudentDashboard() {
    const [tab, setTab] = useState('compass');

    return (
        <motion.div {...fadeUp} className="flex-1 flex flex-col p-6 overflow-hidden max-w-7xl mx-auto w-full gap-5">
            {/* Header */}
            <GlassCard className="p-5 shrink-0 flex items-center justify-between" glow="#2E5BFF">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-[#2E5BFF]/15 border border-[#2E5BFF]/40 flex items-center justify-center text-2xl font-bold text-[#2E5BFF]">A</div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Arjun Sharma</h2>
                        <div className="text-xs text-white/40 mt-1">CSE B.Tech · Target: Amazon SDE-1</div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-[10px] text-white/30 tracking-[0.15em] mb-1">SELECTION PROBABILITY</div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-[#2E5BFF] to-[#50FFAB] bg-clip-text text-transparent">64%</div>
                </div>
            </GlassCard>

            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-white/[0.04] rounded-xl border border-white/[0.08] w-max shrink-0">
                {[{ id: 'compass', label: 'Career Compass', icon: <Target size={14} /> }, { id: 'mock', label: 'Mock Interview', icon: <MessageSquare size={14} /> }].map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)}
                        className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${tab === t.id ? 'bg-[#2E5BFF]/20 text-[#2E5BFF]' : 'text-white/35 hover:text-white/70'}`}>
                        {t.icon} {t.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden min-h-0">
                <AnimatePresence mode="wait">
                    {tab === 'compass' ? (
                        <motion.div key="compass" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="w-full h-full overflow-y-auto pb-6 pr-1 grid grid-cols-1 lg:grid-cols-2 gap-5 auto-rows-max">
                            <SkillDNA />
                            <AgenticRoadmap onStartMock={() => setTab('mock')} />
                            <CompanyMapping />
                            <div className="space-y-5">
                                <ApplicationTracker />
                                <NextActionEngine onStartMock={() => setTab('mock')} />
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div key="mock" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                            <MockInterview />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
