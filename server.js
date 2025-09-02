const express = require('express');
const path = require('path');
const leaseDocumentsRouter = require('./routes/leaseDocuments');
const { getDocumentsForLease } = require('./models/leaseDocument');
const { generateDownloadUrl } = require('./services/storage');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/api/leases/:leaseId/documents', leaseDocumentsRouter);

app.get('/leases/:leaseId', async (req, res) => {
  const docs = getDocumentsForLease(req.params.leaseId);
  const withUrls = await Promise.all(
    docs.map(async (d) => ({ ...d, url: await generateDownloadUrl(d.storageKey) }))
  );
  res.render('lease', { leaseId: req.params.leaseId, documents: withUrls });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);

});
