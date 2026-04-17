import React from 'react';
import { motion } from 'framer-motion';

export const GlassCard = ({ children, className = "", style = {}, glow = null }) => (
    <div className={`glass-card ${className}`}
        style={{
            ...style,
            ...(glow ? { boxShadow: `0 0 30px ${glow}15, inset 0 1px 0 rgba(255,255,255,0.05)` } : { boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)' })
        }}>
        {children}
    </div>
);

export const CircularGauge = ({ value, size = 120, label = "", color = "#50FFAB" }) => {
    const r = (size - 12) / 2;
    const c = Math.PI * 2 * r;
    return (
        <div className="circular-gauge" style={{ width: size, height: size }}>
            <svg className="circular-gauge-svg" viewBox={`0 0 ${size} ${size}`}>
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="8"
                    strokeDasharray={c} strokeDashoffset={c}
                    animate={{ strokeDashoffset: c - (c * value / 100) }}
                    transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
                    strokeLinecap="round"
                />
            </svg>
            <div className="circular-gauge-label">
                <div style={{ fontSize: size > 100 ? '1.5rem' : '1rem', fontWeight: 700, color }}>{value}<span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>%</span></div>
                {label && <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', marginTop: '2px', textTransform: 'uppercase' }}>{label}</div>}
            </div>
        </div>
    );
};

export const StatusPill = ({ status }) => {
    const colors = { applied: "#6366f1", interviewed: "#f59e0b", offered: "#10b981", at_risk: "#ef4444", active: "#6366f1", placed: "#10b981" };
    const c = colors[status] || "#999";
    return (
        <span className="status-pill"
            style={{ color: c, backgroundColor: `${c}15`, border: `1px solid ${c}30` }}>
            {status.replace('_', ' ')}
        </span>
    );
};

export const fadeUp = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -24 },
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }
};
