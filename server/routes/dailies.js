import { Router } from 'express';
import pool from '../db.js';
import jwt from 'jsonwebtoken';

const router = Router();
const COLUMNS = 'id, title, completed, created_at';

function toRecord(row) {
  return { ...row, completed: Boolean(row.completed) };
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token required.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token.' });
    req.user = { id: decoded.sub };
    next();
  });
}

router.use(authenticateToken);

async function getById(id, userId) {
  const [rows] = await pool.query(`SELECT ${COLUMNS} FROM dailies WHERE id = ? AND user_id = ?`, [id, userId]);
  return rows.length > 0 ? toRecord(rows[0]) : null;
}

router.get('/', async (req, res) => {
  const [rows] = await pool.query(`SELECT ${COLUMNS} FROM dailies WHERE user_id = ? ORDER BY id`, [req.user.id]);
  res.json(rows.map(toRecord));
});

router.post('/', async (req, res) => {
  const title = req.body?.title;
  if (typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  const [result] = await pool.query('INSERT INTO dailies (title, user_id) VALUES (?, ?)', [title.trim(), req.user.id]);
  res.status(201).json(await getById(result.insertId, req.user.id));
});

router.patch('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const completed = req.body?.completed;

  if (!Number.isInteger(id) || typeof completed !== 'boolean') {
    return res.status(400).json({ error: 'Invalid parameters' });
  }

  const [result] = await pool.query('UPDATE dailies SET completed = ? WHERE id = ? AND user_id = ?', [completed, id, req.user.id]);
  if (result.affectedRows === 0) return res.status(404).json({ error: 'Daily task not found' });

  res.json(await getById(id, req.user.id));
});

router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const [result] = await pool.query('DELETE FROM dailies WHERE id = ? AND user_id = ?', [id, req.user.id]);
  if (result.affectedRows === 0) return res.status(404).json({ error: 'Daily task not found' });

  res.sendStatus(204);
});

export default router;