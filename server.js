const express = require('express');
const path = require('path');
const session = require('express-session');
const { initDb, addStatus, getStatuses } = require('./database');

const app = express();
initDb();

const sessionStore = new session.MemoryStore();
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })
);
app.set('sessionStore', sessionStore);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Webhook endpoint for provider to send status updates
app.post('/webhook', (req, res) => {
  const { leaseId, status } = req.body;
  if (!leaseId || !status) {
    return res.status(400).json({ error: 'leaseId and status required' });
  }
  addStatus(leaseId, status);
  res.json({ ok: true });
});

// Endpoint to retrieve status history
app.get('/lease/:id/status', (req, res) => {
  const leaseId = req.params.id;
  getStatuses(leaseId, (err, rows) => {
    if (err) return res.status(500).json({ error: 'db error' });
    res.json(rows);
  });
});

// Debug route to set the current user's role for testing purposes.
app.post('/debug/login', (req, res) => {
  const { role } = req.body;
  req.session.user = { role };
  res.json({ ok: true });
});

// Debug endpoint to view session information. Restricted to admin users.
app.get('/debug/session', (req, res) => {
  const user = req.session.user;
  if (!user || user.role !== 'admin') {
    return res.sendStatus(403);
  }
  res.json({ id: req.sessionID, session: req.session });
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
