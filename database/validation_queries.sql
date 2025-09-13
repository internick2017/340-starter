-- CSE340 Assignment 2 - SQL Validation Queries

-- Test if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('account', 'classification', 'inventory');

-- Test if custom type exists
SELECT typname 
FROM pg_type 
WHERE typname = 'account_type';

-- Check account table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'account' 
ORDER BY ordinal_position;

-- Check classification table data
SELECT * FROM classification;

-- Check inventory table data (first few records)
SELECT inv_id, inv_make, inv_model, inv_year, inv_price, classification_id 
FROM inventory 
LIMIT 5;

-- Test the JOIN query (should return Sport category vehicles)
SELECT i.inv_make, i.inv_model, c.classification_name 
FROM inventory i 
INNER JOIN classification c ON i.classification_id = c.classification_id 
WHERE c.classification_name = 'Sport';

-- Verify image paths contain "/vehicles" after running query 6
SELECT inv_make, inv_model, inv_image, inv_thumbnail 
FROM inventory 
WHERE inv_image LIKE '%/vehicles/%' 
LIMIT 3;