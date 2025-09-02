const fs = require('fs');
const path = require('path');

const settingsPath = path.join(__dirname, '..', 'organizationSettings.json');

function readSettings() {
  try {
    const raw = fs.readFileSync(settingsPath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return { provider: 'default' };
  }
}

function writeSettings(settings) {
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
}

function getProvider() {
  const settings = readSettings();
  return settings.provider || 'default';
}

function setProvider(provider) {
  const settings = readSettings();
  settings.provider = provider;
  writeSettings(settings);
}

module.exports = {
  getProvider,
  setProvider,
};
