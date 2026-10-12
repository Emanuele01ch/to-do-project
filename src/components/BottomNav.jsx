import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();

  const getStyle = (path) => ({
    flex: 1,
    textAlign: 'center',
    padding: '12px 0',
    textDecoration: 'none',
    fontWeight: location.pathname === path ? 'bold' : 'normal',
    color: location.pathname === path ? 'var(--accent)' : '#666',
    borderTop: location.pathname === path ? '2px solid var(--accent)' : '1px solid #ddd',
  });

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: 0, 
      left: 0, 
      right: 0, 
      width: '100%',
      maxWidth: '1126px',
      margin: '0 auto',
      display: 'flex', 
      borderTop: '1px solid var(--border)', 
      zIndex: 1000,
      boxShadow: 'var(--shadow)'
    }}>
      <Link to="/habits" style={getStyle('/habits')}>Habits</Link>
      <Link to="/daily" style={getStyle('/daily')}>Daily</Link>
      <Link to="/todos" style={getStyle('/todos')}>To-Do</Link>
    </div>
  );
}