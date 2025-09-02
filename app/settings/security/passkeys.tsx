'use client';

import { useState } from 'react';
import {
  startRegistration,
  startAuthentication,
} from '@simplewebauthn/browser';

interface Device {
  id: string;
  name: string;
}

export default function PasskeysManager() {
  const [devices, setDevices] = useState<Device[]>([]);

  async function register() {
    const resp = await fetch('/api/passkeys/register-options');
    const options = await resp.json();
    const attResp = await startRegistration(options);
    await fetch('/api/passkeys/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(attResp),
    });
    const newList = await fetch('/api/passkeys/devices').then((r) => r.json());
    setDevices(newList);
  }

  async function authenticate(deviceId?: string) {
    const resp = await fetch('/api/passkeys/authenticate-options');
    const options = await resp.json();
    if (deviceId) {
      options.allowCredentials = options.allowCredentials?.filter(
        (d: any) => d.id === deviceId,
      );
    }
    const authResp = await startAuthentication(options);
    await fetch('/api/passkeys/authenticate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(authResp),
    });
  }

  async function remove(id: string) {
    await fetch(`/api/passkeys/${id}`, { method: 'DELETE' });
    setDevices(devices.filter((d) => d.id !== id));
  }

  return (
    <div>
      <h2 className="text-xl font-bold">Passkeys</h2>
      <p className="mb-4 text-sm text-gray-600">
        Register your device for passwordless login. Supported on desktop and
        mobile browsers.
      </p>
      <button onClick={register} className="mb-4 rounded bg-blue-500 px-4 py-2 text-white">
        Add device
      </button>
      <ul>
        {devices.map((d) => (
          <li key={d.id} className="mb-2 flex items-center justify-between">
            <span>{d.name || d.id}</span>
            <div>
              <button
                className="mr-2 rounded bg-green-500 px-3 py-1 text-white"
                onClick={() => authenticate(d.id)}
              >
                Test
              </button>
              <button
                className="rounded bg-red-500 px-3 py-1 text-white"
                onClick={() => remove(d.id)}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
