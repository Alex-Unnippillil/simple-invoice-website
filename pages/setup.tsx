import React, { useState } from 'react';
import { useRouter } from 'next/router';

export default function Setup() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#000000');
  const [secondaryColor, setSecondaryColor] = useState('#ffffff');
  const [logo, setLogo] = useState('');

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setLogo(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/organization', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, primaryColor, secondaryColor, logo }),
    });
    router.push('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Organization Setup</h1>
      <label>
        Name
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <br />
      <label>
        Primary Color
        <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
      </label>
      <br />
      <label>
        Secondary Color
        <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} />
      </label>
      <br />
      <label>
        Logo
        <input type="file" accept="image/*" onChange={handleLogoChange} />
      </label>
      <br />
      <button type="submit">Save</button>
    </form>
  );
}
