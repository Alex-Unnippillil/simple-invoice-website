const express = require('express');
const path = require('path');
const PDFDocument = require('pdfkit');

const invoices = require('./data/invoices.json');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/invoice/:id', (req, res) => {
  const invoice = invoices[req.params.id];
  if (!invoice) return res.status(404).send('Invoice not found');
  res.render('invoice', { invoice });
});

app.get('/invoice/:id/pdf', (req, res) => {
  const invoice = invoices[req.params.id];
  if (!invoice) return res.status(404).send('Invoice not found');

  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice.id}.pdf`);
  doc.pipe(res);

  doc.fontSize(20).text(`Invoice ${invoice.id}`, { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Customer: ${invoice.customer}`);
  doc.text(`Date: ${invoice.date}`);
  doc.moveDown();
  invoice.items.forEach(item => {
    doc.text(`${item.description}: $${item.amount.toFixed(2)}`);
  });
  const total = invoice.items.reduce((sum, item) => sum + item.amount, 0);
  doc.moveDown();
  doc.text(`Total: $${total.toFixed(2)}`);

  doc.end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
