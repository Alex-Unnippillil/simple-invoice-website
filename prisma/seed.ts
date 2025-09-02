import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Organization
  const organization = await prisma.organization.upsert({
    where: { name: 'Acme Property Management' },
    update: {},
    create: { name: 'Acme Property Management' },
  });

  // Property
  const property = await prisma.property.upsert({
    where: { name: 'Sunset Apartments' },
    update: {},
    create: { name: 'Sunset Apartments', organizationId: organization.id },
  });

  // Unit
  const unit = await prisma.unit.upsert({
    where: { name: 'Unit 101' },
    update: {},
    create: { name: 'Unit 101', propertyId: property.id },
  });

  // Admin
  await prisma.admin.upsert({
    where: { email: 'admin@acme.com' },
    update: {},
    create: { email: 'admin@acme.com', organizationId: organization.id },
  });

  // Tenant
  const tenant = await prisma.tenant.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: { name: 'John Doe', email: 'john@example.com' },
  });

  // Lease
  const lease = await prisma.lease.upsert({
    where: {
      unitId_tenantId: {
        unitId: unit.id,
        tenantId: tenant.id,
      },
    },
    update: {},
    create: {
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

  // Invoice
  const invoice = await prisma.invoice.upsert({
    where: {
      leaseId_dueDate: {
        leaseId: lease.id,
        dueDate: new Date('2023-08-01'),
      },
    },
    update: {},
    create: {
      leaseId: lease.id,
      issueDate: new Date('2023-07-25'),
      dueDate: new Date('2023-08-01'),
      status: 'unpaid',
    },
  });

  // Invoice Items
  await prisma.invoiceItem.upsert({
    where: {
      invoiceId_description: { invoiceId: invoice.id, description: 'Rent' },
    },
    update: { amount: 1200 },
    create: {
      invoiceId: invoice.id,
      description: 'Rent',
      amount: 1200,
    },
  });

  await prisma.invoiceItem.upsert({
    where: {
      invoiceId_description: { invoiceId: invoice.id, description: 'Water' },
    },
    update: { amount: 50 },
    create: {
      invoiceId: invoice.id,
      description: 'Water',
      amount: 50,
    },
  });

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

