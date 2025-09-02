const express = require('express');
const { PrismaClient } = require('@prisma/client');
const path = require('path');
const { getLeases, getUnits } = require('../services/tenantScopedQueries');

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Simple middleware requiring an X-Tenant-ID header for scoping
function requireTenant(req, res, next) {
  const tenantId = parseInt(req.get('x-tenant-id'), 10);
  if (!tenantId) {
    return res.status(400).json({ error: 'tenant id header required' });
  }
  req.tenantId = tenantId;
  next();
}

// Units endpoints
app.post('/api/units', requireTenant, async (req, res) => {
  try {
    const unit = await prisma.unit.create({ data: { name: req.body.name } });
    res.json(unit);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/units', requireTenant, async (req, res) => {
  const units = await getUnits(prisma, req.tenantId);
  res.json(units);
});

// Tenant endpoints
app.post('/api/tenants', async (req, res) => {
  try {
    const tenant = await prisma.tenantProfile.create({ data: { name: req.body.name } });
    res.json(tenant);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/tenants', requireTenant, async (req, res) => {
  const tenant = await prisma.tenantProfile.findUnique({ where: { id: req.tenantId } });
  res.json(tenant ? [tenant] : []);
});

// Lease endpoints
app.post('/api/leases', requireTenant, async (req, res) => {
  try {
    const lease = await prisma.lease.create({
      data: {
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate),
        monthlyRent: req.body.monthlyRent,
        deposit: req.body.deposit,
        currency: req.body.currency,
        billingDay: req.body.billingDay,
        status: req.body.status,
        unitId: req.body.unitId,
        tenantId: req.tenantId,
      },
    });
    res.json(lease);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/leases', requireTenant, async (req, res) => {
  const leases = await getLeases(prisma, req.tenantId);
  res.json(leases);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = { app, requireTenant };
