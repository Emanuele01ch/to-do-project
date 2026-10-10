import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import VerifyEmailPage from './pages/VerifyEmailPage.jsx';
import ResendVerificationPage from './pages/ResendVerificationPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/app" element={<DashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/resend-verification" element={<ResendVerificationPage />} />
      </Routes>
    </BrowserRouter>
  );
}