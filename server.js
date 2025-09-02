const express = require('express');
const path = require('path');
const { initDb, addStatus, getStatuses } = require('./database');

// Optional Redis client - only used when a Redis URL is provided
let Redis;
try {
  Redis = require('ioredis');
} catch (e) {
  // ioredis not installed; Redis-backed limiter will be disabled
}

const app = express();
initDb();

// Rate limiter configuration
const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 60_000; // 1 minute
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX, 10) ||
  (process.env.NODE_ENV === 'development' ? 5 : 100);

let redisClient;
if (process.env.REDIS_URL && Redis) {
  redisClient = new Redis(process.env.REDIS_URL);
}

const memoryStore = new Map();

async function rateLimiter(req, res, next) {
  const key = req.ip;
  const now = Date.now();

  try {
    if (redisClient) {
      const ttl = await redisClient.ttl(key);
      const count = await redisClient.incr(key);
      if (ttl === -1) {
        await redisClient.pexpire(key, WINDOW_MS);
      }
      if (count > MAX_REQUESTS) {
        res.set('Retry-After', (ttl > 0 ? ttl : Math.ceil(WINDOW_MS / 1000)).toString());
        return res.status(429).send('Too Many Requests');
      }
    } else {
      const entry = memoryStore.get(key) || { count: 0, start: now };
      if (now - entry.start > WINDOW_MS) {
        entry.count = 1;
        entry.start = now;
      } else {
        entry.count += 1;
      }
      memoryStore.set(key, entry);
      if (entry.count > MAX_REQUESTS) {
        const retry = Math.ceil((WINDOW_MS - (now - entry.start)) / 1000);
        res.set('Retry-After', retry.toString());
        return res.status(429).send('Too Many Requests');
      }
    }
    return next();
  } catch (err) {
    return next(err);
  }
}

app.use(express.json());
app.use(rateLimiter);
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
  console.log(`Server running on port ${PORT}`);
});
