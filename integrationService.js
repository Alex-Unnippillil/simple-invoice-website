const db = require('./db');
const { v4: uuidv4 } = require('uuid');

function sendIntegration(payload, requestId = uuidv4()) {
  const now = new Date().toISOString();
  return new Promise((resolve) => {
    db.get('SELECT * FROM integration_logs WHERE request_id = ?', [requestId], async (err, row) => {
      if (row && row.status === 'success') {
        return resolve({ status: 'success', response: row.response, requestId, id: row.id });
      }
      let resText = '';
      let status = 'failed';
      try {
        const res = await fetch('https://httpbin.org/post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Idempotency-Key': requestId,
          },
          body: JSON.stringify(payload),
        });
        resText = await res.text();
        status = res.ok ? 'success' : 'failed';
      } catch (e) {
        resText = e.message;
        status = 'failed';
      }
      if (row) {
        db.run(
          'UPDATE integration_logs SET response = ?, status = ?, attempt_count = ?, updated_at = ? WHERE request_id = ?',
          [resText, status, (row.attempt_count || 0) + 1, now, requestId],
          function () {
            resolve({ status, response: resText, requestId, id: row.id });
          }
        );
      } else {
        db.run(
          'INSERT INTO integration_logs (request_id, payload, response, status, attempt_count, created_at, updated_at) VALUES (?,?,?,?,1,?,?)',
          [requestId, JSON.stringify(payload), resText, status, now, now],
          function () {
            resolve({ status, response: resText, requestId, id: this.lastID });
          }
        );
      }
    });
  });
}

function listFailures() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM integration_logs WHERE status = "failed" ORDER BY updated_at DESC', (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function retryIntegration(id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM integration_logs WHERE id = ?', [id], (err, row) => {
      if (err) return reject(err);
      if (!row) return reject(new Error('Not found'));
      const payload = JSON.parse(row.payload);
      sendIntegration(payload, row.request_id).then(resolve).catch(reject);
    });
  });
}

module.exports = { sendIntegration, listFailures, retryIntegration };
