import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { invoices } from '@/lib/data';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2022-11-15',
});

export async function GET(
  request: Request,
  { params }: { params: { invoiceId: string } }
) {
  const id = Number(params.invoiceId);
  const invoice = invoices.find((inv) => inv.id === id);
  if (!invoice) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: invoice.amount,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: { invoiceId: String(invoice.id) },
    });
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
