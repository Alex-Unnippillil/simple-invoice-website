const { setProvider } = require('./src/organizationSettings');
const { launchSigning, saveSignedDocument } = require('./src/signingFlow');
const fs = require('fs');

async function demo() {
  // Example: configure to use Dropbox Sign
  setProvider('dropbox');

  // Launch signing
  const signUrl = 'https://example.com/dropbox-sign-url';
  try {
    await launchSigning(signUrl, { clientId: 'YOUR_CLIENT_ID' });
    console.log('Signing complete');

    // simulate saving signed document
    const dummyBuffer = Buffer.from('signed-document');
    const savedPath = saveSignedDocument('lease.pdf', dummyBuffer);
    console.log('Saved to', savedPath);
  } catch (err) {
    console.error('Signing failed:', err.message);
  }
}

demo();
