import { Router } from 'express';
import pool from '../db.js';
import jwt from 'jsonwebtoken';
import { getPeriod, settleHabit } from '../streaks.js';

const router = Router();
const COLUMNS =
  'id, title, type, frequency, count, streak, total_attempts, successful_periods, last_period, period_marked, created_at';

const TYPES = ['build', 'quit'];
const FREQUENCIES = ['daily', 'weekly', 'monthly'];

function toRecord(row) {
  return {
    ...row,
    period_marked: Boolean(row.period_marked),
    // percentage of finished periods that were a success (null until one period has ended)
    success_rate:
      row.total_attempts > 0
        ? Math.round((row.successful_periods / row.total_attempts) * 100)
        : null
  };
}

// Auth Middleware
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

// Settles a habit (counts finished periods) and saves the result if anything changed.
async function settleAndSave(habit) {
  const settled = settleHabit(habit);

  if (settled.last_period !== habit.last_period) {
    await pool.query(
      `UPDATE habits
       SET streak = ?, total_attempts = ?, successful_periods = ?, last_period = ?, period_marked = ?
       WHERE id = ?`,
      [settled.streak, settled.total_attempts, settled.successful_periods, settled.last_period, settled.period_marked, habit.id]
    );
  }

  return settled;
}

// Loads one raw habit row, settled and up to date. Returns null if it doesn't exist.
async function loadSettled(id, userId) {
  const [rows] = await pool.query(`SELECT ${COLUMNS} FROM habits WHERE id = ? AND user_id = ?`, [id, userId]);
  if (rows.length === 0) return null;
  return settleAndSave(rows[0]);
}

// Get all habits
router.get('/', async (req, res) => {
  const [rows] = await pool.query(`SELECT ${COLUMNS} FROM habits WHERE user_id = ? ORDER BY id`, [req.user.id]);
  const settled = await Promise.all(rows.map(settleAndSave));
  res.json(settled.map(toRecord));
});

// Add habit
router.post('/', async (req, res) => {
  const title = req.body?.title;
  const type = req.body?.type ?? 'build';
  const frequency = req.body?.frequency ?? 'daily';

  if (typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }
  if (!TYPES.includes(type)) {
    return res.status(400).json({ error: 'Type must be build or quit' });
  }
  if (!FREQUENCIES.includes(frequency)) {
    return res.status(400).json({ error: 'Frequency must be daily, weekly or monthly' });
  }

  const [result] = await pool.query(
    'INSERT INTO habits (title, type, frequency, last_period, user_id) VALUES (?, ?, ?, ?, ?)',
    [title.trim(), type, frequency, getPeriod(new Date(), frequency), req.user.id]
  );

  const habit = await loadSettled(result.insertId, req.user.id);
  res.status(201).json(toRecord(habit));
});

// Press the habit button: "I did it" (build) or "I slipped" (quit)
router.post('/:id/press', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: 'Invalid parameters' });
  }

  const habit = await loadSettled(id, req.user.id);
  if (!habit) return res.status(404).json({ error: 'Habit not found' });

  habit.count += 1;
  habit.period_marked = true;
  if (habit.type === 'quit') habit.streak = 0; // a slip ends the streak immediately

  await pool.query(
    'UPDATE habits SET count = ?, streak = ?, period_marked = ? WHERE id = ? AND user_id = ?',
    [habit.count, habit.streak, habit.period_marked, id, req.user.id]
  );

  res.json(toRecord(habit));
});

// Delete habit
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const [result] = await pool.query('DELETE FROM habits WHERE id = ? AND user_id = ?', [id, req.user.id]);
  if (result.affectedRows === 0) return res.status(404).json({ error: 'Habit not found' });

  res.sendStatus(204);
});

export default router;