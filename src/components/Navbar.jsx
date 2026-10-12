import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ isLoggedIn, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', borderBottom: '1px solid #ddd', position: 'relative' }}>
      <div>
        <Link to="/" style={{ textDecoration: 'none', fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
          My To-Do App
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {/* Quick action buttons outside hamburger when logged out */}
        {!isLoggedIn && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/signup">
              <button type="button" style={{ padding: '6px 12px', cursor: 'pointer' }}>Sign up</button>
            </Link>
            <Link to="/login">
              <button type="button" style={{ padding: '6px 12px', cursor: 'pointer', background: '#007BFF', color: 'white', border: 'none', borderRadius: '4px' }}>Log in</button>
            </Link>
          </div>
        )}

        {/* Hamburger Menu Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          style={{ background: 'none', border: '1px solid #ccc', padding: '6px 10px', cursor: 'pointer', borderRadius: '4px', fontSize: '16px' }}
          aria-label="Menu"
        >
          ☰
        </button>

        {/* Hamburger Dropdown Menu */}
        {isOpen && (
          <div style={{ position: 'absolute', right: '20px', top: '65px', background: 'white', border: '1px solid #ddd', borderRadius: '6px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', padding: '15px', display: 'flex', flexDirection: 'column', gap: '12px', zIndex: 100, minWidth: '160px' }}>
            <Link to="/" onClick={() => setIsOpen(false)} style={{ textDecoration: 'none', color: '#333', fontSize: '14px' }}>Home</Link>
            
            {isLoggedIn && (
              <Link to="/todos" onClick={() => setIsOpen(false)} style={{ textDecoration: 'none', color: '#333', fontSize: '14px', fontWeight: 'bold' }}>Dashboard</Link>
            )}

            {isLoggedIn ? (
              <button 
                onClick={() => {
                  setIsOpen(false);
                  onLogout();
                }}
                style={{ background: '#dc3545', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', textAlign: 'left' }}
              >
                Log out
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} style={{ textDecoration: 'none', color: '#333', fontSize: '14px' }}>Log in</Link>
                <Link to="/signup" onClick={() => setIsOpen(false)} style={{ textDecoration: 'none', color: '#333', fontSize: '14px' }}>Sign up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}