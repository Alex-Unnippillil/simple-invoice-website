const express = require('express');

const app = express();

// Route to handle payment confirmation and redirect appropriately
app.get('/tenant/pay/confirm', (req, res) => {
  const { status } = req.query;
  if (status === 'success') {
    return res.redirect('/tenant/pay/success');
  }
  return res.redirect('/tenant/pay/cancel');
});

// Successful payment page
app.get('/tenant/pay/success', (req, res) => {
  res.send('Payment processed successfully.');
});

// Cancelled payment page
app.get('/tenant/pay/cancel', (req, res) => {
  res.send('Payment was cancelled or failed.');
});

module.exports = app;

// Start server if file executed directly
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
