const request = require('supertest');
const app = require('../server');

describe('GET /tenant/invoices', () => {
  it('renders invoice list', async () => {
    const res = await request(app).get('/tenant/invoices');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Invoices');
    expect(res.text).toContain('INV-1001');
  });

  it('supports status filter', async () => {
    const res = await request(app).get('/tenant/invoices?status=overdue');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('overdue');
    expect(res.text).not.toContain('<td>pending</td>');
  });

  it('supports pagination', async () => {
    const res = await request(app).get('/tenant/invoices?page=2');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('INV-1006');
    expect(res.text).not.toContain('INV-1001');
  });

  it('supports date range filtering', async () => {
    const res = await request(app).get('/tenant/invoices?from=2024-04-01&to=2024-04-30');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('2024-04-12');
    expect(res.text).not.toContain('2024-03-15');
  });
});
