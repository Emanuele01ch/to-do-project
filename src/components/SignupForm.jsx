import { useState } from 'react';
import { Link } from 'react-router-dom';
import { register } from '../api/auth';
import Message from './Message';

const MIN_PASSWORD_LENGTH = 8;

function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
      return;
    }

    setSubmitting(true);
    try {
      const result = await register(email, password);
      setMessage(result.message);
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        <h2>Sign up</h2>

        <div>
          <label htmlFor="signup-email">Email</label>
          <br />
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            className='auth-input'
            required
          />
        </div>

        <div>
          <label htmlFor="signup-password">Password (at least {MIN_PASSWORD_LENGTH} characters)</label>
          <br />
          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            className='auth-input'
            required
          />
        </div>

        <button className='auth-btn' type="submit" disabled={submitting}>
          {submitting ? 'Creating account...' : 'Create account'}
        </button>

        {message && <Message type="success">{message}</Message>}
        {error && <Message type="error">{error}</Message>}
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px' }}>
        <p>
          Already signed up but didn't get the email?{' '}
          <Link to="/resend-verification" style={{ color: '#007BFF', textDecoration: 'none' }}>
            Resend verification link
          </Link>
        </p>
      </div>

      <p>
        <Link to="/">Back to home</Link>
        <span style={{padding:'0 5px'}}>|</span>
        <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}

export default SignupForm;