import React, { useState } from 'react';

export default function Settings() {
  const [email, setEmail] = useState(true);
  const [sms, setSms] = useState(false);
  const [push, setPush] = useState(true);

  return (
    <div>
      <h1>Notification Settings</h1>
      <label>
        <input
          type="checkbox"
          checked={email}
          onChange={(e) => setEmail(e.target.checked)}
        />
        Email
      </label>
      <br />
      <label>
        <input
          type="checkbox"
          checked={sms}
          onChange={(e) => setSms(e.target.checked)}
        />
        SMS
      </label>
      <br />
      <label>
        <input
          type="checkbox"
          checked={push}
          onChange={(e) => setPush(e.target.checked)}
        />
        Push
      </label>
    </div>
  );
}
