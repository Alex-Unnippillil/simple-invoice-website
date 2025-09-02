const crypto = require('crypto');

function generateSecret(byteLength = 32) {
  return crypto.randomBytes(byteLength).toString('hex');
}

if (require.main === module) {
  console.log(generateSecret());
}

module.exports = { generateSecret };
