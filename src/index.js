const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.get('/', async (req, res) => {
  const properties = await prisma.property.findMany({
    include: {
      _count: { select: { units: true } }
    }
  });

  let html = '<h1>Properties</h1><ul>';
  for (const p of properties) {
    html += `<li>${p.name}: ${p._count.units} units</li>`;
  }
  html += '</ul>';
  res.send(html);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
