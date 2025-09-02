const HelloSign = require('hellosign-embedded');
const { saveDocument } = require('../leaseLibrary');

async function launch(signUrl, opts = {}) {
  const client = new HelloSign(opts); // opts may include clientId
  return new Promise((resolve, reject) => {
    client.open(signUrl, {
      debug: opts.debug || false,
      allowCancel: true,
      // Callback when signing is complete
      messageListener: event => {
        if (event && event.eventName === 'signature_request_signed') {
          resolve(event);
        }
      }
    });
  });
}

// Save signed document to lease library
function saveSignedDocument(filename, fileBuffer) {
  return saveDocument(filename, fileBuffer);
}

module.exports = {
  launch,
  saveSignedDocument,
};
