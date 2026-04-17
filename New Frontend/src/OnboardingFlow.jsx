import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Database, Cpu, Briefcase, ChevronDown, ArrowRight, Check, Sparkles } from 'lucide-react';

const fadeSlide = {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -60 },
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
};

const domainOptions = [
    { id: 'sde', label: 'Software Development', desc: 'Full-stack, backend, mobile apps', icon: Code2, color: '#6366f1', bg: '#eef2ff' },
    { id: 'data', label: 'Data Science / ML', desc: 'Analytics, machine learning, AI', icon: Database, color: '#f59e0b', bg: '#fefce8' },
    { id: 'core', label: 'Core Engineering', desc: 'Electronics, mechanical, embedded', icon: Cpu, color: '#10b981', bg: '#ecfdf5' },
    { id: 'management', label: 'Management / PM', desc: 'Product management, consulting', icon: Briefcase, color: '#ec4899', bg: '#fdf2f8' },
];

const timeOptions = [
    'Less than 1 month',
    '1 – 3 months',
    '3 – 6 months',
    '6 – 12 months',
    'More than 12 months',
];

export default function OnboardingFlow({ onComplete }) {
    const [step, setStep] = useState(0);
    const [domain, setDomain] = useState(null);
    const [timeframe, setTimeframe] = useState('');
    const [confidence, setConfidence] = useState(50);
    const [dropOpen, setDropOpen] = useState(false);

    const confidenceLabel = confidence < 33 ? 'Low' : confidence < 66 ? 'Medium' : 'High';
    const confidenceColor = confidence < 33 ? '#ef4444' : confidence < 66 ? '#f59e0b' : '#10b981';

    const next = () => {
        if (step < 2) setStep(step + 1);
        else onComplete({ domain, timeframe, confidence: confidenceLabel });
    };

    const canProceed = step === 0 ? !!domain : step === 1 ? !!timeframe : true;

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #fbc2eb 100%)' }}>

            {/* Background Blobs */}
            <motion.div animate={{ x: [0, 40, -30, 0], y: [0, -30, 40, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-20"
                style={{ background: 'radial-gradient(circle, #818cf8, transparent 65%)' }} />

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-[520px] mx-4"
            >
                <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
                    {/* Progress Bar */}
                    <div className="px-8 pt-6">
                        <div className="flex items-center gap-3 mb-2">
                            {[0, 1, 2].map(i => (
                                <div key={i} className="flex-1 h-1.5 rounded-full overflow-hidden bg-gray-100">
                                    <motion.div
                                        initial={{ width: '0%' }}
                                        animate={{ width: step >= i ? '100%' : '0%' }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                        className="h-full rounded-full"
                                        style={{ background: 'linear-gradient(to right, #6366f1, #8b5cf6)' }}
                                    />
                                </div>
                            ))}
                        </div>
                        <p className="text-[11px] text-gray-400 font-medium">Step {step + 1} of 3</p>
                    </div>

                    {/* Content */}
                    <div className="px-8 py-6 min-h-[380px] flex flex-col">
                        <AnimatePresence mode="wait">
                            {/* ── Step 1: Domain Targeting ── */}
                            {step === 0 && (
                                <motion.div key="step0" {...fadeSlide} className="flex-1 flex flex-col">
                                    <div className="mb-6">
                                        <h2 className="text-xl font-bold text-gray-900 mb-1">Which domain are you targeting?</h2>
                                        <p className="text-sm text-gray-400">Select your primary career focus area</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 flex-1">
                                        {domainOptions.map(opt => (
                                            <motion.button
                                                key={opt.id}
                                                whileHover={{ scale: 1.02, y: -2 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setDomain(opt.id)}
                                                className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-300 flex flex-col gap-3
                                                    ${domain === opt.id
                                                        ? 'border-indigo-400 shadow-lg shadow-indigo-500/10'
                                                        : 'border-gray-100 hover:border-gray-200'}`}
                                                style={domain === opt.id ? { backgroundColor: opt.bg } : {}}
                                            >
                                                {domain === opt.id && (
                                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                                                        className="absolute top-3 right-3 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                                                        <Check size={12} className="text-white" />
                                                    </motion.div>
                                                )}
                                                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                                                    style={{ backgroundColor: `${opt.color}15`, color: opt.color }}>
                                                    <opt.icon size={20} />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-gray-800">{opt.label}</div>
                                                    <div className="text-[11px] text-gray-400 mt-0.5">{opt.desc}</div>
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* ── Step 2: Time Before Placements ── */}
                            {step === 1 && (
                                <motion.div key="step1" {...fadeSlide} className="flex-1 flex flex-col">
                                    <div className="mb-6">
                                        <h2 className="text-xl font-bold text-gray-900 mb-1">How much time do you have?</h2>
                                        <p className="text-sm text-gray-400">Before your placement season begins</p>
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center">
                                        {/* Custom Dropdown */}
                                        <div className="relative">
                                            <button onClick={() => setDropOpen(!dropOpen)}
                                                className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 text-left transition-all
                                                    ${dropOpen ? 'border-indigo-400 shadow-lg shadow-indigo-500/10' : 'border-gray-200 hover:border-gray-300'}
                                                    ${timeframe ? 'bg-indigo-50/50' : 'bg-white'}`}>
                                                <span className={`text-sm font-medium ${timeframe ? 'text-gray-800' : 'text-gray-300'}`}>
                                                    {timeframe || 'Select a timeframe...'}
                                                </span>
                                                <motion.div animate={{ rotate: dropOpen ? 180 : 0 }}>
                                                    <ChevronDown size={18} className="text-gray-400" />
                                                </motion.div>
                                            </button>
                                            <AnimatePresence>
                                                {dropOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden z-20"
                                                    >
                                                        {timeOptions.map((opt, i) => (
                                                            <button key={i}
                                                                onClick={() => { setTimeframe(opt); setDropOpen(false); }}
                                                                className={`w-full px-5 py-3.5 text-left text-sm font-medium transition-all
                                                                    ${timeframe === opt
                                                                        ? 'bg-indigo-50 text-indigo-600'
                                                                        : 'text-gray-600 hover:bg-gray-50'}
                                                                    ${i < timeOptions.length - 1 ? 'border-b border-gray-50' : ''}`}>
                                                                <div className="flex items-center justify-between">
                                                                    {opt}
                                                                    {timeframe === opt && <Check size={14} className="text-indigo-500" />}
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* ── Step 3: Confidence Slider ── */}
                            {step === 2 && (
                                <motion.div key="step2" {...fadeSlide} className="flex-1 flex flex-col">
                                    <div className="mb-8">
                                        <h2 className="text-xl font-bold text-gray-900 mb-1">Rate your confidence</h2>
                                        <p className="text-sm text-gray-400">How prepared do you feel for placements?</p>
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center gap-8">
                                        {/* Confidence Display */}
                                        <div className="text-center">
                                            <motion.div
                                                key={confidenceLabel}
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-lg font-bold mb-2"
                                                style={{ backgroundColor: `${confidenceColor}12`, color: confidenceColor, border: `2px solid ${confidenceColor}20` }}
                                            >
                                                <Sparkles size={18} />
                                                {confidenceLabel}
                                            </motion.div>
                                            <div className="text-3xl font-black text-gray-900">{confidence}%</div>
                                        </div>

                                        {/* Slider */}
                                        <div className="px-2">
                                            <input
                                                type="range"
                                                min="0" max="100"
                                                value={confidence}
                                                onChange={e => setConfidence(Number(e.target.value))}
                                                className="w-full"
                                                style={{
                                                    background: `linear-gradient(to right, ${confidenceColor} ${confidence}%, #e2e8f0 ${confidence}%)`
                                                }}
                                            />
                                            <div className="flex justify-between mt-2">
                                                <span className="text-xs font-semibold text-red-400">Low</span>
                                                <span className="text-xs font-semibold text-yellow-500">Medium</span>
                                                <span className="text-xs font-semibold text-green-500">High</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Navigation Footer */}
                    <div className="px-8 pb-6">
                        <div className="flex gap-3">
                            {step > 0 && (
                                <button onClick={() => setStep(step - 1)}
                                    className="px-6 py-3 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-all">
                                    Back
                                </button>
                            )}
                            <button onClick={next} disabled={!canProceed}
                                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                                {step === 2 ? 'Complete Setup' : 'Continue'}
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
