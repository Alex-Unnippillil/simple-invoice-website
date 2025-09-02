const { getProvider } = require('./organizationSettings');
const dropbox = require('./providers/dropbox');
const defaultProvider = require('./providers/default');

/**
 * Launch the signing flow based on configured provider.
 * @param {string} signUrl URL to initiate signing.
 * @param {Object} options Options for provider clients.
 */
async function launchSigning(signUrl, options = {}) {
  const provider = getProvider();
  switch (provider) {
    case 'dropbox':
      return dropbox.launch(signUrl, options);
    default:
      return defaultProvider.launch(signUrl, options);
  }
}

/**
 * Persist a signed document to the lease library regardless of provider.
 * @param {string} filename Document filename.
 * @param {Buffer} buffer Document binary contents.
 */
function saveSignedDocument(filename, buffer) {
  const provider = getProvider();
  switch (provider) {
    case 'dropbox':
      return dropbox.saveSignedDocument(filename, buffer);
    default:
      return defaultProvider.saveSignedDocument(filename, buffer);
  }
}

module.exports = {
  launchSigning,
  saveSignedDocument,
};
