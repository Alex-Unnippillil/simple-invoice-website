// @ts-nocheck
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import path from 'path';

/**
 * Seeds sample tenants, leases, and invoices into the data/ directory.
 *
 * The script overwrites existing files making it safe to run multiple times.
 * To reset data, delete the generated JSON files in the data/ directory.
 */

interface Tenant {
  id: number;
  name: string;
  phoneNumber?: string;
}

interface Lease {
  id: number;
  tenantId: number;
  unit: string;
  startDate: string; // ISO string
  endDate: string;   // ISO string
  monthlyRent: number;
}

interface Invoice {
  id: number;
  leaseId: number;
  amount: number;
  dueDate: string; // ISO string
  status: 'unpaid' | 'paid';
}

async function seed() {
  const dataDir = path.join(__dirname, '..', 'data');
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }

  const tenants: Tenant[] = [
    { id: 1, name: 'Alice Tenant', phoneNumber: '555-0001' },
    { id: 2, name: 'Bob Tenant', phoneNumber: '555-0002' }
  ];

  const leases: Lease[] = [
    {
      id: 1,
      tenantId: 1,
      unit: 'A1',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      monthlyRent: 1200
    },
    {
      id: 2,
      tenantId: 2,
      unit: 'B2',
      startDate: '2024-06-01',
      endDate: '2025-05-31',
      monthlyRent: 1100
    }
  ];

  const invoices: Invoice[] = [
    { id: 1, leaseId: 1, amount: 1200, dueDate: '2024-01-05', status: 'unpaid' },
    { id: 2, leaseId: 1, amount: 1200, dueDate: '2024-02-05', status: 'unpaid' },
    { id: 3, leaseId: 2, amount: 1100, dueDate: '2024-06-05', status: 'unpaid' }
  ];

  writeFileSync(path.join(dataDir, 'tenants.json'), JSON.stringify(tenants, null, 2));
  writeFileSync(path.join(dataDir, 'leases.json'), JSON.stringify(leases, null, 2));
  writeFileSync(path.join(dataDir, 'invoices.json'), JSON.stringify(invoices, null, 2));

  console.log('Seeded sample data to data/');
}

seed().catch((err) => {
  console.error('Failed to seed sample data:', err);
  process.exit(1);
});
