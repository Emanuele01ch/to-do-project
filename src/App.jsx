import { useEffect, useState } from 'react';
import { createTodo, deleteTodo, getTodos, setTodoCompleted } from './api/todos.js';
import TodoForm from './components/TodoForm.jsx';
import TodoList from './components/TodoList.jsx';
import { Link } from 'react-router-dom';

function App() {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(null);

  const [title, setTitle] = useState('');

  useEffect(() => {
    async function loadTodos() {
      try {
        setTodos(await getTodos());
      } catch (err) {
        setError(err.message);
      }
    }

    loadTodos();
  }, []);

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
      <h1>My To-Do App</h1>
      <p>
        <Link to="/signup">
          <button type="button">Sign up</button>
        </Link>{' '}
        <Link to="/login">
          <button type="button">Log in</button>
        </Link>
      </p>
      <TodoForm title={title} onTitleChange={setTitle} onSubmit={handleSubmit} />

      {error && <p>Error: {error}</p>}

      <TodoList todos={todos} onToggle={handleToggle} onDelete={handleDelete} />
    </div>
  );
}

export default App;