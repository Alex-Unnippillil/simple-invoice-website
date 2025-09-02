const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());

const dataFile = path.join(__dirname, 'data', 'invoices.json');

function readInvoices() {
  try {
    const data = fs.readFileSync(dataFile, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function writeInvoices(invoices) {
  fs.writeFileSync(dataFile, JSON.stringify(invoices, null, 2));
}

app.post('/api/invoices', (req, res) => {
  const invoices = readInvoices();
  const { client, amount, status } = req.body;
  const newInvoice = {
    id: Date.now().toString(),
    client,
    amount,
    status: status || 'pending',
    deleted: false,
  };
  invoices.push(newInvoice);
  writeInvoices(invoices);
  res.status(201).json(newInvoice);
});

app.get('/api/invoices', (req, res) => {
  const invoices = readInvoices().filter(inv => !inv.deleted);
  res.json(invoices);
});

app.get('/api/invoices/:id', (req, res) => {
  const invoices = readInvoices();
  const invoice = invoices.find(inv => inv.id === req.params.id && !inv.deleted);
  if (!invoice) return res.sendStatus(404);
  res.json(invoice);
});

app.patch('/api/invoices/:id', (req, res) => {
  const invoices = readInvoices();
  const invoice = invoices.find(inv => inv.id === req.params.id && !inv.deleted);
  if (!invoice) return res.sendStatus(404);
  Object.assign(invoice, req.body);
  writeInvoices(invoices);
  res.json(invoice);
});

app.delete('/api/invoices/:id', (req, res) => {
  const invoices = readInvoices();
  const invoice = invoices.find(inv => inv.id === req.params.id && !inv.deleted);
  if (!invoice) return res.sendStatus(404);
  invoice.deleted = true;
  writeInvoices(invoices);
  res.sendStatus(204);
});

app.use(express.static('public'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
