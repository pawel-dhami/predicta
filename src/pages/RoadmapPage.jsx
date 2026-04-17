/**
 * RoadmapPage — /roadmap
 * Full placement roadmap with task management, AI-generated tasks,
 * milestone tracking, and progress analytics.
 */
import { useState, useMemo } from 'react';
import { useProfile } from '../hooks/useProfile';
import { CheckCircle2, Circle, Clock, Zap, Plus, RotateCcw, ChevronRight, Flag } from 'lucide-react';

const INITIAL_TASKS = [
  { id: 'r1', title: 'Solve 20 SQL join problems on LeetCode', done: false, due: 'Apr 13', priority: 'HIGH', category: 'DSA', createdBy: 'AI', description: 'Focus on JOIN, GROUP BY, and window functions — common in OA rounds.' },
  { id: 'r2', title: 'Complete 1 mock interview with peer', done: true, due: 'Apr 11', priority: 'NORMAL', category: 'Interview Prep', createdBy: 'Manual', description: 'Practice STAR method for behavioral questions and system design basics.' },
  { id: 'r3', title: 'Finish System Design fundamentals course', done: false, due: 'Apr 16', priority: 'HIGH', category: 'System Design', createdBy: 'AI', description: 'Cover CAP theorem, load balancing, caching, and database sharding.' },
  { id: 'r4', title: 'Complete aptitude test series (IndiaBix)', done: true, due: 'Apr 14', priority: 'NORMAL', category: 'Aptitude', createdBy: 'AI', description: 'Focus on quantitative and logical reasoning — especially speed math.' },
  { id: 'r5', title: 'Update resume with latest project', done: true, due: 'Apr 10', priority: 'LOW', category: 'Resume', createdBy: 'Manual', description: 'Add metrics and outcomes to project bullet points. Keep to 1 page.' },
  { id: 'r6', title: 'Apply to 5 companies via LinkedIn Easy Apply', done: false, due: 'Apr 18', priority: 'HIGH', category: 'Applications', createdBy: 'AI', description: 'Use your top matched roles from the Jobs page as a starting point.' },
  { id: 'r7', title: 'Read "Cracking the Coding Interview" — Ch.5–8', done: false, due: 'Apr 20', priority: 'NORMAL', category: 'DSA', createdBy: 'AI', description: 'Focus on trees, graphs, and dynamic programming patterns.' },
];

const MILESTONES = [
  { icon: '📋', label: 'Profile Ready', threshold: 20 },
  { icon: '🧠', label: 'Skills Mapped', threshold: 40 },
  { icon: '📤', label: 'Applied', threshold: 60 },
  { icon: '🎤', label: 'Interview Stage', threshold: 80 },
  { icon: '🏆', label: 'Offer Received', threshold: 100 },
];

const PRIORITY_COLORS = { HIGH: '#dc2626', NORMAL: '#d97706', LOW: '#6c47ff' };
const CATEGORY_COLORS = {
  DSA: '#6c47ff', 'System Design': '#e84393', 'Interview Prep': '#10b981',
  Aptitude: '#d97706', Resume: '#0891b2', Applications: '#f59e0b',
};

export default function RoadmapPage() {
  const { aiAnalysis } = useProfile();
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks(prev => [...prev, {
      id: `t${Date.now()}`,
      title: newTask.trim(),
      done: false,
      due: 'No deadline',
      priority: 'NORMAL',
      category: 'Manual',
      createdBy: 'Manual',
      description: '',
    }]);
    setNewTask('');
    setShowAdd(false);
  };

  const filtered = useMemo(() => {
    if (filter === 'pending') return tasks.filter(t => !t.done);
    if (filter === 'done') return tasks.filter(t => t.done);
    if (filter === 'ai') return tasks.filter(t => t.createdBy === 'AI');
    return tasks;
  }, [tasks, filter]);

  const doneCount = tasks.filter(t => t.done).length;
  const pct = Math.round((doneCount / tasks.length) * 100);
  const currentMilestone = MILESTONES.findLast(m => pct >= m.threshold) ?? MILESTONES[0];
  const nextMilestone = MILESTONES.find(m => pct < m.threshold);

  return (
    <div style={{ display: 'grid', gap: 20 }}>

      {/* Header */}
      <div className="gradient-banner">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>📋 My Placement Roadmap</div>
            <div style={{ fontSize: 13, opacity: .8 }}>
              {doneCount} of {tasks.length} tasks complete · {pct}% done · {nextMilestone ? `Next: ${nextMilestone.label}` : 'All milestones reached 🎉'}
            </div>
          </div>
          <button className="btn" style={{ background: 'rgba(255,255,255,.15)', color: '#fff', borderColor: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', gap: 6 }} onClick={() => setShowAdd(true)}>
            <Plus size={14} /> Add Task
          </button>
        </div>
      </div>

      {/* Progress bar + Milestones */}
      <div className="card" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Overall Progress</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-purple)', fontFamily: 'monospace' }}>{pct}%</span>
        </div>
        <div style={{ height: 10, background: 'var(--bg-elevated)', borderRadius: 99, overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #6c47ff, #e84393)', borderRadius: 99, transition: 'width .5s ease' }} />
        </div>

        {/* Milestones */}
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 14, left: '5%', right: '5%', height: 2, background: 'var(--border)', zIndex: 0 }} />
          {MILESTONES.map((m, i) => {
            const reached = pct >= m.threshold;
            return (
              <div key={i} style={{ textAlign: 'center', zIndex: 1, flex: 1 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 99, margin: '0 auto 8px',
                  background: reached ? 'linear-gradient(135deg, #6c47ff, #e84393)' : 'var(--bg-elevated)',
                  border: `2px solid ${reached ? '#6c47ff' : 'var(--border)'}`,
                  display: 'grid', placeItems: 'center',
                  fontSize: 13, transition: 'all .3s',
                }}>{reached ? '✓' : m.icon}</div>
                <div style={{ fontSize: 10, color: reached ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: reached ? 700 : 400 }}>{m.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid-4">
        <div className="card" style={{ padding: '14px 18px', textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#10b981', fontFamily: 'monospace' }}>{doneCount}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Completed</div>
        </div>
        <div className="card" style={{ padding: '14px 18px', textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#dc2626', fontFamily: 'monospace' }}>{tasks.filter(t => !t.done && t.priority === 'HIGH').length}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Urgent Pending</div>
        </div>
        <div className="card" style={{ padding: '14px 18px', textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--accent-purple)', fontFamily: 'monospace' }}>{tasks.filter(t => t.createdBy === 'AI').length}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>AI-Generated</div>
        </div>
        <div className="card" style={{ padding: '14px 18px', textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#d97706', fontFamily: 'monospace' }}>{tasks.filter(t => !t.done).length}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Remaining</div>
        </div>
      </div>

      {/* Task List */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div className="section-label" style={{ marginBottom: 0 }}><strong>📝 Tasks</strong></div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[['all', 'All'], ['pending', 'Pending'], ['done', 'Completed'], ['ai', 'AI Tasks']].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setFilter(val)}
                className={`btn btn-sm ${filter === val ? 'btn-accent' : ''}`}
                style={{ fontSize: 11 }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Add task inline */}
        {showAdd && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <input
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTask()}
              placeholder="Describe your task and press Enter..."
              className="input"
              style={{ flex: 1 }}
              autoFocus
            />
            <button className="btn btn-accent btn-sm" onClick={addTask}>Add</button>
            <button className="btn btn-sm" onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        )}

        <div style={{ display: 'grid', gap: 8 }}>
          {filtered.map(task => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                padding: '14px 16px',
                background: task.done ? 'var(--bg-elevated)' : 'var(--bg-card)',
                border: `1px solid ${task.done ? 'var(--border)' : task.priority === 'HIGH' ? 'rgba(220,38,38,.2)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer', opacity: task.done ? 0.6 : 1,
                transition: 'all .2s',
              }}
            >
              {task.done
                ? <CheckCircle2 size={18} style={{ color: '#10b981', flexShrink: 0, marginTop: 1 }} />
                : <Circle size={18} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: 1 }} />
              }
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', textDecoration: task.done ? 'line-through' : 'none', marginBottom: 4 }}>
                  {task.title}
                </div>
                {task.description && (
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6, lineHeight: 1.5 }}>{task.description}</div>
                )}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, background: `${CATEGORY_COLORS[task.category] || '#6c47ff'}18`, color: CATEGORY_COLORS[task.category] || '#6c47ff', fontWeight: 600 }}>
                    {task.category}
                  </span>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, background: `${PRIORITY_COLORS[task.priority]}18`, color: PRIORITY_COLORS[task.priority], fontWeight: 700 }}>
                    {task.priority}
                  </span>
                  {task.createdBy === 'AI' && (
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, background: 'rgba(108,71,255,.1)', color: 'var(--accent-purple)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Zap size={9} /> AI
                    </span>
                  )}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={11} /> {task.due}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom actions */}
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button className="btn btn-sm" onClick={() => setShowAdd(true)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Plus size={13} /> Add Task
          </button>
          <button className="btn btn-sm btn-accent" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Zap size={13} /> AI Generate Next
          </button>
          <button className="btn btn-sm" onClick={() => setTasks(prev => prev.map(t => ({ ...t, done: false })))} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
            <RotateCcw size={13} /> Reset
          </button>
        </div>
      </div>

      {/* AI Suggestion */}
      {aiAnalysis?.weakAreas?.[0] && (
        <div className="card" style={{ padding: '16px 20px', background: 'linear-gradient(135deg, rgba(108,71,255,.06), rgba(232,67,147,.04))', border: '1px solid rgba(108,71,255,.2)' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#6c47ff,#e84393)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <Zap size={16} color="#fff" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', marginBottom: 4 }}>AI Recommendation</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Based on your profile, focus on <strong>{aiAnalysis.weakAreas[0]}</strong> — it's your biggest gap vs company requirements.
                Add a dedicated 5-day sprint to your roadmap and you'll clear the threshold for your top target role.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
