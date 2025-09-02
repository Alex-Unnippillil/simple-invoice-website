-- Search tenants by name or units by identifier using LIKE and trigram similarity.
-- Replace $1 with the search term.

-- Tenant search
SELECT * FROM tenants
WHERE name ILIKE '%' || $1 || '%' OR similarity(name, $1) > 0.1
ORDER BY similarity(name, $1) DESC;

-- Unit search
SELECT * FROM units
WHERE identifier ILIKE '%' || $1 || '%' OR similarity(identifier, $1) > 0.1
ORDER BY similarity(identifier, $1) DESC;
