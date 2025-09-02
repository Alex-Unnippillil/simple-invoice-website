const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, '..', 'integration_logs.db');
try { fs.unlinkSync(dbPath); } catch {}

const { sendIntegration, retryIntegration } = require('../integrationService');
const db = require('../db');
const test = require('node:test');
const assert = require('node:assert');

function getRow(requestId) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM integration_logs WHERE request_id = ?', [requestId], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

test('retry uses same request id and increments attempt count', async () => {
  const payload = { foo: 'bar' };
  let calls = 0;
  global.fetch = async () => {
    calls += 1;
    return {
      ok: calls > 1,
      text: async () => `response-${calls}`,
    };
  };
  const first = await sendIntegration(payload, 'req1');
  assert.equal(first.status, 'failed');
  let row = await getRow('req1');
  assert.equal(row.attempt_count, 1);
  await retryIntegration(first.id);
  row = await getRow('req1');
  assert.equal(row.attempt_count, 2);
  assert.equal(row.status, 'success');
  assert.equal(calls, 2);
});
