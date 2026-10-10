import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { verifyEmail } from '../api/auth';

function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState(token ? 'loading' : 'error');
  const [message, setMessage] = useState(token ? '' : 'This link is missing its token');
  const alreadySent = useRef(false);

  useEffect(() => {
    if (!token || alreadySent.current) {
      return;
    }
    alreadySent.current = true;

    async function verify() {
      try {
        const result = await verifyEmail(token);
        setStatus('success');
        setMessage(result.message);
      } catch (err) {
        setStatus('error');
        setMessage(err.message);
      }
    }

    verify();
  }, [token]);

  return (
    <div>
      <h2>Email verification</h2>

      {status === 'loading' && <p>Verifying your email...</p>}
      {status === 'success' && (
        <p style={{ color: 'green' }}>{message}.</p>
      )}
      {status === 'error' && 
      <div style={{ marginTop: '15px' }}>
            <p style={{ color: 'red' }}>{message}</p>
            <p style={{ fontSize: '14px', marginTop: '10px' }}>
            Need a fresh link?{' '}
            <Link to="/resend-verification" style={{ color: '#007BFF', textDecoration: 'underline' }}>
                Request a new verification email
            </Link>
            </p>
        </div>}

      <p>
        <Link to="/">Back to Home</Link>
        <span style={{padding:'0 5px'}}>|</span>
        <Link to="/login">Go to log in</Link>
      </p>
    </div>
  );
}

export default VerifyEmailPage;