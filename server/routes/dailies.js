import { Router } from 'express';
import pool from '../db.js';
import jwt from 'jsonwebtoken';
import { getPeriod, settleDaily } from '../streaks.js';

const router = Router();
const COLUMNS = 'id, title, completed, streak, total_attempts, successful_periods, last_period, created_at';

function toRecord(row) {
  return {
    ...row,
    completed: Boolean(row.completed),
    // percentage of finished days that were a success (null until one day has ended)
    success_rate:
      row.total_attempts > 0
        ? Math.round((row.successful_periods / row.total_attempts) * 100)
        : null
  };
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

// Settles a daily task (handles days that ended) and saves the result if the day changed.
async function settleAndSave(daily) {
  const settled = settleDaily(daily);

  if (settled.last_period !== daily.last_period) {
        await pool.query(
      `UPDATE dailies
       SET streak = ?, total_attempts = ?, successful_periods = ?, completed = ?, last_period = ?
       WHERE id = ?`,
      [settled.streak, settled.total_attempts, settled.successful_periods, settled.completed, settled.last_period, daily.id]
    );
  }

  return settled;
}

// Loads one daily task, up to date. Returns null if it doesn't exist.
async function loadSettled(id, userId) {
  const [rows] = await pool.query(`SELECT ${COLUMNS} FROM dailies WHERE id = ? AND user_id = ?`, [id, userId]);
  if (rows.length === 0) return null;
  return settleAndSave(rows[0]);
}

router.get('/', async (req, res) => {
  const [rows] = await pool.query(`SELECT ${COLUMNS} FROM dailies WHERE user_id = ? ORDER BY id`, [req.user.id]);
  const settled = await Promise.all(rows.map(settleAndSave));
  res.json(settled.map(toRecord));
});

router.post('/', async (req, res) => {
  const title = req.body?.title;
  if (typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  const [result] = await pool.query(
    'INSERT INTO dailies (title, last_period, user_id) VALUES (?, ?, ?)',
    [title.trim(), getPeriod(new Date(), 'daily'), req.user.id]
  );

  const daily = await loadSettled(result.insertId, req.user.id);
  res.status(201).json(toRecord(daily));
});

router.patch('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const completed = req.body?.completed;

  if (!Number.isInteger(id) || typeof completed !== 'boolean') {
    return res.status(400).json({ error: 'Invalid parameters' });
  }

  // Settle first, so the toggle applies to today's state and not to yesterday's
  const daily = await loadSettled(id, req.user.id);
  if (!daily) return res.status(404).json({ error: 'Daily task not found' });

  await pool.query('UPDATE dailies SET completed = ? WHERE id = ? AND user_id = ?', [completed, id, req.user.id]);
  daily.completed = completed;

  res.json(toRecord(daily));
});

router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const [result] = await pool.query('DELETE FROM dailies WHERE id = ? AND user_id = ?', [id, req.user.id]);
  if (result.affectedRows === 0) return res.status(404).json({ error: 'Daily task not found' });

  res.sendStatus(204);
});

export default router;