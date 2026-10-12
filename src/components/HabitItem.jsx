const UNITS = { daily: 'day', weekly: 'week', monthly: 'month' };

function plural(n, word) {
  return `${n} ${word}${n === 1 ? '' : 's'}`;
}

export default function HabitItem({ habit, onPress, onDelete }) {
  const isQuit = habit.type === 'quit';
  const unit = UNITS[habit.frequency];

  let status;
  if (isQuit) {
    status = habit.period_marked ? `Slipped this ${unit}` : `Clean this ${unit} so far`;
  } else {
    status = habit.period_marked ? `Done this ${unit} ✓` : `Not done this ${unit} yet`;
  }

  const successRate = habit.success_rate === null ? 'no rate yet' : `${habit.success_rate}% success`;

  return (
    <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
      <div>
        <div style={{ fontWeight: 600 }}>{habit.title}</div>
        <div style={{ fontSize: '13px', opacity: 0.8 }}>
          🔥 {plural(habit.streak, unit)} · {successRate}
        </div>
        <div style={{ fontSize: '13px', opacity: 0.8 }}>{status}</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ textAlign: 'center', minWidth: '40px' }}>
          <div style={{ fontSize: '20px', fontWeight: 600 }}>{habit.count}</div>
          <div style={{ fontSize: '11px', opacity: 0.7 }}>{isQuit ? 'slips' : 'done'}</div>
        </div>

        <button
          onClick={() => onPress(habit)}
          aria-label={isQuit ? `I slipped on ${habit.title}` : `Add one to ${habit.title}`}
          style={{
            background: isQuit ? '#e67e22' : 'var(--accent)',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            padding: isQuit ? '8px 14px' : '8px 16px',
            fontSize: isQuit ? '14px' : '20px',
            cursor: 'pointer'
          }}
        >
          {isQuit ? 'I slipped' : '+'}
        </button>

        <button
          onClick={() => onDelete(habit.id)}
          aria-label={`Delete ${habit.title}`}
          style={{ background: '#dc3545', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}
        >
          Delete
        </button>
      </div>
    </li>
  );
}