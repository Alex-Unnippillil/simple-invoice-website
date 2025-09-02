import { requireAuth } from '../../../lib/auth/requireAuth';

export default async function DataExportPage() {
  await requireAuth();
  return (
    <main>
      <h1>Export Your Data</h1>
      <p>Download a copy of your information.</p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <a href="/api/data-export?format=json" download>
          <button type="button">Export JSON</button>
        </a>
        <a href="/api/data-export?format=csv" download>
          <button type="button">Export CSV</button>
        </a>
      </div>
    </main>
  );
}
