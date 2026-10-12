import { useEffect, useState } from 'react';
import { createDaily, deleteDaily, getDailies, setDailyCompleted } from '../api/dailies.js';
import DailyForm from '../components/DailyForm.jsx';
import DailyItem from '../components/DailyItem.jsx';
import Navbar from '../components/Navbar.jsx';
import BottomNav from '../components/BottomNav.jsx';
import { useNavigate } from 'react-router-dom';

export default function DailyPage() {
  const [dailies, setDailies] = useState([]);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    async function loadDailies() {
      try {
        setDailies(await getDailies());
      } catch (err) {
        setError(err.message);
      }
    }

    loadDailies();
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  async function handleSubmit(event) {
    event.preventDefault();
    if (!title.trim()) return;

    try {
      const newDaily = await createDaily(title);
      setDailies((current) => [...current, newDaily]);
      setTitle('');
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleToggle(daily) {
    try {
      const updated = await setDailyCompleted(daily.id, !daily.completed);
      setDailies((current) =>
        current.map((d) => (d.id === updated.id ? updated : d))
      );
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteDaily(id);
      setDailies((current) => current.filter((daily) => daily.id !== id));
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={{ paddingBottom: '80px' }}>
      <Navbar isLoggedIn={!!token} onLogout={handleLogout} />

      <div style={{ maxWidth: '600px', margin: '40px auto', padding: '0 20px' }}>
        <h1>Daily Tasks ☀️</h1>

        <DailyForm title={title} onTitleChange={setTitle} onSubmit={handleSubmit} />

        {error && <p style={{ color: 'red' }}>Error: {error}</p>}

        <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left' }}>
          {dailies.map((daily) => (
            <DailyItem key={daily.id} daily={daily} onToggle={handleToggle} onDelete={handleDelete} />
          ))}
        </ul>
      </div>

      <BottomNav />
    </div>
  );
}