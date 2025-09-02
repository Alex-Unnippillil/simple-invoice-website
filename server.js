const express = require('express');
const path = require('path');
const audit = require('./auditLog');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const errors = [];

function registerError(envelopeId, status) {
  const message = `Envelope ${envelopeId} ${status}`;
  errors.push({ envelopeId, status, message });
  audit.write(`error: ${message}`);
}

app.post('/webhook', (req, res) => {
  const { envelopeId, status } = req.body;
  if (status === 'expired' || status === 'declined') {
    registerError(envelopeId, status);
  }
  res.sendStatus(200);
});

app.post('/check-envelope', (req, res) => {
  const { envelopeId, status } = req.body;
  if (status === 'expired' || status === 'declined') {
    registerError(envelopeId, status);
  }
  res.json({ envelopeId, status });
});

app.get('/errors', (req, res) => {
  res.json(errors);
});

app.post('/resend', (req, res) => {
  const { envelopeId } = req.body;
  const idx = errors.findIndex(e => e.envelopeId === envelopeId);
  if (idx >= 0) {
    audit.write(`resend requested for envelope ${envelopeId}`);
    errors.splice(idx, 1);
  }
  res.sendStatus(200);
});

app.post('/reinvite', (req, res) => {
  const { envelopeId } = req.body;
  const idx = errors.findIndex(e => e.envelopeId === envelopeId);
  if (idx >= 0) {
    audit.write(`reinvite requested for envelope ${envelopeId}`);
    errors.splice(idx, 1);
  }
  res.sendStatus(200);
});

app.post('/admin/regenerate-link', (req, res) => {
  const { envelopeId } = req.body;
  const link = `https://example.com/sign/${envelopeId}/${Date.now()}`;
  audit.write(`regenerated link for envelope ${envelopeId}`);
  res.json({ envelopeId, link });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
