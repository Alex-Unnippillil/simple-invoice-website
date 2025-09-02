#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const [env, flag, value] = process.argv.slice(2);
if (!env || !flag || typeof value === 'undefined') {
  console.log('Usage: node scripts/toggle-flag.js <env> <flag> <true|false>');
  process.exit(1);
}

const configPath = path.join(__dirname, '..', 'feature-flags.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
config[env] = config[env] || { default: {}, segments: {} };
config[env].default = config[env].default || {};
config[env].default[flag] = value === 'true';
fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
console.log(`Flag ${flag} set to ${value} in ${env}`);
