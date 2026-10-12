export default function HabitForm({
  title,
  onTitleChange,
  type,
  onTypeChange,
  frequency,
  onFrequencyChange,
  onSubmit
}) {
  const fieldStyle = { padding: '10px', borderRadius: '4px', border: '1px solid var(--border)' };

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder={type === 'build' ? 'e.g. Drink water' : 'e.g. No smoking'}
          style={{ ...fieldStyle, flex: 1 }}
        />
        <button type="submit" style={{ padding: '10px 20px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Add
        </button>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <select value={type} onChange={(e) => onTypeChange(e.target.value)} style={fieldStyle}>
          <option value="build">Build a habit (do it)</option>
          <option value="quit">Quit a habit (avoid it)</option>
        </select>

        <select value={frequency} onChange={(e) => onFrequencyChange(e.target.value)} style={fieldStyle}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
    </form>
  );
}