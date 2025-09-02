const express = require('express');
const path = require('path');
const { initDb, addStatus, getStatuses } = require('./database');
const pinoHttp = require('pino-http');
const logger = require('./lib/logger');
const { randomUUID } = require('crypto');

const app = express();

app.use(
  pinoHttp({
    logger,
    genReqId: (req) => req.headers['x-request-id'] || randomUUID(),
    customProps: (req) => ({
      requestId: req.id,
      userId: req.headers['x-user-id'] || null
    })
  })
);

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
