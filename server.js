const express = require('express');
const path = require('path');
const invoices = require('./data/invoices');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/tenant/invoices', (req, res) => {
  const perPage = 5;
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const { status, from, to } = req.query;

  let filtered = invoices.slice();

  if (status) {
    filtered = filtered.filter(inv => inv.status === status);
  }
  if (from) {
    const fromDate = new Date(from);
    filtered = filtered.filter(inv => new Date(inv.date) >= fromDate);
  }
  if (to) {
    const toDate = new Date(to);
    filtered = filtered.filter(inv => new Date(inv.date) <= toDate);
  }

  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);

  res.render('invoices', {
    invoices: paginated,
    currentPage,
    totalPages,
    query: { status: status || '', from: from || '', to: to || '' }
  });
});

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
