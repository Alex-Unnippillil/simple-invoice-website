CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    amount NUMERIC NOT NULL
);

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    amount NUMERIC NOT NULL
);
