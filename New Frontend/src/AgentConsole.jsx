import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, X } from 'lucide-react';
import { REACT_STEPS } from './data';

export default function AgentConsoleOverlay({ onClose }) {
    const [step, setStep] = useState(-1);
    const [running, setRunning] = useState(false);

    const run = () => {
        setRunning(true); setStep(0);
        const iv = setInterval(() => {
            setStep(p => { if (p >= 3) { clearInterval(iv); setRunning(false); return p; } return p + 1; });
        }, 1200);
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex justify-end"
            onClick={e => e.target === e.currentTarget && onClose()}>
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-[500px] h-full bg-[#080808]/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl flex flex-col font-mono">
                <div className="p-5 border-b border-white/10 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#50FFAB] tracking-[0.2em]">
                        <Terminal size={14} /> AGENT_LOOP_DEBUGGER
                    </div>
                    <div className="flex gap-2">
                        <button onClick={run} disabled={running}
                            className="px-4 py-1.5 bg-[#50FFAB]/10 text-[#50FFAB] border border-[#50FFAB]/30 rounded-lg text-[10px] uppercase font-bold hover:bg-[#50FFAB]/20 transition-colors disabled:opacity-40 tracking-widest">
                            {running ? 'Executing...' : 'Run Cycle'}
                        </button>
                        <button onClick={onClose} className="p-1.5 text-white/30 hover:text-white transition-colors"><X size={16} /></button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="text-[10px] text-white/20 uppercase tracking-[0.2em] border-b border-white/[0.06] pb-3">
                        Memory Context: 1536-dim vectors loaded
                    </div>
                    {REACT_STEPS.map((s, i) => {
                        const visible = step >= i;
                        if (!visible && step !== -1) return null;
                        return (
                            <motion.div key={s.phase} initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: visible ? 1 : 0.25, y: 0 }}
                                className="border-l-2 pl-4 py-1" style={{ borderColor: visible ? s.color : 'rgba(255,255,255,0.1)' }}>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded text-black tracking-[0.15em]" style={{ backgroundColor: s.color }}>{s.phase}</span>
                                    {visible && step === i && running && <span className="text-[10px] animate-pulse" style={{ color: s.color }}>Processing...</span>}
                                    {visible && (step > i || !running) && <span className="text-[10px] opacity-60" style={{ color: s.color }}>ok_</span>}
                                </div>
                                <pre className="text-xs text-white/60 whitespace-pre-wrap leading-relaxed">{s.code}</pre>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>
        </motion.div>
    );
}
