import { Link } from 'react-router-dom';
import SignupForm from '../components/SignupForm';

function SignupPage() {
  return (
    <div>
      <SignupForm />
      <p>
        <Link to="/">Back to home</Link>
      </p>
    </div>
  );
}

export default SignupPage;