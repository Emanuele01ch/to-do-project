export default function TodoForm({ title, onTitleChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
      <input
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Add a new task..."
        style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid var(--border)' }}
      />
      <button type="submit" style={{ padding: '10px 20px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        Add
      </button>
    </form>
  );
}