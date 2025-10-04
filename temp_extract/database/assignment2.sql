-- CSE340 Assignment 2 - Task 1: SQL Statements
-- Author: Nick Granados
-- Date: September 12, 2025

-- 1. Insert Tony Stark record into account table
-- Note: account_id and account_type fields handle their own values
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- 2. Modify Tony Stark record to change account_type to "Admin"
-- Using email as identifier since it's unique
UPDATE account 
SET account_type = 'Admin' 
WHERE account_email = 'tony@starkent.com';

-- 3. Delete the Tony Stark record from the database
-- Using email as identifier since it's unique
DELETE FROM account 
WHERE account_email = 'tony@starkent.com';

-- 4. Update GM Hummer record description using PostgreSQL REPLACE function
-- Change "small interiors" to "a huge interior"
UPDATE inventory 
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior') 
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- 5. Inner join to select make, model from inventory and classification name for "Sport" category
-- Should return two records
SELECT i.inv_make, i.inv_model, c.classification_name 
FROM inventory i 
INNER JOIN classification c ON i.classification_id = c.classification_id 
WHERE c.classification_name = 'Sport';

-- 6. Update all records to add "/vehicles" to image and thumbnail paths
-- Update both inv_image and inv_thumbnail columns in single query
UPDATE inventory 
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');