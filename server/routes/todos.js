import { Router } from 'express';
import pool from '../db.js';
import jwt from 'jsonwebtoken';

const router = Router();

const TODO_COLUMNS = 'id, title, completed, created_at';

// Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: 'Access token required.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token.' });
    }
    // decoded.sub holds the user id we set during login jwt.sign
    req.user = { id: decoded.sub };
    next();
  });
}

// Apply authentication middleware to all todo routes
router.use(authenticateToken);

// MySQL gives completed as 0/1; convert to true/false
function toTodo(row) {
  return { ...row, completed: Boolean(row.completed) };
}

// Read one task by id and user id (ensuring user owns it)
async function getTodoById(id, userId) {
  const [rows] = await pool.query(
    `SELECT ${TODO_COLUMNS} FROM todos WHERE id = ? AND user_id = ?`,
    [id, userId]
  );
  return rows.length > 0 ? toTodo(rows[0]) : null;
}

// 1) Show tasks for the logged-in user only
router.get('/', async (req, res) => {
  const [rows] = await pool.query(
    `SELECT ${TODO_COLUMNS} FROM todos WHERE user_id = ? ORDER BY id`,
    [req.user.id]
  );
  res.json(rows.map(toTodo));
});

// 2) Add a task for the logged-in user
router.post('/', async (req, res) => {
  const title = req.body?.title;

  if (typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  const [result] = await pool.query(
    'INSERT INTO todos (title, user_id) VALUES (?, ?)',
    [title.trim(), req.user.id]
  );

  res.status(201).json(await getTodoById(result.insertId, req.user.id));
});

// 3) Delete a task (only if it belongs to the user)
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  const [result] = await pool.query(
    'DELETE FROM todos WHERE id = ? AND user_id = ?',
    [id, req.user.id]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  res.sendStatus(204);
});

// 4) Mark a task as done / not done (only if it belongs to the user)
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
    'UPDATE todos SET completed = ? WHERE id = ? AND user_id = ?',
    [completed, id, req.user.id]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  res.json(await getTodoById(id, req.user.id));
});

export default router;