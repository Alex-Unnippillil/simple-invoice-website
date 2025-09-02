const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../server');
const { checks } = require('../services/statusCheck');

test('reports healthy components', async () => {
  // Ensure default checks succeed
  checks.database = async () => Promise.resolve();
  checks.cache = async () => Promise.resolve();

  const res = await request(app).get('/api/status');
  assert.equal(res.status, 200);
  assert.equal(res.body.ok, true);
  assert.equal(res.body.components.database.ok, true);
  assert.equal(res.body.components.cache.ok, true);
});

test('returns 503 when a component times out', async () => {
  // Make database check hang long enough to trigger timeout
  checks.database = async () => new Promise((resolve) => setTimeout(resolve, 1500));

  const res = await request(app).get('/api/status');
  assert.equal(res.status, 503);
  assert.equal(res.body.ok, false);
  assert.equal(res.body.components.database.ok, false);
  assert.match(res.body.components.database.error, /timeout/);
});
