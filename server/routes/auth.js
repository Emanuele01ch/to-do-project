import { Router } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import pool from '../db.js';
import { sendVerificationEmail } from '../mailer.js';

const router = Router();

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_BYTES = 72;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

async function createVerificationToken(userId) {
  const token = crypto.randomBytes(32).toString('hex');
  await pool.query(
    'INSERT INTO email_verifications (user_id, token_hash, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 24 HOUR))',
    [userId, hashToken(token)]
  );
  return token;
}

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (typeof email !== 'string' || !EMAIL_PATTERN.test(email.trim())) {
      return res.status(400).json({ error: 'A valid email is required' });
    }
    if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
      return res
        .status(400)
        .json({ error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` });
    }
    if (Buffer.byteLength(password) > MAX_PASSWORD_BYTES) {
      return res.status(400).json({ error: 'Password is too long' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES (?, ?)',
      [cleanEmail, passwordHash]
    );

    const token = await createVerificationToken(result.insertId);
    const link = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

    try {
      await sendVerificationEmail(cleanEmail, link);
    } catch (mailErr) {
      // The account exists, so we don't fail the whole registration
      console.error('Could not send verification email:', mailErr);
    }

    res.status(201).json({ message: 'Account created. Check your email to verify it.' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Email already registered' });
    }
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;

    if (typeof token !== 'string' || token.length === 0) {
      return res.status(400).json({ error: 'Token is required' });
    }

    const [rows] = await pool.query(
      'SELECT user_id FROM email_verifications WHERE token_hash = ? AND expires_at > NOW()',
      [hashToken(token)]
    );

    if (rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired link' });
    }

    const userId = rows[0].user_id;
    await pool.query('UPDATE users SET email_verified = TRUE WHERE id = ?', [userId]);
    await pool.query('DELETE FROM email_verifications WHERE user_id = ?', [userId]);

    res.json({ message: 'Email verified' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

export default router;