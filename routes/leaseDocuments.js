const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { addDocument, getDocumentsForLease } = require('../models/leaseDocument');
const { uploadBuffer, generateDownloadUrl } = require('../services/storage');

const router = express.Router({ mergeParams: true });

const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('document'), async (req, res) => {
  try {
    const { type, signedBy, signedOn } = req.body;
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }
    const key = uuidv4() + path.extname(req.file.originalname);
    await uploadBuffer(req.file.buffer, key, req.file.mimetype);

    const doc = addDocument({
      leaseId: req.params.leaseId,
      type,
      signedBy,
      signedOn,
      storageKey: key,
      originalName: req.file.originalname,
    });
    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).send('Upload failed');
  }
});

router.get('/', async (req, res) => {
  const docs = getDocumentsForLease(req.params.leaseId);
  const withUrls = await Promise.all(
    docs.map(async (d) => ({ ...d, url: await generateDownloadUrl(d.storageKey) }))
  );
  res.json(withUrls);
});

module.exports = router;
