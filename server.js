const express = require('express');
const { sendNotification } = require('./notifications');

const app = express();
app.use(express.json());

// In-memory store for invoices
const invoices = [];

// Create invoice route
app.post('/invoices', (req, res) => {
  const invoice = req.body;
  invoices.push(invoice);
  if (invoice.customerEmail) {
    sendNotification(invoice.customerEmail, 'Invoice ready');
  }
  res.status(201).json({ message: 'Invoice created' });
});

// Stripe webhook route
app.post('/webhook/stripe', (req, res) => {
  const event = req.body;
  if (event.type === 'invoice.payment_succeeded') {
    const invoice = event.data.object;
    const receiptLink = invoice.invoice_pdf || invoice.hosted_invoice_url || '';
    if (invoice.customer_email) {
      sendNotification(
        invoice.customer_email,
        `Payment received: ${receiptLink}`
      );
    }
  }
  res.json({ received: true });
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
