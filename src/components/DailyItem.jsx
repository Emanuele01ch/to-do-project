export default function DailyItem({ daily, onToggle, onDelete }) {
  return (
    <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <input
          type="checkbox"
          checked={daily.completed}
          onChange={() => onToggle(daily)}
          style={{ cursor: 'pointer', width: '18px', height: '18px' }}
        />
        <span style={{ textDecoration: daily.completed ? 'line-through' : 'none', color: daily.completed ? 'var(--text)' : 'var(--text-h)' }}>
          {daily.title}
        </span>
      </div>
      <button 
        onClick={() => onDelete(daily.id)} 
        style={{ background: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>
        Delete
      </button>
    </li>
  );
}