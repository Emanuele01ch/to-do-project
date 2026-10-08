import { Router } from 'express';
import pool from '../db.js';

const router = Router();

const TODO_COLUMNS = 'id, title, completed, created_at';

// MySQL gives completed as 0/1; the API should give true/false
function toTodo(row) {
  return { ...row, completed: Boolean(row.completed) };
}

// Read one task by id; returns null if it doesn't exist
async function getTodoById(id) {
  const [rows] = await pool.query(
    `SELECT ${TODO_COLUMNS} FROM todos WHERE id = ?`,
    [id]
  );
  return rows.length > 0 ? toTodo(rows[0]) : null;
}

// 1) Show tasks
router.get('/', async (req, res) => {
  const [rows] = await pool.query(
    `SELECT ${TODO_COLUMNS} FROM todos ORDER BY id`
  );
  res.json(rows.map(toTodo));
});

// 2) Add a task
router.post('/', async (req, res) => {
  const title = req.body?.title;

  if (typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  const [result] = await pool.query(
    'INSERT INTO todos (title) VALUES (?)',
    [title.trim()]
  );

  res.status(201).json(await getTodoById(result.insertId));
});

// 3) Delete a task
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  const [result] = await pool.query('DELETE FROM todos WHERE id = ?', [id]);

  if (result.affectedRows === 0) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  res.sendStatus(204);
});

// 4) Mark a task as done / not done
router.patch('/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  const completed = req.body?.completed;

  if (typeof completed !== 'boolean') {
    return res.status(400).json({ error: 'Completed must be true or false' });
  }

  const [result] = await pool.query(
    'UPDATE todos SET completed = ? WHERE id = ?',
    [completed, id]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  res.json(await getTodoById(id));
});

export default router;