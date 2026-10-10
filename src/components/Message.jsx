export default function Message({ type = 'error', children }) {
  if (!children) return null;

  const isError = type === 'error';
  
  // Centralized styles for errors vs successes
  const backgroundColor = isError ? '#ffebee' : '#e8f5e9';
  const color = isError ? '#c62828' : '#2e7d32';
  const borderColor = isError ? '#ffcdd2' : '#c8e6c9';

  return (
    <div
      style={{
        padding: '12px 16px',
        backgroundColor,
        color,
        border: `1px solid ${borderColor}`,
        borderRadius: '6px',
        margin: '15px 0',
        fontSize: '14px',
        textAlign: 'left',
      }}
    >
      {children}
    </div>
  );
}