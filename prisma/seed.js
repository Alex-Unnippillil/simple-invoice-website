const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.unit.deleteMany();
  await prisma.property.deleteMany();

  await prisma.property.create({
    data: {
      name: 'Sunset Apartments',
      address: '123 Sunset Blvd',
      units: {
        create: [
          { unitNumber: '1A', bedrooms: 2, bathrooms: 1, sqft: 800 },
          { unitNumber: '1B', bedrooms: 1, bathrooms: 1, sqft: 600 }
        ]
      }
    }
  });

  await prisma.property.create({
    data: {
      name: 'Lakeside Villas',
      address: '456 Lake Dr',
      units: {
        create: [
          { unitNumber: '101', bedrooms: 3, bathrooms: 2, sqft: 1200, notes: 'Lake view' },
          { unitNumber: '102', bedrooms: 2, bathrooms: 2, sqft: 950 },
          { unitNumber: '103', bedrooms: 1, bathrooms: 1, sqft: 550, notes: 'Cozy' }
        ]
      }
    }
  });

  const properties = await prisma.property.findMany({ include: { units: true } });
  console.log(`Seeded ${properties.length} properties`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
