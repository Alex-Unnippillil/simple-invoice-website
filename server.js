const express = require('express');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const { initDb, addStatus, getStatuses } = require('./database');

const app = express();
initDb();

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

// Simple health check endpoint to verify service states
app.get('/api/health', (_req, res) => {
  const result = { database: false, storage: false };

  // Check database by performing a trivial query
  const db = new sqlite3.Database('data.db');
  db.get('SELECT 1', (err) => {
    result.database = !err;
    db.close();

    // Check storage by verifying the storage directory is readable
    fs.access(path.join(__dirname, 'storage'), fs.constants.R_OK, (fsErr) => {
      result.storage = !fsErr;
      res.json(result);
    });
  });
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
