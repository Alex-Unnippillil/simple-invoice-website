import Stripe from 'stripe';

const requiredEnvVars = ['STRIPE_TEST_SECRET_KEY'];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

const stripe = new Stripe(process.env.STRIPE_TEST_SECRET_KEY as string, {
  apiVersion: '2023-10-16',
});

async function main() {
  try {
    const balance = await stripe.balance.retrieve();
    console.log('Available balances:', balance.available);
    console.log('Pending balances:', balance.pending);
    process.exit(0);
  } catch (error) {
    console.error('Error retrieving Stripe balances:', error);
    process.exit(1);
  }
}

main();
