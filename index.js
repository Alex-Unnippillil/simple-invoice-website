const express = require('express');
const payments = require('./payments.json');

const app = express();

app.get('/admin/payments', (req, res) => {
  const rows = payments
    .map(
      (p) => `<li><a href="/admin/invoices/${p.invoiceId}">Invoice ${p.invoiceId}</a> - <code>${p.paymentIntentId}</code></li>`
    )
    .join('');
  res.send(`<h1>Payments</h1><ul>${rows}</ul>`);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
