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
        <p style={{ color: 'green' }}>{message}. You can now log in.</p>
      )}
      {status === 'error' && <p style={{ color: 'crimson' }}>{message}</p>}

      <p>
        <Link to="/login">Go to log in</Link>
      </p>
    </div>
  );
}

export default VerifyEmailPage;