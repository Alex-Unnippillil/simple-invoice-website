function ensureTenant(tenantId) {
  if (!tenantId) throw new Error('tenantId is required');
}

async function getLeases(prisma, tenantId) {
  ensureTenant(tenantId);
  return prisma.lease.findMany({
    where: { tenantId },
    include: { unit: true, tenant: true },
  });
}

async function getUnits(prisma, tenantId) {
  ensureTenant(tenantId);
  return prisma.unit.findMany({
    where: { leases: { some: { tenantId } } },
  });
}

module.exports = { getLeases, getUnits };
