require('dotenv').config();
const express = require('express');
const app = express();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.use(express.static('public'));
app.use(express.json());

// Example configuration per tenant/location
const tenantConfig = {
  'tenantA': { location: 'US', methods: ['card', 'us_bank_account'] },
  'tenantEU': { location: 'EU', methods: ['card'] }
};

function getAllowedMethods(tenantId) {
  const tenant = tenantConfig[tenantId];
  return tenant ? tenant.methods : ['card'];
}

app.get('/config', (req, res) => {
  res.send({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
});

app.post('/create-payment-intent', async (req, res) => {
  const { amount, tenantId } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      payment_method_types: getAllowedMethods(tenantId),
      payment_method_options: {
        us_bank_account: { verification_method: 'automatic' }
      }
    });
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

app.post('/create-setup-intent', async (req, res) => {
  const { tenantId } = req.body;
  try {
    const setupIntent = await stripe.setupIntents.create({
      payment_method_types: getAllowedMethods(tenantId)
    });
    res.send({ clientSecret: setupIntent.client_secret });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

app.listen(4242, () => console.log('Server running on port 4242'));
