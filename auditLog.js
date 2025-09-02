const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, 'logs', 'audit.log');
fs.mkdirSync(path.dirname(logPath), { recursive: true });

function write(entry) {
  const line = `[${new Date().toISOString()}] ${entry}\n`;
  fs.appendFileSync(logPath, line);
}

module.exports = { write };
