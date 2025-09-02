const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, '../data/leaseDocuments.json');

function loadDocuments() {
  if (!fs.existsSync(DATA_FILE)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(DATA_FILE);
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load documents', err);
    return [];
  }
}

function saveDocuments(docs) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(docs, null, 2));
}

class LeaseDocument {
  constructor({ id = uuidv4(), leaseId, type, signedBy, signedOn, storageKey, originalName }) {
    this.id = id;
    this.leaseId = leaseId;
    this.type = type;
    this.signedBy = signedBy;
    this.signedOn = signedOn;
    this.storageKey = storageKey;
    this.originalName = originalName;
  }
}

function addDocument(docData) {
  const docs = loadDocuments();
  const doc = new LeaseDocument(docData);
  docs.push(doc);
  saveDocuments(docs);
  return doc;
}

function getDocumentsForLease(leaseId) {
  const docs = loadDocuments();
  return docs.filter((d) => d.leaseId === leaseId);
}

module.exports = {
  LeaseDocument,
  addDocument,
  getDocumentsForLease,
};
