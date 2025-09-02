const flags = require('./featureFlags');

function autopay(invoiceId) {
  if (!flags.ENABLE_AUTOPAY) {
    throw new Error('Autopay feature disabled');
  }
  return `Autopay processed for invoice ${invoiceId}`;
}

function processACHPayment(details) {
  if (!flags.ENABLE_ACH_PAYMENTS) {
    throw new Error('ACH payments feature disabled');
  }
  return `ACH payment processed for account ${details.account}`;
}

module.exports = { autopay, processACHPayment };
