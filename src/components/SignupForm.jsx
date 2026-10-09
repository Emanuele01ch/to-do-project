import { useState } from 'react';
import { register } from '../api/auth';

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
    <form onSubmit={handleSubmit}>
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
          required
        />
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? 'Creating account...' : 'Create account'}
      </button>

      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
    </form>
  );
}

export default SignupForm;