#!/usr/bin/env node
const { engines = {} } = require('../package.json');
const required = process.env.REQUIRED_NODE_VERSION || engines.node || '';

function parse(ver) {
  const cleaned = String(ver).replace(/^[^\d]*/, '');
  const [major = '0', minor = '0', patch = '0'] = cleaned.split('.');
  return { major: Number(major), minor: Number(minor), patch: Number(patch) };
}

function isSatisfied(current, required) {
  const c = parse(current);
  const r = parse(required);
  if (c.major !== r.major) return c.major > r.major;
  if (c.minor !== r.minor) return c.minor > r.minor;
  return c.patch >= r.patch;
}

if (required && !isSatisfied(process.versions.node, required)) {
  console.error(`Unsupported Node.js version: ${process.versions.node}.`);
  console.error(`Please use Node.js ${required} or higher.`);
  console.error('Consider using nvm to manage versions: https://github.com/nvm-sh/nvm');
  process.exit(1);
}

