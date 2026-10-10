import { useEffect, useState } from 'react';
import { createTodo, deleteTodo, getTodos, setTodoCompleted } from '../api/todos.js';
import TodoForm from '../components/TodoForm.jsx';
import TodoList from '../components/TodoList.jsx';
import Navbar from '../components/Navbar.jsx';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Protect the route: if no token, redirect to login
    if (!token) {
      navigate('/login');
      return;
    }

    async function loadTodos() {
      try {
        setTodos(await getTodos());
      } catch (err) {
        setError(err.message);
      }
    }

    loadTodos();
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const newTodo = await createTodo(title);
      setTodos((current) => [...current, newTodo]);
      setTitle('');
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleToggle(todo) {
    try {
      const updated = await setTodoCompleted(todo.id, !todo.completed);
      setTodos((current) =>
        current.map((t) => (t.id === updated.id ? updated : t))
      );
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteTodo(id);
      setTodos((current) => current.filter((todo) => todo.id !== id));
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <Navbar isLoggedIn={!!token} onLogout={handleLogout} />

      <div style={{ maxWidth: '600px', margin: '40px auto', padding: '0 20px' }}>
        <h1>My Dashboard</h1>

        <TodoForm title={title} onTitleChange={setTitle} onSubmit={handleSubmit} />

        {error && <p style={{ color: 'red' }}>Error: {error}</p>}

        <TodoList todos={todos} onToggle={handleToggle} onDelete={handleDelete} />
      </div>
    </div>
  );
}