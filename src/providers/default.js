const { saveDocument } = require('../leaseLibrary');

async function launch() {
  throw new Error('No signing provider configured');
}

function saveSignedDocument(filename, fileBuffer) {
  return saveDocument(filename, fileBuffer);
}

module.exports = {
  launch,
  saveSignedDocument,
};
