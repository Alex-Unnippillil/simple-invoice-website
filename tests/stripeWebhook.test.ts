import Stripe from 'stripe';
import { handleStripeEvent } from '../app/api/stripe/webhook/handler';

class MockPrisma {
  invoice = {
    updateCalls: [] as any[],
    update: async (args: any) => {
      this.invoice.updateCalls.push(args);
      return args;
    },
  };

  payment = {
    createCalls: [] as any[],
    create: async (args: any) => {
      this.payment.createCalls.push(args);
      return args;
    },
  };
}

async function run() {
  const prisma = new MockPrisma();

  const succeeded: Stripe.Event = {
    id: 'evt_1',
    type: 'payment_intent.succeeded',
    data: {
      object: {
        id: 'pi_1',
        amount_received: 5000,
        metadata: { invoiceId: 'inv_1' },
      },
    },
    api_version: '2022-11-15',
    created: 0,
    livemode: false,
    object: 'event',
    pending_webhooks: 0,
    request: { id: null, idempotency_key: null },
  } as unknown as Stripe.Event;

  const failed: Stripe.Event = {
    id: 'evt_2',
    type: 'payment_intent.payment_failed',
    data: {
      object: {
        id: 'pi_2',
        amount: 5000,
        metadata: { invoiceId: 'inv_2' },
      },
    },
    api_version: '2022-11-15',
    created: 0,
    livemode: false,
    object: 'event',
    pending_webhooks: 0,
    request: { id: null, idempotency_key: null },
  } as unknown as Stripe.Event;

  const refunded: Stripe.Event = {
    id: 'evt_3',
    type: 'charge.refunded',
    data: {
      object: {
        id: 'ch_3',
        amount_refunded: 3000,
        metadata: { invoiceId: 'inv_1' },
      },
    },
    api_version: '2022-11-15',
    created: 0,
    livemode: false,
    object: 'event',
    pending_webhooks: 0,
    request: { id: null, idempotency_key: null },
  } as unknown as Stripe.Event;

  await handleStripeEvent(succeeded, prisma as any);
  await handleStripeEvent(failed, prisma as any);
  await handleStripeEvent(refunded, prisma as any);

  console.log('Invoice updates:', prisma.invoice.updateCalls);
  console.log('Payment records:', prisma.payment.createCalls);
}

run();

