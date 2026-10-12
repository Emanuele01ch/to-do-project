import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import VerifyEmailPage from './pages/VerifyEmailPage.jsx';
import ResendVerificationPage from './pages/ResendVerificationPage.jsx';
import HabitsPage from './pages/HabitsPage.jsx'
import TodoPage from './pages/TodoPage.jsx';
import DailyPage from './pages/DailyPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/resend-verification" element={<ResendVerificationPage />} />
        <Route path="/todos" element={<TodoPage />} />
        <Route path="/habits" element={<HabitsPage />} />
        <Route path="/daily" element={<DailyPage />} />
      </Routes>
    </BrowserRouter>
  );
}