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

function logEvent(leaseId, event) {
  db.run(
    'INSERT INTO events (lease_id, event) VALUES (?, ?)',
    [leaseId, event]
  );
}

module.exports = {
  initDb,
  addStatus,
  getStatuses,
  logEvent,
};
