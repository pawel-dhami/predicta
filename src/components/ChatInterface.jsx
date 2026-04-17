import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Mic, Sparkles, Brain, Eye, Zap, Database, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ReAct agent trace steps — simulates the agentic reasoning pipeline
const generateAgentTrace = (query) => {
  const q = query.toLowerCase();
  if (q.includes('company') || q.includes('apply')) {
    return [
      { phase: 'PERCEIVE', icon: Eye, color: '#f59e0b', text: 'Scanning student profile → Skills: DSA(8), SQL(6), SysDesign(3), Python(9)' },
      { phase: 'RETRIEVE', icon: Database, color: '#6366f1', text: 'Loading company requirements from vector DB → 5 active JDs matched' },
      { phase: 'REASON', icon: Brain, color: '#10b981', text: 'Computing match scores → Goldman(87%), Flipkart(78%), Infosys(81%) → Ranking by gap-closure feasibility' },
      { phase: 'ACT', icon: Zap, color: '#ec4899', text: 'Generating personalized recommendation with selection probabilities and gap analysis' },
    ];
  }
  if (q.includes('resume') || q.includes('review') || q.includes('cv')) {
    return [
      { phase: 'PERCEIVE', icon: Eye, color: '#f59e0b', text: 'Parsing uploaded CV → 8 skills extracted, 2 projects, 1 internship' },
      { phase: 'RETRIEVE', icon: Database, color: '#6366f1', text: 'Fetching top-performing resumes from placement database for benchmarking' },
      { phase: 'REASON', icon: Brain, color: '#10b981', text: 'Comparing against Goldman Sachs JD → Missing: System Design, quantified impact metrics' },
      { phase: 'ACT', icon: Zap, color: '#ec4899', text: 'Generating section-by-section improvement suggestions with priority scores' },
    ];
  }
  if (q.includes('interview') || q.includes('mock')) {
    return [
      { phase: 'PERCEIVE', icon: Eye, color: '#f59e0b', text: 'Checking calendar → TCS interview in 5 days, Goldman round 2 pending' },
      { phase: 'RETRIEVE', icon: Database, color: '#6366f1', text: 'Loading TCS interview patterns from 200+ past candidate reports' },
      { phase: 'REASON', icon: Brain, color: '#10b981', text: 'Analyzing weak areas → DSA medium problems (60% solve rate), SQL joins gap identified' },
      { phase: 'ACT', icon: Zap, color: '#ec4899', text: 'Scheduling mock interview, generating topic-wise preparation roadmap' },
    ];
  }
  if (q.includes('plan') || q.includes('today') || q.includes('roadmap')) {
    return [
      { phase: 'PERCEIVE', icon: Eye, color: '#f59e0b', text: 'Loading active deadlines → Goldman(2d), Infosys OA(5d), TCS interview(7d)' },
      { phase: 'RETRIEVE', icon: Database, color: '#6366f1', text: 'Fetching skill progress history → SQL improved 15% this week, SysDesign stagnant' },
      { phase: 'REASON', icon: Brain, color: '#10b981', text: 'Prioritizing by deadline urgency × skill gap severity → Goldman app > SQL practice > Mock' },
      { phase: 'ACT', icon: Zap, color: '#ec4899', text: 'Creating optimized daily schedule with time-blocked study sessions' },
    ];
  }
  return [
    { phase: 'PERCEIVE', icon: Eye, color: '#f59e0b', text: 'Analyzing student context → Profile score: 78/100, Risk: MEDIUM' },
    { phase: 'RETRIEVE', icon: Database, color: '#6366f1', text: 'Querying knowledge base for relevant placement intelligence' },
    { phase: 'REASON', icon: Brain, color: '#10b981', text: 'Cross-referencing profile gaps with market requirements → System Design is critical blocker' },
    { phase: 'ACT', icon: Zap, color: '#ec4899', text: 'Composing contextual response with actionable recommendations' },
  ];
};

export default function ChatInterface({ onSend, loading }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'agent', text: 'Hi! I\'m your Predicta AI Mentor. I can help you plan your placement strategy, suggest companies, review your resume, or prep for interviews. What would you like to work on today?' },
  ]);
  const [agentTrace, setAgentTrace] = useState(null);
  const [traceStep, setTraceStep] = useState(0);
  const [traceVisible, setTraceVisible] = useState(true);
  const [isThinking, setIsThinking] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, agentTrace, traceStep]);

  const handleSend = async () => {
    if (!input.trim() || loading || isThinking) return;
    const userMsg = input;
    const next = [...messages, { role: 'user', text: userMsg }];
    setMessages(next);
    setInput('');

    // Start agent trace animation
    const trace = generateAgentTrace(userMsg);
    setAgentTrace(trace);
    setTraceStep(0);
    setIsThinking(true);
    setTraceVisible(true);

    // Animate through trace steps
    for (let i = 0; i < trace.length; i++) {
      await new Promise(r => setTimeout(r, 700));
      setTraceStep(i + 1);
    }

    // Now actually call the API
    try {
      const response = await onSend(userMsg, next);
      if (response?.reply) {
        // Finish trace, then stream the response
        await new Promise(r => setTimeout(r, 400));
        setIsThinking(false);

        const words = response.reply.split(' ');
        let current = '';
        setMessages((m) => [...m, { role: 'agent', text: '' }]);
        words.forEach((w, i) =>
          setTimeout(() => {
            current += `${w} `;
            setMessages((m) => [...m.slice(0, -1), { role: 'agent', text: current.trim() }]);
          }, 40 * (i + 1))
        );

        // Clear trace after message is done
        setTimeout(() => {
          setAgentTrace(null);
          setTraceStep(0);
        }, 40 * words.length + 500);
      }
    } catch {
      setIsThinking(false);
      setMessages((m) => [...m, { role: 'agent', text: 'Connection error. The AI agent is temporarily unavailable.' }]);
      setAgentTrace(null);
    }
  };

  const prompts = [
    'Which company should I apply to next?',
    'Review my skills for Goldman Sachs',
    'Mock interview prep for TCS',
    'What should I do today?',
  ];

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', minHeight: 480 }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'linear-gradient(135deg, #6c47ff, #e84393)',
            display: 'grid', placeItems: 'center',
          }}>
            <Bot size={14} color="#fff" />
          </div>
          <strong style={{ fontSize: 14, color: 'var(--text-primary)' }}>Predicta AI Mentor</strong>
          <span className="live-dot">LIVE</span>
        </div>
        <span className="pill" style={{ fontSize: 11 }}><Sparkles size={10} /> Groq / Llama 3.1</span>
      </div>

      {/* Quick Prompts */}
      <div style={{ marginBottom: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {prompts.map((p) => (
          <button key={p} className="pill" style={{ cursor: 'pointer' }} onClick={() => setInput(p)}>
            {p}
          </button>
        ))}
      </div>

      {/* Messages Area */}
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 8, paddingRight: 4 }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
            background: m.role === 'user'
              ? 'linear-gradient(135deg, #6c47ff, #8b5cf6)'
              : 'var(--bg-elevated)',
            color: m.role === 'user' ? '#ffffff' : 'var(--text-secondary)',
            padding: '10px 14px',
            borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
            maxWidth: '80%',
            fontSize: 13,
            lineHeight: 1.6,
            border: m.role === 'user' ? 'none' : '1px solid var(--border)',
            boxShadow: m.role === 'user' ? '0 2px 8px rgba(108,71,255,.2)' : 'none',
          }}>
            {m.text}
          </div>
        ))}

        {/* ── AGENTIC AI TRACE PANEL ── */}
        <AnimatePresence>
          {agentTrace && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                alignSelf: 'flex-start',
                width: '90%',
                background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.05))',
                border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: 12,
                padding: 0,
                overflow: 'hidden',
              }}
            >
              {/* Trace Header */}
              <div
                onClick={() => setTraceVisible(!traceVisible)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '8px 12px', cursor: 'pointer',
                  background: 'rgba(99,102,241,0.1)',
                  borderBottom: traceVisible ? '1px solid rgba(99,102,241,0.15)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <motion.div
                    animate={isThinking ? { rotate: 360 } : {}}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  >
                    <Brain size={14} color="#6366f1" />
                  </motion.div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Agent ReAct Trace
                  </span>
                  {isThinking && (
                    <motion.span
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                      style={{ fontSize: 10, color: '#f59e0b', fontWeight: 600 }}
                    >
                      ● REASONING
                    </motion.span>
                  )}
                </div>
                {traceVisible ? <ChevronUp size={14} color="#6366f1" /> : <ChevronDown size={14} color="#6366f1" />}
              </div>

              {/* Trace Steps */}
              {traceVisible && (
                <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {agentTrace.map((step, i) => {
                    const reached = i < traceStep;
                    const current = i === traceStep - 1 && isThinking;
                    const Icon = step.icon;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={reached ? { opacity: 1, x: 0 } : { opacity: 0.2, x: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{
                          display: 'flex', alignItems: 'flex-start', gap: 8,
                          padding: '6px 8px', borderRadius: 8,
                          background: current ? `${step.color}10` : 'transparent',
                          border: current ? `1px solid ${step.color}30` : '1px solid transparent',
                        }}
                      >
                        <div style={{
                          width: 22, height: 22, borderRadius: 6,
                          background: reached ? `${step.color}20` : 'rgba(255,255,255,0.03)',
                          display: 'grid', placeItems: 'center', flexShrink: 0,
                          marginTop: 1,
                        }}>
                          <Icon size={12} color={reached ? step.color : 'var(--text-muted)'} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
                            color: reached ? step.color : 'var(--text-muted)',
                            textTransform: 'uppercase', marginBottom: 2,
                          }}>
                            {step.phase}
                          </div>
                          <div style={{
                            fontSize: 11, color: reached ? 'var(--text-secondary)' : 'var(--text-muted)',
                            lineHeight: 1.4, fontFamily: 'monospace',
                          }}>
                            {reached ? step.text : '...'}
                          </div>
                        </div>
                        {reached && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            style={{
                              width: 16, height: 16, borderRadius: 99,
                              background: step.color, display: 'grid', placeItems: 'center',
                              flexShrink: 0, marginTop: 3,
                            }}
                          >
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {loading && <div className="pulse" style={{ padding: '10px 14px', background: 'var(--bg-elevated)', borderRadius: 16, alignSelf: 'flex-start', fontSize: 13, color: 'var(--text-muted)' }}>Thinking...</div>}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <input
          className="input"
          style={{ flex: 1 }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask your AI mentor anything..."
        />
        <button className="btn btn-accent" onClick={handleSend} disabled={loading || isThinking}>
          <Send size={14} />
        </button>
        <button className="btn"><Mic size={14} /></button>
      </div>
    </div>
  );
}
