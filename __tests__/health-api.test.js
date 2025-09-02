/** @jest-environment node */
const request = require('supertest');
const app = require('../server');

describe('GET /api/health', () => {
  it('returns boolean status for services', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(typeof res.body.database).toBe('boolean');
    expect(typeof res.body.storage).toBe('boolean');
  });
});
