import React, { useEffect, useState } from 'react';

interface Org {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  logo: string;
}

export default function Dashboard() {
  const [org, setOrg] = useState<Org | null>(null);

  useEffect(() => {
    fetch('/api/organization')
      .then((res) => res.json())
      .then(setOrg)
      .catch(() => setOrg(null));
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {org && (
        <div>
          <p>Welcome to {org.name}</p>
          {org.logo && <img src={org.logo} alt="logo" style={{ maxWidth: '200px' }} />}
        </div>
      )}
    </div>
  );
}
