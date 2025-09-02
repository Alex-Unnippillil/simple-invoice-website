const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/organization.json');

function loadOrganization() {
  if (!fs.existsSync(DATA_FILE)) {
    return null;
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const data = JSON.parse(raw);
    if (!data || Object.keys(data).length === 0) {
      return null;
    }
    return data;
  } catch (err) {
    console.error('Failed to load organization', err);
    return null;
  }
}

function saveOrganization(org) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(org, null, 2));
}

module.exports = {
  loadOrganization,
  saveOrganization,
};
