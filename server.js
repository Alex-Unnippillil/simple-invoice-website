const express = require('express');
const bodyParser = require('body-parser');
const {
  leases,
  listRecurringCharges,
  listAdjustments,
  addRecurringCharge,
  updateRecurringCharge,
  deleteRecurringCharge,
  addAdjustment,
  updateAdjustment,
  deleteAdjustment,
  getUpcomingCharges
} = require('./models');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Lease detail UI with upcoming charges
app.get('/leases/:id', (req, res) => {
  const leaseId = req.params.id;
  const lease = leases.find(l => l.id === leaseId);
  if (!lease) return res.status(404).send('Lease not found');
  const upcoming = getUpcomingCharges(leaseId);
  res.render('leaseDetail', {
    lease,
    recurringCharges: listRecurringCharges(leaseId),
    adjustments: listAdjustments(leaseId),
    upcoming
  });
});

// RecurringCharge API
app.get('/leases/:id/recurring-charges', (req, res) => {
  res.json(listRecurringCharges(req.params.id));
});

app.post('/leases/:id/recurring-charges', (req, res) => {
  const charge = addRecurringCharge({ leaseId: req.params.id, ...req.body });
  if (req.headers.accept && req.headers.accept.includes('application/json')) {
    res.json(charge);
  } else {
    res.redirect(`/leases/${req.params.id}`);
  }
});

app.put('/leases/:id/recurring-charges/:rcId', (req, res) => {
  const charge = updateRecurringCharge(req.params.rcId, req.body);
  if (!charge) return res.status(404).end();
  res.json(charge);
});

app.post('/leases/:id/recurring-charges/:rcId/delete', (req, res) => {
  deleteRecurringCharge(req.params.rcId);
  res.redirect(`/leases/${req.params.id}`);
});

app.delete('/leases/:id/recurring-charges/:rcId', (req, res) => {
  deleteRecurringCharge(req.params.rcId);
  res.status(204).end();
});

// Adjustment API
app.get('/leases/:id/adjustments', (req, res) => {
  res.json(listAdjustments(req.params.id));
});

app.post('/leases/:id/adjustments', (req, res) => {
  const adj = addAdjustment({ leaseId: req.params.id, ...req.body });
  if (req.headers.accept && req.headers.accept.includes('application/json')) {
    res.json(adj);
  } else {
    res.redirect(`/leases/${req.params.id}`);
  }
});

app.put('/leases/:id/adjustments/:adjId', (req, res) => {
  const adj = updateAdjustment(req.params.adjId, req.body);
  if (!adj) return res.status(404).end();
  res.json(adj);
});

app.post('/leases/:id/adjustments/:adjId/delete', (req, res) => {
  deleteAdjustment(req.params.adjId);
  res.redirect(`/leases/${req.params.id}`);
});

app.delete('/leases/:id/adjustments/:adjId', (req, res) => {
  deleteAdjustment(req.params.adjId);
  res.status(204).end();
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
