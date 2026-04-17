export default function RoadmapTask({ task, onToggle }) {
  const priorityColor = task.priority === 'HIGH' ? '#dc2626' : task.priority === 'NORMAL' ? '#0891b2' : '#d97706';
  const priorityBg = task.priority === 'HIGH' ? 'rgba(239,68,68,.06)' : task.priority === 'NORMAL' ? 'rgba(6,182,212,.06)' : 'rgba(245,158,11,.06)';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
      padding: '12px 0', borderBottom: '1px solid var(--border)',
      opacity: task.done ? 0.5 : 1,
      transition: 'opacity .3s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <input
          type="checkbox"
          defaultChecked={task.done}
          onChange={() => onToggle?.(task.id)}
          style={{ width: 18, height: 18, accentColor: '#6c47ff', cursor: 'pointer' }}
        />
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, textDecoration: task.done ? 'line-through' : 'none', color: 'var(--text-primary)' }}>{task.title}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
            {task.createdBy === 'AI' ? '🤖 AI Generated' : '✋ Manual'} · Due: {task.due}
          </div>
        </div>
      </div>
      <span className="pill" style={{ borderColor: `${priorityColor}30`, color: priorityColor, background: priorityBg, fontSize: 10, padding: '2px 8px' }}>{task.priority}</span>
    </div>
  );
}
