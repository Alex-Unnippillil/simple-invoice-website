const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = new sqlite3.Database('oauth.db');
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS tokens (provider TEXT PRIMARY KEY, access_token TEXT, refresh_token TEXT, tenant_id TEXT)');
});

const SECRET = process.env.SECRET_KEY || 'default_secret_key_32bytes_len!';
const IV_LENGTH = 16;

function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-ctr', Buffer.from(SECRET), iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
  const [ivHex, encryptedHex] = text.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encryptedText = Buffer.from(encryptedHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-ctr', Buffer.from(SECRET), iv);
  const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
  return decrypted.toString('utf8');
}

function getStatus(callback) {
  db.all('SELECT provider FROM tokens', (err, rows) => {
    const providers = rows ? rows.map(r => r.provider) : [];
    callback({
      qbo: providers.includes('qbo'),
      xero: providers.includes('xero')
    });
  });
}

app.get('/api/status', (req, res) => {
  getStatus(status => res.json(status));
});

app.post('/api/connect/:provider', (req, res) => {
  const provider = req.params.provider;
  const access = encrypt('dummy_access_token');
  const refresh = encrypt('dummy_refresh_token');
  const tenant = encrypt('dummy_tenant');
  db.run('REPLACE INTO tokens(provider, access_token, refresh_token, tenant_id) VALUES(?,?,?,?)', [provider, access, refresh, tenant], err => {
    if (err) return res.status(500).json({error: 'db error'});
    getStatus(status => res.json(status));
  });
});

app.post('/api/refresh/:provider', (req, res) => {
  const provider = req.params.provider;
  const access = encrypt('new_access_token');
  const refresh = encrypt('new_refresh_token');
  db.run('UPDATE tokens SET access_token=?, refresh_token=? WHERE provider=?', [access, refresh, provider], err => {
    if (err) return res.status(500).json({error: 'db error'});
    getStatus(status => res.json(status));
  });
});

app.post('/api/disconnect/:provider', (req, res) => {
  const provider = req.params.provider;
  db.run('DELETE FROM tokens WHERE provider=?', [provider], err => {
    if (err) return res.status(500).json({error: 'db error'});
    getStatus(status => res.json(status));
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
