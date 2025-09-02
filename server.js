const express = require('express');
const Stripe = require('stripe');

// Choose test or live key depending on environment
const stripeSecret = process.env.VERCEL_ENV === 'production'
  ? process.env.STRIPE_SECRET_KEY
  : process.env.STRIPE_TEST_SECRET_KEY;

if (!stripeSecret) {
  throw new Error('Missing Stripe API key');
}

const stripe = new Stripe(stripeSecret, { apiVersion: '2023-10-16' });

// Ensure portal configuration allows payment method updates and invoice history
async function getPortalConfiguration() {
  const list = await stripe.billingPortal.configurations.list({ limit: 1 });
  const active = list.data.find((c) => c.active);
  if (active) return active.id;

  const created = await stripe.billingPortal.configurations.create({
    features: {
      payment_method_update: { enabled: true },
      invoice_history: { enabled: true },
    },
  });
  return created.id;
}

const app = express();

// TODO: replace with real tenant lookup
const tenants = {
  demo: 'cus_test_123',
};

// Generate a Stripe Customer Portal session for a tenant
app.get('/tenants/:tenantId/portal', async (req, res) => {
  try {
    const customerId = tenants[req.params.tenantId];
    if (!customerId) {
      return res.status(404).json({ error: 'Unknown tenant' });
    }
    const configuration = await getPortalConfiguration();
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: process.env.RETURN_URL || 'https://example.com/account',
      configuration,
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
