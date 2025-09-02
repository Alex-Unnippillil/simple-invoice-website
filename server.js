const express = require('express');
const path = require('path');

const app = express();

// configure view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

// sample receipts data
const receipts = [
  { id: 1, date: '2024-01-01', amount: 1200, invoiceUrl: '/invoices/1' },
  { id: 2, date: '2024-02-01', amount: 1200, invoiceUrl: '/invoices/2' }
];

// route for receipts page
app.get('/tenant/receipts', (req, res) => {
  res.render('receipts', { receipts });
});

// placeholder invoice routes
app.get('/invoices/:id', (req, res) => {
  res.send(`<h1>Invoice ${req.params.id}</h1>`);
});

app.get('/invoices/:id.pdf', (req, res) => {
  res.setHeader('Content-Type', 'application/pdf');
  res.send(`PDF content for invoice ${req.params.id}`);
});

app.get('/', (req, res) => res.redirect('/tenant/receipts'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

