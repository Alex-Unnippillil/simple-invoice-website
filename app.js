import express from 'express';
import fs from 'fs';
import path from 'path';
import Stripe from 'stripe';

const app = express();
const stripe = new Stripe('sk_test_placeholder');
const dataFile = path.join(process.cwd(), 'data', 'invoices.json');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function loadInvoices() {
  const raw = fs.readFileSync(dataFile);
  return JSON.parse(raw);
}

function saveInvoices(invoices) {
  fs.writeFileSync(dataFile, JSON.stringify(invoices, null, 2));
}

function addNote(invoice, message) {
  invoice.notes.push({ message, timestamp: new Date().toISOString() });
}

app.post('/webhook', (req, res) => {
  const event = req.body;
  if (event.type === 'charge.dispute.created') {
    const chargeId = event.data.object.charge;
    const invoices = loadInvoices();
    const invoice = invoices.find(i => i.charge_id === chargeId);
    if (invoice) {
      invoice.status = 'contested';
      addNote(invoice, 'Dispute created');
      saveInvoices(invoices);
    }
  }
  res.json({ received: true });
});

app.get('/invoice/:id', (req, res) => {
  const invoices = loadInvoices();
  const invoice = invoices.find(i => i.id === req.params.id);
  if (!invoice) return res.status(404).send('Invoice not found');
  res.render('invoice', { invoice });
});

app.post('/invoice/:id/evidence', (req, res) => {
  const invoices = loadInvoices();
  const invoice = invoices.find(i => i.id === req.params.id);
  if (!invoice) return res.status(404).send('Invoice not found');
  invoice.status = 'evidence_submitted';
  addNote(invoice, `Evidence submitted: ${req.body.note || ''}`);
  saveInvoices(invoices);
  res.redirect(`/invoice/${invoice.id}`);
});

app.post('/invoice/:id/resolve', (req, res) => {
  const invoices = loadInvoices();
  const invoice = invoices.find(i => i.id === req.params.id);
  if (!invoice) return res.status(404).send('Invoice not found');
  invoice.status = 'resolved';
  addNote(invoice, `Dispute resolved: ${req.body.note || ''}`);
  saveInvoices(invoices);
  res.redirect(`/invoice/${invoice.id}`);
});

const PORT = process.env.PORT || 3000;

app.get("/", (req,res) => {
  const invoices = loadInvoices();
  res.json(invoices);
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
