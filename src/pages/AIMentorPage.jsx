/**
 * AIMentorPage — /ai-mentor
 * Full-screen AI mentor chat with conversation history,
 * quick prompts, and topic suggestions.
 */
import { useState, useRef, useEffect } from 'react';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../hooks/useAuth';
import { Send, Bot, User, Sparkles, RefreshCw, Zap } from 'lucide-react';

const QUICK_PROMPTS = [
  'What skills should I focus on this week?',
  'Review my placement readiness',
  'Top companies for my profile?',
  'How to crack system design interviews?',
  'Prepare me for a TCS interview',
  'What are my weakest areas?',
];

// /api/* is rewritten by netlify.toml to /.netlify/functions/api/:splat
// So /api/agent/chat hits the function with path /api/agent/chat ✓
const CHAT_URL = '/api/agent/chat';

function Message({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div style={{
      display: 'flex', gap: 10, alignItems: 'flex-start',
      flexDirection: isUser ? 'row-reverse' : 'row',
      marginBottom: 16,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 99, flexShrink: 0,
        background: isUser
          ? 'linear-gradient(135deg, #6c47ff, #e84393)'
          : 'linear-gradient(135deg, #1e1b4b, #312e81)',
        display: 'grid', placeItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,.15)',
      }}>
        {isUser ? <User size={14} color="#fff" /> : <Bot size={14} color="#a5b4fc" />}
      </div>
      <div style={{
        maxWidth: '72%',
        padding: '12px 16px',
        background: isUser
          ? 'linear-gradient(135deg, #6c47ff, #e84393)'
          : 'var(--bg-elevated)',
        color: isUser ? '#fff' : 'var(--text-primary)',
        borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
        fontSize: 13,
        lineHeight: 1.7,
        border: isUser ? 'none' : '1px solid var(--border)',
        boxShadow: '0 2px 8px rgba(0,0,0,.06)',
        whiteSpace: 'pre-wrap',
      }}>
        {msg.content}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16 }}>
      <div style={{
        width: 32, height: 32, borderRadius: 99,
        background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
        display: 'grid', placeItems: 'center',
      }}>
        <Bot size={14} color="#a5b4fc" />
      </div>
      <div style={{
        padding: '12px 16px', background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        borderRadius: '4px 16px 16px 16px',
        display: 'flex', gap: 4, alignItems: 'center',
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: 99,
            background: 'var(--text-muted)',
            animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}

export default function AIMentorPage() {
  const { aiAnalysis, linkedinData } = useProfile();
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi! I'm your AI Placement Mentor 🤖\n\nI'm here to give you personalized guidance on your placement journey — from interview prep to application strategy.\n\n${aiAnalysis ? `I can see your profile: ${aiAnalysis.placementScore}/100 placement score, ${aiAnalysis.experienceLevel} level. Ask me anything!` : 'Complete your profile analysis in Onboarding to get personalized advice.'}\n\nWhat would you like to work on today?`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const content = (text || input).trim();
    if (!content || loading) return;
    setInput('');

    const userMsg = { role: 'user', content };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const systemContext = aiAnalysis
        ? `Student profile: placement score ${aiAnalysis.placementScore}/100, level: ${aiAnalysis.experienceLevel}, skills: ${aiAnalysis.skillTags?.slice(0,8).join(', ')}, top roles: ${aiAnalysis.topRoles?.join(', ')}, weak areas: ${aiAnalysis.weakAreas?.join(', ')}.`
        : 'Student has not yet completed profile analysis.';
      const res = await fetch(CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          userId: user?.id || null,   // backend fetches full profile from Supabase
          history: messages.slice(-8).map(m => ({
            role: m.role === 'assistant' ? 'agent' : m.role,
            text: m.content,
          })),
        }),
      });

      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { reply: text }; }

      if (!res.ok) {
        throw new Error(data?.error || data?.reply || `Server error ${res.status}`);
      }

      const reply = data.reply || data.message || 'Sorry, I had trouble responding.';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error('[AI Mentor] chat error:', err);
      setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ ${err.message || 'Connection issue — please try again.'}` }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: 'Chat cleared! What would you like to work on? 🤖'
    }]);
  };

  return (
    <div style={{ display: 'grid', gap: 20 }}>

      {/* Header */}
      <div className="gradient-banner">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Bot size={20} /> AI Placement Mentor
              <span style={{ background: 'rgba(255,255,255,.2)', padding: '2px 8px', borderRadius: 99, fontSize: 11 }}>● LIVE</span>
            </div>
            <div style={{ fontSize: 13, opacity: .8 }}>
              Powered by Groq · llama-3.1-8b-instant ·{' '}
              {aiAnalysis ? `Personalized to your ${aiAnalysis.placementScore}/100 profile` : 'Complete profile for personalized advice'}
            </div>
          </div>
          <button className="btn" onClick={clearChat} style={{ background: 'rgba(255,255,255,.15)', color: '#fff', borderColor: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <RefreshCw size={14} /> Clear
          </button>
        </div>
      </div>

      {/* Quick prompts */}
      <div className="card" style={{ padding: '14px 16px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.06em', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Sparkles size={12} /> Quick Prompts
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {QUICK_PROMPTS.map(p => (
            <button
              key={p}
              onClick={() => sendMessage(p)}
              disabled={loading}
              className="btn btn-sm"
              style={{ fontSize: 12, borderRadius: 99 }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Chat window */}
      <div className="card" style={{ padding: 0, display: 'flex', flexDirection: 'column', height: 520 }}>
        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 10px' }}>
          <style>{`
            @keyframes bounce {
              0%, 80%, 100% { transform: scale(0); }
              40% { transform: scale(1); }
            }
          `}</style>
          {messages.map((msg, i) => (
            <Message key={i} msg={msg} />
          ))}
          {loading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--border)',
          display: 'flex', gap: 10, alignItems: 'flex-end',
          background: 'var(--bg-elevated)',
          borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
        }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Ask anything about placements, interviews, skills... (Enter to send)"
            rows={2}
            style={{
              flex: 1, resize: 'none',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 10, padding: '10px 14px',
              fontSize: 13, color: 'var(--text-primary)',
              fontFamily: 'inherit', outline: 'none',
              lineHeight: 1.5,
            }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            style={{
              width: 42, height: 42, borderRadius: 10, flexShrink: 0, border: 'none', cursor: 'pointer',
              background: loading || !input.trim() ? 'var(--bg-elevated)' : 'linear-gradient(135deg, #6c47ff, #e84393)',
              display: 'grid', placeItems: 'center',
              transition: 'all .2s',
            }}
          >
            <Send size={16} color={loading || !input.trim() ? 'var(--text-muted)' : '#fff'} />
          </button>
        </div>
      </div>

      {/* Tips */}
      <div className="card" style={{ padding: '14px 20px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.06em' }}>💡 Tips</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { icon: '🎯', title: 'Company Prep', tip: 'Ask \"Prepare me for a [Company] interview\" for role-specific advice' },
            { icon: '📊', title: 'Gap Analysis', tip: 'Ask \"What skills am I missing for [Role]?\" for targeted upskilling' },
            { icon: '📝', title: 'Resume Help', tip: 'Ask \"Review my resume for [Company]\" for tailored improvement tips' },
          ].map(({ icon, title, tip }) => (
            <div key={title} style={{ padding: '12px 14px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 16, marginBottom: 6 }}>{icon}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{title}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>{tip}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
