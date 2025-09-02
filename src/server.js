const express = require('express');
const { PrismaClient } = require('@prisma/client');
const path = require('path');
const pinoHttp = require('pino-http');
const logger = require('../lib/logger');
const { randomUUID } = require('crypto');

const app = express();
const prisma = new PrismaClient();

app.use(
  pinoHttp({
    logger,
    genReqId: (req) => req.headers['x-request-id'] || randomUUID(),
    customProps: (req) => ({
      requestId: req.id,
      userId: req.headers['x-user-id'] || null
    })
  })
);

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Units endpoints
app.post('/api/units', async (req, res) => {
  try {
    const unit = await prisma.unit.create({ data: { name: req.body.name } });
    res.json(unit);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/units', async (_req, res) => {
  const units = await prisma.unit.findMany();
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

app.get('/api/tenants', async (_req, res) => {
  const tenants = await prisma.tenantProfile.findMany();
  res.json(tenants);
});

// Lease endpoint
app.post('/api/leases', async (req, res) => {
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
        tenantId: req.body.tenantId
      }
    });
    res.json(lease);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/leases', async (_req, res) => {
  const leases = await prisma.lease.findMany({ include: { unit: true, tenant: true } });
  res.json(leases);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
