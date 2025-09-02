import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.admin.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin',
      tenants: {
        create: {
          name: 'Tenant One',
          invoices: {
            create: {
              items: {
                create: [
                  { description: 'Rent', amount: 1000 },
                  { description: 'Utilities', amount: 100 }
                ]
              }
            }
          }
        }
      }
    }
  });

  console.log('Seeded admin with tenant and invoice:', admin.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
