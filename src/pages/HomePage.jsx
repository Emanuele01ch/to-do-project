import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function HomePage() {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} onLogout={() => {
        localStorage.removeItem('token');
        window.location.reload();
      }} />

      <div style={{ maxWidth: '600px', margin: '80px auto', textAlign: 'center', padding: '0 20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>Welcome to My To-Do App 🚀</h1>
        <p style={{ color: '#666', fontSize: '18px', lineHeight: '1.5', margin: '20px 0' }}>
          Stay organized, boost your productivity, and manage your daily tasks with ease.
        </p>

        <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
          {isLoggedIn ? (
            <Link to="/todos">
              <button style={{ padding: '12px 24px', background: '#007BFF', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}>
                Go to My Dashboard
              </button>
            </Link>
          ) : (
            <>
              <Link to="/signup">
                <button style={{ padding: '12px 24px', background: '#007BFF', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Get Started (Sign Up)
                </button>
              </Link>
              <Link to="/login">
                <button style={{ padding: '12px 24px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Log In
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}