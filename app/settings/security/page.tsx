'use client';

import { useState } from 'react';

export default function SecurityPage() {
  const [qr, setQr] = useState<string | null>(null);
  const [secret, setSecret] = useState('');
  const [token, setToken] = useState('');
  const [verified, setVerified] = useState(false);
  const [codes, setCodes] = useState<string[]>([]);

  const startEnroll = async () => {
    const res = await fetch('/api/totp/setup', { method: 'POST' });
    if (!res.ok) return;
    const data = await res.json();
    setQr(data.qr);
    setSecret(data.secret);
  };

  const verify = async () => {
    const res = await fetch('/api/totp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    const data = await res.json();
    if (data.valid) {
      setVerified(true);
      setCodes(data.recoveryCodes);
    }
  };

  return (
    <div>
      <h1>Security Settings</h1>
      {!qr && (
        <button onClick={startEnroll}>Enable 2FA</button>
      )}
      {qr && !verified && (
        <div>
          <p>Scan the QR code with your authenticator app.</p>
          <img src={qr} alt="QR code" />
          <p>Secret: {secret}</p>
          <input
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="123456"
          />
          <button onClick={verify}>Verify</button>
        </div>
      )}
      {verified && (
        <div>
          <h2>Recovery Codes</h2>
          <ul>
            {codes.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
