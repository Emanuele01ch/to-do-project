import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Message from '../components/Message';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isUnverified, setIsUnverified] = useState(false); // Tracks if 403 unverified error occurred

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsUnverified(false);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Check if error is due to unverified email (HTTP 403)
        if (response.status === 403) {
          setIsUnverified(true);
        }
        throw new Error(data.error || 'Failed to log in.');
      }

      // Save JWT token to localStorage
      localStorage.setItem('token', data.token);
      setMessage('Logged in successfully! Redirecting...');

      // Redirect to home/todos dashboard after a brief moment
      setTimeout(() => {
        navigate('/');
      }, 1000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='form-container'>
      <h2>Log in</h2>

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="your@email.com"
            className='auth-input'
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className='auth-input'
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className='auth-btn'
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      {/* Centralized message components */}
      {message && <Message type="success">{message}</Message>}
      {error && (
        <Message type="error">
          {error}
          {isUnverified && (
            <div style={{ marginTop: '8px' }}>
              <Link to="/resend-verification" style={{ color: '#c62828', fontWeight: 'bold', textDecoration: 'underline' }}>
                Click here to resend your verification email
              </Link>
            </div>
          )}
        </Message>
      )}

      <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
        <Link to="/">Back to home</Link>
        <span style={{ padding: '0 5px' }}>|</span>
        <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
}

export default LoginPage;