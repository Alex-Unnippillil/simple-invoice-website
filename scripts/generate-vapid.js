const { generateVAPIDKeys } = require('web-push');
const fs = require('fs');
const path = require('path');

const keys = generateVAPIDKeys();
const file = path.join(__dirname, '..', 'config', 'vapid.json');
fs.mkdirSync(path.dirname(file), { recursive: true });
fs.writeFileSync(file, JSON.stringify(keys, null, 2));
console.log('VAPID keys written to', file);
