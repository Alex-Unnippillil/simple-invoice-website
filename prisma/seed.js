let prisma;
try {
  const { PrismaClient } = require('@prisma/client');
  prisma = new PrismaClient();
} catch (e) {
  prisma = null;
  console.warn('Prisma not installed, skipping lease seeding');
}

const sqlite3 = require('sqlite3').verbose();

async function seedCoreData() {
  if (!prisma) return;
  const unit = await prisma.unit.create({ data: { name: 'Unit A' } });
  const tenant = await prisma.tenantProfile.create({ data: { name: 'Alice' } });
  await prisma.lease.create({
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
}

function seedFeatureFlags() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database('data.db');
    const essential = ['core_invoicing', 'payment_tracking'];
    const risky = ['experimental_auto_pay', 'beta_reporting'];

    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS feature_flags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE,
        enabled INTEGER
      )`);
      const stmt = db.prepare('INSERT OR REPLACE INTO feature_flags (name, enabled) VALUES (?, ?)');
      essential.forEach(name => stmt.run(name, 1));
      risky.forEach(name => stmt.run(name, 0));
      stmt.finalize(err => {
        db.close();
        if (err) reject(err);
        else resolve();
      });
    });
  });
}

async function main() {
  await seedCoreData();
  await seedFeatureFlags();
  console.log('Seeded feature flags');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  if (prisma) await prisma.$disconnect();
});
