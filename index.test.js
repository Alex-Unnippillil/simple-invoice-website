const request = require('supertest');
const app = require('./index');

describe('payment flow routes', () => {
  test('redirects to success on successful confirmation', async () => {
    const res = await request(app).get('/tenant/pay/confirm?status=success');
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/tenant/pay/success');
  });

  test('redirects to cancel on failed confirmation', async () => {
    const res = await request(app).get('/tenant/pay/confirm?status=cancel');
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/tenant/pay/cancel');
  });

  test('serves success message', async () => {
    const res = await request(app).get('/tenant/pay/success');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Payment processed successfully');
  });

  test('serves cancel message', async () => {
    const res = await request(app).get('/tenant/pay/cancel');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Payment was cancelled or failed');
  });
});
