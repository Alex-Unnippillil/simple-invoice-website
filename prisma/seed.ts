import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_API_KEY || '', {
  apiVersion: '2022-11-15',
});

async function main() {
  const unit = await prisma.unit.create({ data: { name: 'Unit A' } });
  let tenant = await prisma.tenantProfile.create({ data: { name: 'Alice' } });

  if (!tenant.stripeCustomerId) {
    const customer = await stripe.customers.create({ name: tenant.name });
    tenant = await prisma.tenantProfile.update({
      where: { id: tenant.id },
      data: { stripeCustomerId: customer.id },
    });
  }

  const updatedTenant = await prisma.tenantProfile.findUnique({
    where: { id: tenant.id },
  });

  if (!updatedTenant?.stripeCustomerId) {
    throw new Error('Stripe customer ID was not saved.');
  }

  const lease = await prisma.lease.create({
    data: {
      unitId: unit.id,
      tenantId: tenant.id,
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-12-31'),
      monthlyRent: 1200,
      deposit: 600,
      currency: 'USD',
      billingDay: 1,
      status: 'active',
    },
  });

  console.log('Seeded lease', lease);
  console.log('Tenant stripe customer ID', updatedTenant.stripeCustomerId);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
