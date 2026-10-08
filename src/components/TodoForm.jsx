function TodoForm({ title, onTitleChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        value={title}
        onChange={(event) => onTitleChange(event.target.value)}
        placeholder="New task"
      />
      <button type="submit">Add</button>
    </form>
  );
}

export default TodoForm;