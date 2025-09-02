CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS index_tenants_on_name_trgm ON tenants USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS index_units_on_identifier_trgm ON units USING gin (identifier gin_trgm_ops);
