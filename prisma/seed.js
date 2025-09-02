const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@example.com';
  const adminPassword = 'admin123';
  const tenantEmail = 'tenant@example.com';

  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  const admin = await prisma.user.create({
    data: { email: adminEmail, password: hashedPassword, role: 'admin' }
  });

  const unit = await prisma.unit.create({ data: { name: 'Unit A' } });
  const tenant = await prisma.tenantProfile.create({ data: { name: 'Alice', email: tenantEmail } });
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
  console.log('Seeded admin', admin);
  console.log('Seeded lease', lease);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
