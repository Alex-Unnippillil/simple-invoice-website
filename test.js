const assert = require('assert');
const flags = require('./featureFlags');
const payment = require('./payment');
const { searchInvoices } = require('./search');

function withFlags(newFlags, fn) {
  const original = { ...flags };
  Object.assign(flags, newFlags);
  try {
    fn();
  } finally {
    Object.assign(flags, original);
  }
}

function testAutopay() {
  withFlags({ ENABLE_AUTOPAY: false }, () => {
    assert.throws(() => payment.autopay('INV1'));
  });
  withFlags({ ENABLE_AUTOPAY: true }, () => {
    assert.strictEqual(
      payment.autopay('INV1'),
      'Autopay processed for invoice INV1'
    );
  });
}

function testACHPayment() {
  withFlags({ ENABLE_ACH_PAYMENTS: false }, () => {
    assert.throws(() => payment.processACHPayment({ account: '123' }));
  });
  withFlags({ ENABLE_ACH_PAYMENTS: true }, () => {
    assert.strictEqual(
      payment.processACHPayment({ account: '123' }),
      'ACH payment processed for account 123'
    );
  });
}

function testSearch() {
  const invoices = ['January', 'February'];
  withFlags({ ENABLE_NEW_SEARCH: false }, () => {
    assert.deepStrictEqual(searchInvoices('Jan', invoices), invoices);
  });
  withFlags({ ENABLE_NEW_SEARCH: true }, () => {
    assert.deepStrictEqual(searchInvoices('Jan', invoices), ['January']);
  });
}

testAutopay();
testACHPayment();
testSearch();
console.log('All tests passed.');
