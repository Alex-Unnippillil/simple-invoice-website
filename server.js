const express = require('express');
const path = require('path');
const { initDb, addStatus, getStatuses } = require('./database');
const { runChecks } = require('./services/statusCheck');

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

// Health check endpoint
app.get('/api/status', async (_req, res) => {
  const result = await runChecks();
  res.status(result.ok ? 200 : 503).json(result);
});

// Only start server if this file is executed directly
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
