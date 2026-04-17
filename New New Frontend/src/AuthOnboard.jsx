import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Target, ChevronRight, UploadCloud, Cpu, Network, ArrowRight } from 'lucide-react';
import { GlassCard, CircularGauge, fadeUp } from './components';
import { SKILL_DATA } from './data';

export function AuthView({ setView, setRole }) {
    const [scanning, setScanning] = useState(false);

    const handleLogin = (role) => {
        setScanning(true);
        setTimeout(() => {
            setScanning(false);
            setRole(role);
            setView(role === 'candidate' ? 'onboard_drop' : 'admin');
        }, 1200);
    };

    return (
        <motion.div {...fadeUp} className="flex-1 flex items-center justify-center p-6 relative">
            {/* Biometric scan overlay */}
            {scanning && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-6">
                        <motion.div className="w-24 h-24 border-2 border-[#50FFAB] rounded-full flex items-center justify-center"
                            animate={{ scale: [1, 1.1, 1], borderColor: ["#50FFAB", "#2E5BFF", "#50FFAB"] }}
                            transition={{ duration: 1.2, repeat: Infinity }}>
                            <motion.div className="w-16 h-16 border border-[#50FFAB]/50 rounded-full"
                                animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
                        </motion.div>
                        <div className="font-mono text-[#50FFAB] text-sm tracking-[0.3em] animate-pulse">BIOMETRIC SCAN...</div>
                    </div>
                </motion.div>
            )}

            <div className="w-full max-w-md">
                <div className="flex justify-center mb-8">
                    <motion.div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2E5BFF] to-[#50FFAB] flex items-center justify-center"
                        animate={{ boxShadow: ["0 0 30px rgba(46,91,255,0.3)", "0 0 50px rgba(80,255,171,0.3)", "0 0 30px rgba(46,91,255,0.3)"] }}
                        transition={{ duration: 3, repeat: Infinity }}>
                        <Brain size={30} className="text-white" />
                    </motion.div>
                </div>
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold mb-2 tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">PlacementIQ</h1>
                    <p className="text-white/30 text-xs tracking-[0.3em] uppercase">Intelligent Placement Terminal v2.0</p>
                </div>

                <div className="space-y-4">
                    <button onClick={() => handleLogin('candidate')}
                        className="w-full group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-[#2E5BFF]/50 transition-all text-left flex items-center justify-between">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#2E5BFF]/0 via-[#2E5BFF]/5 to-[#2E5BFF]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="p-3 rounded-xl bg-[#2E5BFF]/10 text-[#2E5BFF]/60 group-hover:text-[#2E5BFF] transition-colors border border-[#2E5BFF]/20"><Target size={22} /></div>
                            <div>
                                <div className="font-semibold text-white text-[15px]">Candidate Identity</div>
                                <div className="text-xs text-white/35 mt-1">Initialize career profiling sequence</div>
                            </div>
                        </div>
                        <ChevronRight size={16} className="text-white/15 group-hover:text-[#2E5BFF] transition-all relative z-10" />
                    </button>

                    <button onClick={() => handleLogin('coordinator')}
                        className="w-full group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-[#50FFAB]/50 transition-all text-left flex items-center justify-between">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#50FFAB]/0 via-[#50FFAB]/5 to-[#50FFAB]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="p-3 rounded-xl bg-[#50FFAB]/10 text-[#50FFAB]/60 group-hover:text-[#50FFAB] transition-colors border border-[#50FFAB]/20"><Network size={22} /></div>
                            <div>
                                <div className="font-semibold text-white text-[15px]">TPC Command</div>
                                <div className="text-xs text-white/35 mt-1">Access batch intelligence analytics</div>
                            </div>
                        </div>
                        <ChevronRight size={16} className="text-white/15 group-hover:text-[#50FFAB] transition-all relative z-10" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

export function OnboardDrop({ setView }) {
    const [reading, setReading] = useState(false);
    const handleDrop = () => { setReading(true); setTimeout(() => setView('onboard_calib'), 2000); };

    return (
        <motion.div {...fadeUp} className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full p-6 text-center">
            <div className="mb-8 space-y-2">
                <h2 className="text-2xl font-bold">Ingest Base Telemetry</h2>
                <p className="text-white/35 text-sm">Upload your resume to seed the agent's memory bank.</p>
            </div>
            <div onClick={handleDrop} className="w-full h-64 border-2 border-dashed border-white/15 rounded-2xl bg-white/[0.02] flex flex-col items-center justify-center cursor-pointer hover:border-[#2E5BFF]/50 hover:bg-[#2E5BFF]/5 transition-all">
                {reading ? (
                    <div className="flex flex-col items-center gap-4">
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}><Cpu size={32} className="text-[#50FFAB]" /></motion.div>
                        <div className="text-[#50FFAB] font-mono text-sm tracking-[0.2em]">EXTRACTING VECTORS...</div>
                    </div>
                ) : (<>
                    <UploadCloud size={40} className="text-white/30 mb-4" />
                    <div className="font-medium">Drop PDF or Click to Browse</div>
                    <div className="text-xs text-white/30 mt-2 font-mono">PyMuPDF Engine Ready</div>
                </>)}
            </div>
        </motion.div>
    );
}

export function OnboardCalibration({ setView }) {
    const [step, setStep] = useState(1);
    return (
        <motion.div {...fadeUp} className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto w-full p-6">
            <div className="w-full flex gap-2 mb-8">
                {[1, 2, 3].map(i => (<div key={i} className={`h-1 flex-1 rounded-full transition-all ${step >= i ? 'bg-[#2E5BFF]' : 'bg-white/10'}`} />))}
            </div>
            <div className="w-full space-y-6">
                <h2 className="text-2xl font-bold">
                    {step === 1 && "Primary Target Domain"}
                    {step === 2 && "Expected Placement Timeline"}
                    {step === 3 && "Current Confidence Level"}
                </h2>
                <div className="grid grid-cols-2 gap-4">
                    {(step === 1 ? ['Software Eng', 'Data Science', 'Product Management', 'Cybersecurity'] :
                        step === 2 ? ['Within 3 Months', '3-6 Months', '6-12 Months', 'Just Exploring'] :
                            ['Ready Now', 'Need Polish', 'Lots of Gaps', 'No Idea']).map(opt => (
                                <button key={opt} onClick={() => step < 3 ? setStep(step + 1) : setView('onboard_dna')}
                                    className="p-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-[#2E5BFF]/10 hover:border-[#2E5BFF]/50 transition-all text-left text-sm font-medium">
                                    {opt}
                                </button>))}
                </div>
            </div>
        </motion.div>
    );
}

export function OnboardDNA({ setView }) {
    return (
        <motion.div {...fadeUp} className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full p-6">
            <div className="text-center mb-8">
                <div className="text-[#50FFAB] font-mono text-xs tracking-[0.3em] mb-2">ANALYSIS COMPLETE</div>
                <h2 className="text-3xl font-bold">Your Career DNA</h2>
            </div>
            <GlassCard className="w-full p-8 flex flex-col md:flex-row gap-8 items-center" glow="#50FFAB">
                <CircularGauge value={64} size={160} label="READINESS" color="#50FFAB" />
                <div className="flex-1 space-y-6 w-full">
                    <div className="space-y-2.5">
                        <div className="flex justify-between text-xs"><span className="text-white/50">Detected Strengths</span><span className="text-[#50FFAB] font-medium">Python, REST APIs</span></div>
                        <div className="flex justify-between text-xs"><span className="text-white/50">Critical Gaps</span><span className="text-[#FF4757] font-medium">System Design, Advanced SQL</span></div>
                        <div className="flex justify-between text-xs"><span className="text-white/50">Target Match</span><span className="text-white font-medium">Amazon SDE-1 (64%)</span></div>
                    </div>
                    <button onClick={() => setView('student')}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#2E5BFF] to-[#2E5BFF]/80 hover:to-[#2E5BFF] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(46,91,255,0.35)]">
                        ENTER CAREER COMPASS <ArrowRight size={16} />
                    </button>
                </div>
            </GlassCard>
        </motion.div>
    );
}
