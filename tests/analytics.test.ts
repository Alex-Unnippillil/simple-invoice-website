import assert from 'assert';
import { recordLinkUsage, getLastLinkEmail } from '../lib/analytics';

const testEmail = 'user@example.com';
recordLinkUsage(testEmail);
const saved = getLastLinkEmail();
assert.strictEqual(saved, testEmail);
console.log('Link usage telemetry stored and retrieved successfully');
