const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const migrationsDir = path.join(__dirname, '..', 'db', 'migrations');

async function runMigrations(client) {
  const files = fs.readdirSync(migrationsDir).sort();
  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    await client.query(sql);
  }
}

describe('RLS tenant isolation', () => {
  let client;

  beforeAll(async () => {
    const admin = new Client({ connectionString: process.env.ADMIN_DATABASE_URL || 'postgres://postgres:postgres@localhost/rlstest' });
    await admin.connect();
    await runMigrations(admin);
    await admin.query("DROP ROLE IF EXISTS appuser");
    await admin.query("CREATE ROLE appuser LOGIN PASSWORD 'password'");
    await admin.query("GRANT SELECT, INSERT ON invoices, payments TO appuser");
    await admin.query("GRANT USAGE, SELECT ON SEQUENCE invoices_id_seq TO appuser");
    await admin.query("GRANT USAGE, SELECT ON SEQUENCE payments_id_seq TO appuser");
    await admin.end();

    client = new Client({ connectionString: process.env.DATABASE_URL || 'postgres://appuser:password@localhost/rlstest' });
    await client.connect();
  });

  afterAll(async () => {
    await client.end();
  });

  test('tenants only access their own data', async () => {
    await client.query("SET app.tenant_id = 'tenant1'");
    await client.query("INSERT INTO invoices (tenant_id, amount) VALUES ('tenant1', 100), ('tenant1', 200)");
    await client.query("INSERT INTO payments (tenant_id, amount) VALUES ('tenant1', 50)");

    await client.query("SET app.tenant_id = 'tenant2'");
    await client.query("INSERT INTO invoices (tenant_id, amount) VALUES ('tenant2', 300)");
    await client.query("INSERT INTO payments (tenant_id, amount) VALUES ('tenant2', 75)");

    await client.query("SET app.tenant_id = 'tenant1'");
    const inv1 = await client.query('SELECT tenant_id, amount FROM invoices ORDER BY amount');
    const pay1 = await client.query('SELECT tenant_id, amount FROM payments ORDER BY amount');
    expect(inv1.rows).toHaveLength(2);
    expect(pay1.rows).toHaveLength(1);
    inv1.rows.forEach(r => expect(r.tenant_id).toBe('tenant1'));
    pay1.rows.forEach(r => expect(r.tenant_id).toBe('tenant1'));

    await client.query("SET app.tenant_id = 'tenant2'");
    const inv2 = await client.query('SELECT tenant_id, amount FROM invoices ORDER BY amount');
    const pay2 = await client.query('SELECT tenant_id, amount FROM payments ORDER BY amount');
    expect(inv2.rows).toHaveLength(1);
    expect(pay2.rows).toHaveLength(1);
    inv2.rows.forEach(r => expect(r.tenant_id).toBe('tenant2'));
    pay2.rows.forEach(r => expect(r.tenant_id).toBe('tenant2'));
  });
});
