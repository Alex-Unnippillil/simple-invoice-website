import test from 'node:test';
import assert from 'node:assert/strict';
import { getLeases } from '../services/tenantScopedQueries.js';

test('getLeases only returns leases for the given tenant', async () => {
  const leasesData = [
    { id: 1, tenantId: 1, monthlyRent: 1000 },
    { id: 2, tenantId: 2, monthlyRent: 2000 }
  ];
  const prisma = {
    lease: {
      findMany: ({ where }) => leasesData.filter(l => l.tenantId === where.tenantId)
    }
  };

  const result = await getLeases(prisma, 1);
  assert.deepEqual(result, [leasesData[0]]);
});

test('getLeases throws without tenantId', async () => {
  const prisma = { lease: { findMany: () => [] } };
  await assert.rejects(() => getLeases(prisma), { message: 'tenantId is required' });
});
