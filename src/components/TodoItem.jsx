function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li style={{ opacity: todo.completed ? 0.5 : 1 }}>
      <label>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo)}
        />{' '}
        <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
          {todo.title}
        </span>
      </label>{' '}
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </li>
  );
}

export default TodoItem;