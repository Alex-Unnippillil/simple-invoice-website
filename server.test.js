const request = require('supertest');

jest.mock('./notifications', () => ({
  sendNotification: jest.fn(),
}));

const { sendNotification } = require('./notifications');
const app = require('./server');

describe('Invoice creation', () => {
  it('sends Invoice ready notification', async () => {
    await request(app)
      .post('/invoices')
      .send({ customerEmail: 'test@example.com' })
      .expect(201);
    expect(sendNotification).toHaveBeenCalledWith(
      'test@example.com',
      'Invoice ready'
    );
  });
});

describe('Stripe webhook', () => {
  it('sends Payment received notification with receipt link', async () => {
    const event = {
      type: 'invoice.payment_succeeded',
      data: { object: { customer_email: 'payer@example.com', invoice_pdf: 'https://example.com/receipt.pdf' } },
    };
    await request(app).post('/webhook/stripe').send(event).expect(200);
    expect(sendNotification).toHaveBeenCalledWith(
      'payer@example.com',
      'Payment received: https://example.com/receipt.pdf'
    );
  });
});
