CREATE EXTENSION IF NOT EXISTS pg_trgm;

DROP TABLE IF EXISTS units;
CREATE TABLE units (id serial PRIMARY KEY, identifier text NOT NULL);
CREATE INDEX ON units USING gin (identifier gin_trgm_ops);

INSERT INTO units (identifier) VALUES ('10-B');

-- Search for "Apt 10B"
SELECT identifier FROM units
WHERE identifier ILIKE '%' || 'Apt 10B' || '%' OR similarity(identifier, 'Apt 10B') > 0.1;
