const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.post('/tenant/profile', async (req, res) => {
  const { address, phone, currency } = req.body;
  try {
    const tenant = await prisma.tenant.upsert({
      where: { id: 1 },
      update: { address, phone, currency },
      create: { id: 1, address, phone, currency }
    });
    res.json(tenant);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Unable to update tenant profile' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
