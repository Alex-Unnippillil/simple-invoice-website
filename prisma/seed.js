const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin', 10);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
    },
  });

  const unit = await prisma.unit.create({ data: { name: 'Unit A' } });
  const tenant = await prisma.tenantProfile.create({ data: { name: 'Alice' } });
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
      status: 'active'
    }
  });
  console.log('Seeded lease', lease);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
