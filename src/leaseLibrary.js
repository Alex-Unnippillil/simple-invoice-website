const fs = require('fs');
const path = require('path');

const libraryDir = path.join(__dirname, '..', 'lease-library');

function ensureDir() {
  if (!fs.existsSync(libraryDir)) {
    fs.mkdirSync(libraryDir);
  }
}

function saveDocument(filename, buffer) {
  ensureDir();
  const filePath = path.join(libraryDir, filename);
  fs.writeFileSync(filePath, buffer);
  return filePath;
}

module.exports = {
  saveDocument,
};
