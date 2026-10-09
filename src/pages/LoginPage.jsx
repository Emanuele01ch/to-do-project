import { Link } from 'react-router-dom';

function LoginPage() {
  return (
    <div>
      <h2>Log in</h2>
      <p>The login form is coming soon.</p>
      <p>
        <Link to="/">Back to home</Link>
      </p>
    </div>
  );
}

export default LoginPage;