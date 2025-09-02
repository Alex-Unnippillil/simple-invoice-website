import Stripe from 'stripe';

export interface PrismaLike {
  invoice: {
    update: (args: any) => Promise<any>;
  };
  payment: {
    create: (args: any) => Promise<any>;
  };
}

export async function handleStripeEvent(
  event: Stripe.Event,
  prisma: PrismaLike,
): Promise<void> {
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const invoiceId = paymentIntent.metadata?.invoiceId;
      console.log(
        `Payment succeeded for invoice ${invoiceId}: ${paymentIntent.id}`,
      );
      if (invoiceId) {
        await prisma.invoice.update({
          where: { id: invoiceId },
          data: { status: 'PAID' },
        });
        await prisma.payment.create({
          data: {
            invoiceId,
            amount: paymentIntent.amount_received,
            status: 'SUCCEEDED',
            stripePaymentIntentId: paymentIntent.id,
          },
        });
      }
      break;
    }
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const invoiceId = paymentIntent.metadata?.invoiceId;
      console.log(
        `Payment failed for invoice ${invoiceId}: ${paymentIntent.id}`,
      );
      if (invoiceId) {
        await prisma.invoice.update({
          where: { id: invoiceId },
          data: { status: 'FAILED' },
        });
        await prisma.payment.create({
          data: {
            invoiceId,
            amount: paymentIntent.amount,
            status: 'FAILED',
            stripePaymentIntentId: paymentIntent.id,
          },
        });
      }
      break;
    }
    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge;
      const invoiceId = charge.metadata?.invoiceId as string | undefined;
      console.log(`Charge refunded for invoice ${invoiceId}: ${charge.id}`);
      if (invoiceId) {
        await prisma.invoice.update({
          where: { id: invoiceId },
          data: { status: 'REFUNDED' },
        });
        await prisma.payment.create({
          data: {
            invoiceId,
            amount: -charge.amount_refunded,
            status: 'REFUNDED',
            stripeChargeId: charge.id,
          },
        });
      }
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
}

