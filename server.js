const express = require('express');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const leases = require('./data/leases.json');
const tenants = require('./data/tenants.json');
const properties = require('./data/properties.json');

const app = express();
app.use(express.static('public'));

function getLeaseData(id) {
  const lease = leases.find(l => l.id === id);
  if (!lease) return null;
  const tenant = tenants.find(t => t.id === lease.tenantId) || {};
  const property = properties.find(p => p.id === lease.propertyId) || {};
  return { lease, tenant, property };
}

app.get('/api/leases', (req, res) => {
  res.json(leases);
});

app.get('/api/leases/:id/pdf', (req, res) => {
  const data = getLeaseData(req.params.id);
  if (!data) {
    return res.status(404).json({ error: 'Lease not found' });
  }

  const doc = new PDFDocument();
  const fileName = `lease_${data.lease.id}_summary.pdf`;
  const filePath = path.join(__dirname, 'documents', fileName);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  res.setHeader('Content-disposition', `attachment; filename="${fileName}"`);
  res.setHeader('Content-type', 'application/pdf');

  // pipe to response and file
  const fileStream = fs.createWriteStream(filePath);
  doc.pipe(fileStream);
  doc.pipe(res);

  doc.fontSize(20).text('Lease Summary', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Tenant: ${data.tenant.name}`);
  doc.text(`Property: ${data.property.address}`);
  doc.text(`Lease Term: ${data.lease.startDate} to ${data.lease.endDate}`);
  doc.text(`Rent: $${data.lease.rent}`);
  doc.end();
});

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server running on port ${port}`));
}

module.exports = app;
