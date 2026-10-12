export default function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo)}
          style={{ cursor: 'pointer', width: '18px', height: '18px' }}
        />
        <span style={{ textDecoration: todo.completed ? 'line-through' : 'none', color: todo.completed ? 'var(--text)' : 'var(--text-h)' }}>
          {todo.title}
        </span>
      </div>
      <button 
        onClick={() => onDelete(todo.id)} 
        style={{ background: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>
        Delete
      </button>
    </li>
  );
}