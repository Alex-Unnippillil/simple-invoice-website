import sqlite3
from contextlib import closing

DB_FILE = 'database.db'


def get_db():
    return sqlite3.connect(DB_FILE)


def init_db():
    with closing(get_db()) as conn:
        cur = conn.cursor()
        cur.execute(
            'CREATE TABLE IF NOT EXISTS tenants (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT, xero_contact_id TEXT)'
        )
        cur.execute(
            'CREATE TABLE IF NOT EXISTS invoices (id INTEGER PRIMARY KEY AUTOINCREMENT, tenant_id INTEGER, amount REAL, xero_invoice_id TEXT, xero_invoice_url TEXT, FOREIGN KEY(tenant_id) REFERENCES tenants(id))'
        )
        conn.commit()


def add_tenant(name, email):
    with closing(get_db()) as conn:
        cur = conn.cursor()
        cur.execute('INSERT INTO tenants (name, email) VALUES (?, ?)', (name, email))
        conn.commit()
        return cur.lastrowid


def update_tenant_xero(tenant_id, contact_id):
    with closing(get_db()) as conn:
        cur = conn.cursor()
        cur.execute('UPDATE tenants SET xero_contact_id=? WHERE id=?', (contact_id, tenant_id))
        conn.commit()


def get_tenants():
    with closing(get_db()) as conn:
        cur = conn.cursor()
        cur.execute('SELECT id, name, email, xero_contact_id FROM tenants')
        return cur.fetchall()


def add_invoice(tenant_id, amount):
    with closing(get_db()) as conn:
        cur = conn.cursor()
        cur.execute('INSERT INTO invoices (tenant_id, amount) VALUES (?, ?)', (tenant_id, amount))
        conn.commit()
        return cur.lastrowid


def update_invoice_xero(invoice_id, xero_id, url):
    with closing(get_db()) as conn:
        cur = conn.cursor()
        cur.execute('UPDATE invoices SET xero_invoice_id=?, xero_invoice_url=? WHERE id=?', (xero_id, url, invoice_id))
        conn.commit()


def get_invoices():
    with closing(get_db()) as conn:
        cur = conn.cursor()
        cur.execute('SELECT invoices.id, tenants.name, invoices.amount, invoices.xero_invoice_url FROM invoices JOIN tenants ON invoices.tenant_id=tenants.id')
        return cur.fetchall()
