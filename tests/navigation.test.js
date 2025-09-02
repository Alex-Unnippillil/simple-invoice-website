const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

const app = require('../server');

test('landing page contains login links', async () => {
  const res = await request(app).get('/');
  assert.equal(res.status, 200);
  assert.match(res.text, /href="\/tenant\/login.html"/);
  assert.match(res.text, /href="\/admin\/login.html"/);
});

test('tenant login page accessible', async () => {
  const res = await request(app).get('/tenant/login.html');
  assert.equal(res.status, 200);
});

test('admin login page accessible', async () => {
  const res = await request(app).get('/admin/login.html');
  assert.equal(res.status, 200);
});
