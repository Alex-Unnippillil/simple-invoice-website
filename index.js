const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// sample data
const invoices = [
  { id: 1, amount: 1000, dueDate: '2024-05-01', paid: true },
  { id: 2, amount: 1000, dueDate: '2024-06-01', paid: false, quickPayLink: 'https://quickpay.example.com/pay/2' }
];

const payments = [
  { id: 1, invoiceId: 1, amount: 1000, date: '2024-05-02' }
];

function calculateBalance() {
  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalPaid = payments.reduce((sum, pay) => sum + pay.amount, 0);
  return totalInvoiced - totalPaid;
}

function getDueInvoice() {
  return invoices.find(inv => !inv.paid) || null;
}

function getRecentReceipts(limit = 5) {
  return payments.slice(-limit).map(pay => ({
    invoiceId: pay.invoiceId,
    amount: pay.amount,
    date: pay.date
  })).reverse();
}

app.get('/tenant', (req, res) => {
  const dueInvoice = getDueInvoice();
  res.json({
    balance: calculateBalance(),
    dueInvoice: dueInvoice ? { id: dueInvoice.id, amount: dueInvoice.amount, dueDate: dueInvoice.dueDate } : null,
    quickPayLink: dueInvoice ? (dueInvoice.quickPayLink || `https://quickpay.example.com/pay/${dueInvoice.id}`) : null,
    recentReceipts: getRecentReceipts()
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
