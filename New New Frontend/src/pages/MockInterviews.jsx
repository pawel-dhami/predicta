import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, MessageSquare, Send, Terminal, Play, Mic, MicOff, Clock, Star } from 'lucide-react';

const SCENARIOS = [
    { id: 1, title: 'System Design: URL Shortener', company: 'Google', level: 'L4', duration: '45 min', difficulty: 'Hard', color: '#4285f4' },
    { id: 2, title: 'DSA: Binary Trees', company: 'Amazon', level: 'SDE-1', duration: '30 min', difficulty: 'Medium', color: '#f97316' },
    { id: 3, title: 'Behavioral Round', company: 'Microsoft', level: 'SDE', duration: '30 min', difficulty: 'Medium', color: '#00a4ef' },
    { id: 4, title: 'ML System Design', company: 'NVIDIA', level: 'ML Eng', duration: '45 min', difficulty: 'Hard', color: '#76b900' },
];

const AI_RESPONSES = [
    "Good start. How would you handle hash collisions at that scale? Consider consistent hashing.",
    "That's an interesting approach. What about database partitioning? How would you shard the data?",
    "Excellent point about caching. Let's dive deeper—how would you handle cache invalidation?",
    "Good thinking. Now, what monitoring and alerting would you put in place?",
];

export default function MockInterviews() {
    const [activeSession, setActiveSession] = useState(null);
    const [msgs, setMsgs] = useState([]);
    const [input, setInput] = useState('');
    const chatRef = useRef(null);
    const [aiIdx, setAiIdx] = useState(0);

    useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [msgs]);

    const startSession = (scenario) => {
        setActiveSession(scenario);
        setMsgs([{ role: 'ai', text: `Welcome to your ${scenario.title} mock interview. I'm simulating a ${scenario.company} ${scenario.level} round. You have ${scenario.duration}. Let's begin — please describe your high-level approach.` }]);
        setAiIdx(0);
    };

    const send = () => {
        if (!input.trim()) return;
        setMsgs(p => [...p, { role: 'user', text: input }]);
        setInput('');
        const idx = aiIdx;
        setTimeout(() => {
            setMsgs(p => [...p, { role: 'ai', text: AI_RESPONSES[idx % AI_RESPONSES.length] }]);
            setAiIdx(prev => prev + 1);
        }, 1000);
    };

    if (activeSession) {
        return (
            <div className="px-6 py-5 flex flex-col h-full">
                <div className="text-[11px] text-gray-400 flex items-center gap-1.5 mb-3">
                    Homepage <ChevronRight size={10} /> Career Guidance <ChevronRight size={10} /> Mock Interviews <ChevronRight size={10} />
                    <span className="text-gray-700 font-semibold">{activeSession.title}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-lg font-bold text-gray-900">{activeSession.title}</h1>
                        <p className="text-xs text-gray-400">{activeSession.company} · {activeSession.level} · {activeSession.duration}</p>
                    </div>
                    <button onClick={() => setActiveSession(null)}
                        className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-500 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all">
                        End Session
                    </button>
                </div>

                {/* Chat */}
                <div className="flex-1 rounded-2xl border border-gray-200 bg-gray-50 overflow-hidden flex flex-col min-h-0">
                    <div className="px-4 py-3 bg-white border-b border-gray-100 flex items-center gap-2">
                        <Terminal size={14} className="text-indigo-500" />
                        <span className="text-xs font-bold text-indigo-500 tracking-wider">LIVE SESSION</span>
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse ml-1" />
                    </div>
                    <div ref={chatRef} className="flex-1 overflow-y-auto p-5 space-y-3">
                        {msgs.map((m, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm ${m.role === 'user'
                                    ? 'bg-indigo-500 text-white rounded-br-md'
                                    : 'bg-white border border-gray-200 text-gray-700 rounded-bl-md'}`}>
                                    {m.text}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="p-3 bg-white border-t border-gray-100 flex gap-3">
                        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                            placeholder="Type your response..." />
                        <button onClick={send} className="px-5 rounded-xl bg-indigo-500 text-white flex items-center justify-center hover:bg-indigo-600 transition-colors shadow-md shadow-indigo-500/20">
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="px-6 py-5 overflow-y-auto h-full">
            <div className="text-[11px] text-gray-400 flex items-center gap-1.5 mb-4">
                Homepage <ChevronRight size={10} /> Career Guidance <ChevronRight size={10} /> <span className="text-gray-700 font-semibold">Mock Interviews</span>
            </div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Mock Interviews</h1>
                <p className="text-sm text-gray-400 mt-1">Practice with AI-powered interview simulations</p>
            </motion.div>

            {/* Scenario Cards */}
            <div className="grid grid-cols-2 gap-4">
                {SCENARIOS.map((s, i) => (
                    <motion.div key={s.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}
                        className="rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-lg hover:shadow-gray-100 transition-all group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-xs"
                                style={{ backgroundColor: s.color }}>{s.company[0]}</div>
                            <span className={`text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full uppercase ${s.difficulty === 'Hard' ? 'text-red-500 bg-red-50 border border-red-200' : 'text-amber-500 bg-amber-50 border border-amber-200'}`}>
                                {s.difficulty}
                            </span>
                        </div>
                        <h3 className="text-base font-bold text-gray-800 mb-1">{s.title}</h3>
                        <p className="text-xs text-gray-400 mb-4">{s.company} · {s.level}</p>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                <Clock size={12} /> {s.duration}
                            </div>
                            <button onClick={() => startSession(s)}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 text-white text-xs font-bold hover:bg-indigo-600 transition-colors shadow-md shadow-indigo-500/20">
                                <Play size={12} /> Start
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
