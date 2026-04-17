import { useState } from 'react';
import { APPLICATION_STAGE_COLORS } from '../data/mockStudents';

const STAGE_COLORS_LIGHT = {
  APPLIED: '#d97706',
  OA: '#0891b2',
  INTERVIEW: '#7c3aed',
  OFFER: '#059669',
  REJECTED: '#dc2626',
};

export default function Timeline({ items }) {
  const [open, setOpen] = useState(null);
  const stages = ['APPLIED', 'OA', 'INTERVIEW', 'OFFER'];

  return (
    <div style={{ display: 'grid', gap: 0 }}>
      {items.map((it, idx) => {
        const color = STAGE_COLORS_LIGHT[it.stage] || '#0891b2';
        const stageIdx = stages.indexOf(it.stage);
        const isOpen = open === idx;

        return (
          <div key={idx} style={{ position: 'relative', paddingLeft: 28 }}>
            {idx < items.length - 1 && (
              <div style={{ position: 'absolute', left: 10, top: 24, bottom: -4, width: 2, background: 'var(--border)' }} />
            )}
            <div style={{
              position: 'absolute', left: 4, top: 10,
              width: 14, height: 14, borderRadius: 99,
              background: color,
              border: '3px solid var(--bg-card)',
              boxShadow: `0 0 0 2px ${color}30`,
            }} />

            <div
              className="card"
              style={{ padding: 14, marginBottom: 10, cursor: 'pointer', borderLeft: `3px solid ${color}` }}
              onClick={() => setOpen(isOpen ? null : idx)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{it.company}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{it.role}</div>
                </div>
                <span className="pill" style={{ borderColor: `${color}40`, color, fontWeight: 600, background: `${color}08` }}>{it.stage}</span>
              </div>

              <div style={{ display: 'flex', gap: 4, marginTop: 10 }}>
                {stages.map((s, si) => (
                  <div key={s} style={{
                    flex: 1, height: 5, borderRadius: 99,
                    background: si <= stageIdx ? color : 'var(--bg-elevated)',
                    border: si <= stageIdx ? 'none' : '1px solid var(--border)',
                    transition: 'background .3s',
                  }} />
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 10, color: 'var(--text-muted)' }}>
                {stages.map(s => <span key={s}>{s}</span>)}
              </div>

              {it.deadline && (
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
                  📅 Deadline: {it.deadline}
                </div>
              )}

              {isOpen && (
                <div className="fade-in" style={{ marginTop: 10, fontSize: 13, color: 'var(--text-secondary)', padding: 12, background: 'var(--bg-elevated)', borderRadius: 10, border: '1px solid var(--border)' }}>
                  <div><strong>Date:</strong> {it.date}</div>
                  <div style={{ marginTop: 4 }}>Application tracking: {it.stage} stage reached. {stageIdx < 3 ? `Next step: ${stages[stageIdx + 1]}` : '🎉 Offer received!'}</div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
