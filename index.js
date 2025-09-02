const express = require('express');
const bodyParser = require('body-parser');
const cron = require('node-cron');

const app = express();
app.use(bodyParser.json());

// In-memory stores
const invoices = [
  { id: 1, amount: 100, status: 'pending', synced: false },
  { id: 2, amount: 200, status: 'pending', synced: true }, // simulate previously synced invoice
];
const payments = [];
const remoteAccounting = {
  invoices: { 2: { id: 2, amount: 200 } }, // remote system only has invoice 2
  payments: {}
};
const conflicts = []; // { id, type: 'invoice'|'payment', issue }

function logConflict(conflict) {
  console.error('Sync conflict:', conflict);
  conflicts.push(conflict);
}

function pushInvoices() {
  invoices.forEach(inv => {
    if (inv.status !== 'pending') return;
    const remote = remoteAccounting.invoices[inv.id];
    if (inv.synced && !remote) {
      logConflict({ id: inv.id, type: 'invoice', issue: 'Remote invoice deleted' });
      return;
    }
    remoteAccounting.invoices[inv.id] = { id: inv.id, amount: inv.amount };
    inv.synced = true;
    inv.status = 'synced';
  });
}

function pushPayments() {
  payments.forEach(pay => {
    if (pay.status !== 'pending') return;
    const remote = remoteAccounting.payments[pay.id];
    if (pay.synced && !remote) {
      logConflict({ id: pay.id, type: 'payment', issue: 'Remote payment deleted' });
      return;
    }
    remoteAccounting.payments[pay.id] = { id: pay.id, amount: pay.amount };
    pay.synced = true;
    pay.status = 'synced';
  });
}

function syncPending() {
  pushInvoices();
  pushPayments();
}

// Nightly job at midnight
cron.schedule('0 0 * * *', syncPending);

// Dashboard for sync issues
app.get('/sync-issues', (req, res) => {
  let html = '<h1>Sync Issues</h1>';
  if (conflicts.length === 0) {
    html += '<p>No conflicts.</p>';
  } else {
    html += '<ul>';
    conflicts.forEach((c, idx) => {
      html += `<li>${c.type} ${c.id}: ${c.issue}
        <form method="POST" action="/sync-issues/${idx}/resolve" style="display:inline">
          <button type="submit">Resolve</button>
        </form>
        <form method="POST" action="/sync-issues/${idx}/retry" style="display:inline">
          <button type="submit">Retry</button>
        </form>
      </li>`;
    });
    html += '</ul>';
  }
  res.send(html);
});

app.post('/sync-issues/:idx/resolve', (req, res) => {
  const idx = parseInt(req.params.idx, 10);
  if (!isNaN(idx)) {
    conflicts.splice(idx, 1);
  }
  res.redirect('/sync-issues');
});

app.post('/sync-issues/:idx/retry', (req, res) => {
  const idx = parseInt(req.params.idx, 10);
  const conflict = conflicts[idx];
  if (conflict) {
    if (conflict.type === 'invoice') {
      pushInvoices();
    } else {
      pushPayments();
    }
    // Remove conflict if resolved
    const stillConflict = conflicts.find(c => c.id === conflict.id && c.type === conflict.type);
    if (!stillConflict) {
      conflicts.splice(idx, 1);
    }
  }
  res.redirect('/sync-issues');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
