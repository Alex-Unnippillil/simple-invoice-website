const fs = require('fs');
const path = require('path');
const { initialize } = require('unleash-client');

let client;

function initFlags() {
  if (client) {
    return client;
  }

  const environment = process.env.NODE_ENV || 'development';
  const segment = process.env.USER_SEGMENT || 'default';
  const configPath = path.join(__dirname, '..', 'feature-flags.json');
  const raw = fs.readFileSync(configPath, 'utf-8');
  const config = JSON.parse(raw);

  // merge default and segment-specific flags
  const envConfig = config[environment] || {};
  const defaults = envConfig.default || {};
  const segments = (envConfig.segments && envConfig.segments[segment]) || {};
  const toggles = { ...defaults, ...segments };

  // Use Unleash SDK if server details are provided
  if (process.env.UNLEASH_URL && process.env.UNLEASH_TOKEN) {
    client = initialize({
      url: process.env.UNLEASH_URL,
      appName: 'simple-invoice-website',
      environment,
      customHeaders: { Authorization: process.env.UNLEASH_TOKEN }
    });
  } else {
    // fallback local client
    client = {
      isEnabled: (flag) => Boolean(toggles[flag]),
      destroy: () => Promise.resolve()
    };
  }

  return client;
}

function isEnabled(flag) {
  if (!client) {
    throw new Error('Feature flags not initialized');
  }
  return client.isEnabled(flag);
}

module.exports = { initFlags, isEnabled };
