import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import db from '../db.js';
import { sendVerificationEmail } from '../mailer.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    if (password.length < 8 || password.length > 72) {
      return res.status(400).json({ error: 'Password must be between 8 and 72 characters.' });
    }

    // Check if user already exists
    const [existingUsers] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Email is already in use.' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await db.query(
      'INSERT INTO users (email, password_hash, email_verified) VALUES (?, ?, 0)',
      [email, passwordHash]
    );
    const userId = result.insertId;

    // Generate verification token (32 random bytes -> hex string)
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    // Token expires in 24 hours
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await db.query(
      'INSERT INTO email_verifications (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
      [userId, tokenHash, expiresAt]
    );

    // Build full verification link and send email
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const verificationUrl = `${clientUrl}/verify-email?token=${rawToken}`;
    await sendVerificationEmail(email, verificationUrl);

    res.status(201).json({
      message: 'Registration successful. Please check your email to verify your account.'
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error during registration.' });
  }
});

// Verify Email
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Verification token is required.' });
    }

    // Hash the incoming token to match what's stored in DB
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Fetch all rows to inspect what is currently in the table and database time
    const [allRows] = await db.query('SELECT *, NOW() as db_now FROM email_verifications');

    // Find valid token record
    const [records] = await db.query(
      'SELECT * FROM email_verifications WHERE token_hash = ? AND expires_at > NOW()',
      [tokenHash]
    );

    if (records.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired verification token.' });
    }

    const verification = records[0];

    // Mark user as verified
    await db.query('UPDATE users SET email_verified = 1 WHERE id = ?', [verification.user_id]);

    // Clean up the used verification token
    await db.query('DELETE FROM email_verifications WHERE user_id = ?', [verification.user_id]);

    res.json({ message: 'Email verified successfully. You can now log in.' });
  } catch (err) {
    console.error('Verification error:', err);
    res.status(500).json({ error: 'Internal server error during email verification.' });
  }
});

// Resend Verification Email
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    // Find user
    const [users] = await db.query('SELECT id, email_verified FROM users WHERE email = ?', [email]);
    
    // To prevent email enumeration, return success even if user doesn't exist or is already verified
    if (users.length > 0 && users[0].email_verified === 0) {
      const userId = users[0].id;

      // Remove any existing pending verification tokens for this user
      await db.query('DELETE FROM email_verifications WHERE user_id = ?', [userId]);

      // Generate new token
      const rawToken = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await db.query(
        'INSERT INTO email_verifications (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
        [userId, tokenHash, expiresAt]
      );

      const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
      const verificationUrl = `${clientUrl}/verify-email?token=${rawToken}`;
      await sendVerificationEmail(email, verificationUrl);
    }

    res.json({
      message: 'If your email is registered and unverified, a new verification link has been sent.'
    });
  } catch (err) {
    console.error('Resend verification error:', err);
    res.status(500).json({ error: 'Internal server error while resending verification.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = users[0];

    // Check password
    const isPasswordValid = await bcrypt.hash ? await bcrypt.compare(password, user.password_hash) : false;
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Check if email is verified
    if (user.email_verified === 0) {
      return res.status(403).json({ error: 'Please verify your email before logging in.' });
    }

    // Generate JWT
    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, message: 'Logged in successfully.' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error during login.' });
  }
});

export default router;