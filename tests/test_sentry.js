const assert = require('assert');
const { Sentry, initSentry } = require('../sentry');

async function resetSentry() {
  const client = Sentry.getCurrentHub().getClient();
  if (client) {
    await client.close();
    Sentry.getCurrentHub().setClient(null);
  }
}

async function testDevelopment() {
  await resetSentry();
  process.env.NODE_ENV = 'development';
  const events = [];
  const transport = () => ({
    send: (envelope) => {
      events.push(envelope);
      return Promise.resolve({ status: 'success' });
    },
    flush: () => Promise.resolve(true),
  });
  const enabled = initSentry({ transport });
  Sentry.captureMessage('dev test');
  await Sentry.flush(200);
  assert.strictEqual(enabled, false);
  assert.strictEqual(events.length, 0);
}

async function testProduction() {
  await resetSentry();
  process.env.NODE_ENV = 'production';
  process.env.SENTRY_DSN = 'https://examplePublicKey@o0.ingest.sentry.io/0';
  const events = [];
  const transport = () => ({
    send: (envelope) => {
      events.push(envelope);
      return Promise.resolve({ status: 'success' });
    },
    flush: () => Promise.resolve(true),
  });
  const enabled = initSentry({ transport });
  Sentry.captureMessage('prod test');
  await Sentry.flush(200);
  assert.strictEqual(enabled, true);
  assert.strictEqual(events.length, 1);
}

(async () => {
  await testDevelopment();
  await testProduction();
  console.log('Sentry tests passed');
})();
