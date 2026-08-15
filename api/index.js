const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Memory storage sederhana untuk pengujian
let users = [];
let submissions = [];
let withdrawals = [];

// Endpoint Auth Register
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  const user = { id: Date.now(), name, email, balance: 0 };
  users.push(user);
  res.json({ token: 'dummy-jwt-token', user });
});

// Endpoint Auth Login
app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  const user = users.find(u => u.email === email) || { id: 1, name: 'User Demo', email, balance: 15000 };
  res.json({ token: 'dummy-jwt-token', user });
});

// Profile User
app.get('/api/user/me', (req, res) => {
  const user = users[0] || { id: 1, name: 'User Demo', email: 'demo@mail.com', balance: 15000 };
  res.json(user);
});

// Submit Bulk Accounts
app.post('/api/submissions/bulk', (req, res) => {
  const { rawText } = req.body;
  if (!rawText) return res.status(400).json({ error: 'Data email kosong' });

  const lines = rawText.split('\n').filter(l => l.trim().length > 0);
  lines.forEach(line => {
    const parts = line.split('|');
    submissions.unshift({
      id: Date.now() + Math.random(),
      email: parts[0]?.trim() || 'unknown',
      recovery_email: parts[2]?.trim() || '-',
      price: 1500,
      status: 'approved',
      reason: 'IMAP Authentication Success',
      created_at: new Date()
    });
  });

  res.json({ message: `${lines.length} akun berhasil dikirim untuk diproses!` });
});

// Get Submissions History
app.get('/api/submissions', (req, res) => {
  res.json(submissions);
});

// Submit Withdrawal
app.post('/api/withdrawals', (req, res) => {
  const { amount, payment_method, account_number } = req.body;
  withdrawals.push({ amount, payment_method, account_number, status: 'pending', created_at: new Date() });
  res.json({ message: 'Pengajuan penarikan saldo berhasil terkirim!' });
});

module.exports = app;
