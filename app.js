const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const db = new sqlite3.Database('data.db');

app.use(express.json());

// initialize tables
const initDb = () => {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS listings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      status TEXT,
      date TEXT,
      amount REAL,
      property TEXT,
      organization_id INTEGER
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS views (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      filters TEXT,
      user_id INTEGER,
      organization_id INTEGER,
      shared INTEGER DEFAULT 0
    )`);

    // Seed some sample listings if table is empty
    db.get('SELECT COUNT(*) as count FROM listings', (err, row) => {
      if (!err && row.count === 0) {
        const seed = db.prepare('INSERT INTO listings (status, date, amount, property, organization_id) VALUES (?, ?, ?, ?, ?)');
        seed.run('paid', '2023-01-01', 1000, 'A1', 1);
        seed.run('due', '2023-02-01', 1200, 'A1', 1);
        seed.run('paid', '2023-03-15', 800, 'B2', 1);
        seed.finalize();
      }
    });
  });
};

initDb();

// Helper to filter listings
function buildListingsQuery(params) {
  let query = 'SELECT * FROM listings WHERE 1=1';
  const values = [];
  if (params.status) {
    query += ' AND status = ?';
    values.push(params.status);
  }
  if (params.startDate) {
    query += ' AND date >= ?';
    values.push(params.startDate);
  }
  if (params.endDate) {
    query += ' AND date <= ?';
    values.push(params.endDate);
  }
  if (params.minAmount) {
    query += ' AND amount >= ?';
    values.push(params.minAmount);
  }
  if (params.maxAmount) {
    query += ' AND amount <= ?';
    values.push(params.maxAmount);
  }
  if (params.property) {
    query += ' AND property = ?';
    values.push(params.property);
  }
  if (params.organization_id) {
    query += ' AND organization_id = ?';
    values.push(params.organization_id);
  }
  return { query, values };
}

app.get('/listings', (req, res) => {
  const { query, values } = buildListingsQuery(req.query);
  db.all(query, values, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Save view
app.post('/views', (req, res) => {
  const { name, filters, user_id, organization_id, shared } = req.body;
  if (!name || !filters || !user_id || !organization_id) {
    return res.status(400).json({ error: 'name, filters, user_id and organization_id required' });
  }
  const stmt = db.prepare('INSERT INTO views (name, filters, user_id, organization_id, shared) VALUES (?, ?, ?, ?, ?)');
  stmt.run(name, JSON.stringify(filters), user_id, organization_id, shared ? 1 : 0, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

// Get views for user or organization
app.get('/views', (req, res) => {
  const { user_id, organization_id } = req.query;
  if (!organization_id) return res.status(400).json({ error: 'organization_id required' });
  const values = [organization_id];
  let query = 'SELECT * FROM views WHERE organization_id = ? AND (shared = 1';
  if (user_id) {
    query += ' OR user_id = ?';
    values.push(user_id);
  }
  query += ')';
  db.all(query, values, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Retrieve listings via view
app.get('/views/:id/listings', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM views WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'view not found' });
    const filters = JSON.parse(row.filters);
    const { query, values } = buildListingsQuery(filters);
    db.all(query, values, (err2, rows) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json(rows);
    });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

