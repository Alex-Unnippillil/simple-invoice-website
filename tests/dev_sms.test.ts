import fs from 'fs';
import path from 'path';

import { sendDueMessage } from '../lib/sms';

async function run() {
  const logPath = path.join(__dirname, '..', '.dev', 'sms.log');
  await fs.promises.rm(logPath, { force: true });
  await sendDueMessage('+15555555555', 'http://example.com');
  const contents = await fs.promises.readFile(logPath, 'utf8');
  if (!contents.includes('http://example.com')) {
    console.error('Log entry missing');
    process.exit(1);
  }
  console.log('log contents:\n' + contents.trim());
}

run();

