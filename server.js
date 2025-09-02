const express = require('express');
const path = require('path');
const { sendIntegration, listFailures, retryIntegration } = require('./integrationService');

const app = express();
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.post('/send', async (req, res) => {
  const result = await sendIntegration(req.body);
  res.status(result.status === 'success' ? 200 : 500).json(result);
});

app.get('/admin/failures', async (req, res) => {
  const rows = await listFailures();
  res.render('failures', { rows });
});

app.post('/admin/retry/:id', async (req, res) => {
  try {
    await retryIntegration(req.params.id);
  } catch (e) {
    // ignore
  }
  res.redirect('/admin/failures');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

