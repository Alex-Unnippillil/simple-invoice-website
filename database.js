const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('data.db');

function initDb() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS lease_status (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lease_id TEXT,
      status TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lease_id TEXT,
      event TEXT,
      experiment_id TEXT,
      variant_id TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  });
}

function addStatus(leaseId, status) {
  db.run(
    'INSERT INTO lease_status (lease_id, status) VALUES (?, ?)',
    [leaseId, status]
  );
  logEvent(leaseId, `Status set to ${status}`);
}

function getStatuses(leaseId, cb) {
  db.all(
    'SELECT status, timestamp FROM lease_status WHERE lease_id = ? ORDER BY id',
    [leaseId],
    (err, rows) => cb(err, rows)
  );
}

function logEvent(leaseId, event, experimentId = null, variantId = null) {
  db.run(
    'INSERT INTO events (lease_id, event, experiment_id, variant_id) VALUES (?, ?, ?, ?)',
    [leaseId, event, experimentId, variantId]
  );
}

function getConversionMetrics(experimentId, cb) {
  db.all(
    'SELECT variant_id, COUNT(*) as conversions FROM events WHERE experiment_id = ? AND event = ? GROUP BY variant_id',
    [experimentId, 'conversion'],
    (err, rows) => cb(err, rows)
  );
}

module.exports = {
  initDb,
  addStatus,
  getStatuses,
  logEvent,
  getConversionMetrics,
};
