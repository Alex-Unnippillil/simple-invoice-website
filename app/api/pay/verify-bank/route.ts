import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { achEnabled } from '@/lib/flags';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
});

/**
 * Verify a US bank account attached to a PaymentIntent or SetupIntent.
 * Supports both instant verification and micro‑deposit flows.
 */
export async function POST(req: Request) {
  if (!achEnabled) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  const { intentId, type = 'payment', amounts } = await req.json();

  try {
    let intent;

    if (type === 'setup') {
      // For SetupIntent
      intent = await stripe.setupIntents.verifyMicrodeposits(
        intentId,
        amounts ? { amounts } : {}
      );
    } else {
      // Default to PaymentIntent
      intent = await stripe.paymentIntents.verifyMicrodeposits(
        intentId,
        amounts ? { amounts } : {}
      );
    }

    return NextResponse.json(intent);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
