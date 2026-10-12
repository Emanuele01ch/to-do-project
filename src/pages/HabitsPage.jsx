import { useEffect, useState } from 'react';
import { createHabit, deleteHabit, getHabits, pressHabit } from '../api/habits.js';
import HabitForm from '../components/HabitForm.jsx';
import HabitItem from '../components/HabitItem.jsx';
import Navbar from '../components/Navbar.jsx';
import BottomNav from '../components/BottomNav.jsx';
import { useNavigate } from 'react-router-dom';

export default function HabitsPage() {
  const [habits, setHabits] = useState([]);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('build');
  const [frequency, setFrequency] = useState('daily');

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    async function loadHabits() {
      try {
        setHabits(await getHabits());
      } catch (err) {
        setError(err.message);
      }
    }

    loadHabits();
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  async function handleSubmit(event) {
    event.preventDefault();
    if (!title.trim()) return;

    try {
      const newHabit = await createHabit(title, type, frequency);
      setHabits((current) => [...current, newHabit]);
      setTitle('');
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handlePress(habit) {
  try {
    const updated = await pressHabit(habit.id);
    setHabits((current) =>
      current.map((h) => (h.id === updated.id ? updated : h))
    );
    setError(null);
  } catch (err) {
    setError(err.message);
  }
}

  async function handleDelete(id) {
    try {
      await deleteHabit(id);
      setHabits((current) => current.filter((habit) => habit.id !== id));
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={{ paddingBottom: '80px' }}>
      <Navbar isLoggedIn={!!token} onLogout={handleLogout} />

      <div style={{ maxWidth: '600px', margin: '40px auto', padding: '0 20px' }}>
        <h1>Habits 🌱</h1>

        <HabitForm
          title={title}
          onTitleChange={setTitle}
          type={type}
          onTypeChange={setType}
          frequency={frequency}
          onFrequencyChange={setFrequency}
          onSubmit={handleSubmit}
        />

        {error && <p style={{ color: 'red' }}>Error: {error}</p>}

        <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left' }}>
          {habits.map((habit) => (
            <HabitItem key={habit.id} habit={habit} onPress={handlePress} onDelete={handleDelete} />
          ))}
        </ul>
      </div>

      <BottomNav />
    </div>
  );
}