import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../server.js';

test('allows admin user to view session', async () => {
  const agent = request.agent(app);
  await agent.post('/debug/login').send({ role: 'admin' });

  const res = await agent.get('/debug/session');

  assert.equal(res.status, 200);
  assert.equal(res.body.session.user.role, 'admin');
});

test('denies non-admin user', async () => {
  const agent = request.agent(app);
  await agent.post('/debug/login').send({ role: 'user' });

  const res = await agent.get('/debug/session');

  assert.equal(res.status, 403);
});
