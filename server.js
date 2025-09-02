const express = require('express');
const fs = require('fs');
const path = require('path');
const webPush = require('web-push');

const app = express();
app.use(express.static('public'));
app.use(express.json());

const vapidFile = path.join(__dirname, 'config', 'vapid.json');
const subsFile = path.join(__dirname, 'config', 'subscriptions.json');

function loadVapid() {
  const keys = JSON.parse(fs.readFileSync(vapidFile));
  webPush.setVapidDetails('mailto:admin@example.com', keys.publicKey, keys.privateKey);
  return keys.publicKey;
}

function loadSubs() {
  try {
    return JSON.parse(fs.readFileSync(subsFile));
  } catch {
    return [];
  }
}

function saveSubs(subs) {
  fs.mkdirSync(path.dirname(subsFile), { recursive: true });
  fs.writeFileSync(subsFile, JSON.stringify(subs, null, 2));
}

const publicKey = loadVapid();

app.get('/api/push/public-key', (req, res) => {
  res.json({ key: publicKey });
});

app.post('/api/push/subscribe', (req, res) => {
  const subs = loadSubs();
  subs.push(req.body);
  saveSubs(subs);
  res.json({ ok: true });
});

app.post('/api/push/unsubscribe', (req, res) => {
  const subs = loadSubs().filter(s => s.endpoint !== req.body.endpoint);
  saveSubs(subs);
  res.json({ ok: true });
});

app.post('/api/push/test', async (req, res) => {
  const subs = loadSubs();
  const payload = JSON.stringify({ title: 'Test', body: 'Hello from admin panel' });
  await Promise.all(subs.map(s => webPush.sendNotification(s, payload).catch(() => {})));
  res.json({ sent: subs.length });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Server running on', port));
