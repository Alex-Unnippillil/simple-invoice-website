import Stripe from 'stripe';

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!stripeSecret) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

if (!webhookSecret) {
  throw new Error('STRIPE_WEBHOOK_SECRET is not set');
}

const stripe = new Stripe(stripeSecret, {
  apiVersion: '2022-11-15',
});

// In-memory store of processed event IDs to provide idempotency.
// In production, replace with a persistent store (e.g. database or cache).
const processedEvents = new Set<string>();

export async function POST(request: Request): Promise<Response> {
  const rawBody = await request.text();
  const signature = request.headers.get('stripe-signature') ?? '';

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(`Webhook Error: ${message}`, { status: 400 });
  }

  // Reject replayed events by checking if the event ID has already been processed.
  if (processedEvents.has(event.id)) {
    return new Response('Event already processed', { status: 409 });
  }

  // Mark event as processed before executing business logic so that any
  // downstream retries remain idempotent. If processing fails, this should
  // ideally be rolled back in the persistent store used in production.
  processedEvents.add(event.id);

  try {
    // Example of using the event ID as an idempotency key when calling Stripe APIs.
    // Replace the following block with real business logic.
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await stripe.invoices.create(
        { customer: paymentIntent.customer as string },
        { idempotencyKey: event.id }
      );
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(`Processing Error: ${message}`, { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
