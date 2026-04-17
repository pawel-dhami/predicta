import React from 'react';
import { motion } from 'framer-motion';

export const GlassCard = ({ children, className = "", style = {}, glow = null }) => (
    <div className={`rounded-2xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-2xl ${className}`}
        style={{ ...style, ...(glow ? { boxShadow: `0 0 30px ${glow}15, inset 0 1px 0 rgba(255,255,255,0.05)` } : { boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)' }) }}>
        {children}
    </div>
);

export const CircularGauge = ({ value, size = 120, label = "", color = "#50FFAB" }) => {
    const r = (size - 12) / 2;
    const c = Math.PI * 2 * r;
    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg className="absolute inset-0 -rotate-90" viewBox={`0 0 ${size} ${size}`}>
                <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="8"
                    strokeDasharray={c} strokeDashoffset={c}
                    animate={{ strokeDashoffset: c - (c * value / 100) }}
                    transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
                    strokeLinecap="round"
                />
            </svg>
            <div className="text-center z-10">
                <div className="text-2xl font-bold" style={{ color }}>{value}<span className="text-xs text-white/40">%</span></div>
                {label && <div className="text-[9px] text-white/40 tracking-widest mt-0.5 uppercase">{label}</div>}
            </div>
        </div>
    );
};

export const FunnelBar = ({ steps }) => (
    <div className="flex items-center gap-1 w-full">
        {steps.map((s, i) => (
            <React.Fragment key={i}>
                <div className="flex-1 flex flex-col items-center gap-1.5">
                    <div className="w-full h-8 rounded-lg flex items-center justify-center text-xs font-bold relative overflow-hidden"
                        style={{ backgroundColor: `${s.color}15`, border: `1px solid ${s.color}30` }}>
                        <span style={{ color: s.color }}>{s.count}</span>
                    </div>
                    <span className="text-[9px] text-white/40 tracking-wider text-center leading-tight">{s.label}</span>
                </div>
                {i < steps.length - 1 && (
                    <div className="text-white/20 text-xs shrink-0 mt-[-14px]">→</div>
                )}
            </React.Fragment>
        ))}
    </div>
);

export const StatusPill = ({ status }) => {
    const colors = { applied: "#2E5BFF", interviewed: "#FFB830", offered: "#50FFAB", at_risk: "#FF4757", active: "#2E5BFF", placed: "#50FFAB" };
    const c = colors[status] || "#999";
    return (
        <span className="text-[9px] font-bold tracking-widest px-2.5 py-1 rounded-full uppercase"
            style={{ color: c, backgroundColor: `${c}15`, border: `1px solid ${c}30` }}>
            {status.replace('_', ' ')}
        </span>
    );
};

export const GridOverlay = () => (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
);

export const fadeUp = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -24 },
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }
};
