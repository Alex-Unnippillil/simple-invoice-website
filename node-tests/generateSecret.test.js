const test = require('node:test');
const assert = require('node:assert');
const { generateSecret } = require('../scripts/generate-secret');

test('generated secret has correct length', () => {
  const secret = generateSecret();
  assert.strictEqual(secret.length, 64); // 32 bytes -> 64 hex chars
});

test('generated secrets are random', () => {
  const secret1 = generateSecret();
  const secret2 = generateSecret();
  assert.notStrictEqual(secret1, secret2);
});
