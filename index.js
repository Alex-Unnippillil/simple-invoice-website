const fs = require('fs');
const path = require('path');

const POLICIES_FILE = path.join(__dirname, 'retention-policies.json');
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const LOG_FILE = path.join(__dirname, 'deletion.log');

function loadPolicies() {
  try {
    return JSON.parse(fs.readFileSync(POLICIES_FILE, 'utf8'));
  } catch (e) {
    return {};
  }
}

function savePolicies(policies) {
  fs.writeFileSync(POLICIES_FILE, JSON.stringify(policies, null, 2));
}

// Allow organizations to configure retention duration
function setRetention(org, days) {
  const policies = loadPolicies();
  if (!policies[org]) {
    policies[org] = { retentionDays: days, legalHolds: [] };
  } else {
    policies[org].retentionDays = days;
  }
  savePolicies(policies);
}

// Allow legal hold overrides
function addLegalHold(org, file) {
  const policies = loadPolicies();
  if (!policies[org]) {
    policies[org] = { retentionDays: 30, legalHolds: [] };
  }
  if (!policies[org].legalHolds.includes(file)) {
    policies[org].legalHolds.push(file);
  }
  savePolicies(policies);
}

function removeLegalHold(org, file) {
  const policies = loadPolicies();
  if (!policies[org]) return;
  policies[org].legalHolds = policies[org].legalHolds.filter(f => f !== file);
  savePolicies(policies);
}

// Notify users (console placeholder)
function notifyUser(org, filePath) {
  console.log(`Notifying ${org} about deletion of ${filePath}`);
}

// Log deletions for audit
function logDeletion(org, filePath) {
  const line = `${new Date().toISOString()} | ${org} | ${filePath}\n`;
  fs.appendFileSync(LOG_FILE, line);
}

// Delete files older than policy unless on legal hold
function checkForDeletions() {
  const policies = loadPolicies();
  const now = Date.now();

  Object.keys(policies).forEach(org => {
    const { retentionDays, legalHolds } = policies[org];
    if (!retentionDays) return;

    fs.readdirSync(UPLOAD_DIR).forEach(file => {
      const filePath = path.join(UPLOAD_DIR, file);
      const stats = fs.statSync(filePath);
      const ageDays = (now - stats.mtimeMs) / (1000 * 60 * 60 * 24);
      if (ageDays > retentionDays && !legalHolds.includes(file)) {
        notifyUser(org, filePath);
        fs.unlinkSync(filePath);
        logDeletion(org, filePath);
      }
    });
  });
}

// Schedule job daily when run directly
if (require.main === module) {
  setInterval(checkForDeletions, 24 * 60 * 60 * 1000);
}

module.exports = { setRetention, addLegalHold, removeLegalHold, checkForDeletions };
