-- CSE340 Database Rebuild File
-- This file contains all SQL statements needed to rebuild the course database
-- Author: Nick Granados
-- Date: September 12, 2025

-- Drop existing tables and types if they exist (for clean rebuild)
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS classification CASCADE;
DROP TABLE IF EXISTS account CASCADE;
DROP TYPE IF EXISTS account_type CASCADE;

-- Create PostgreSQL custom type for account_type
CREATE TYPE account_type AS ENUM ('Client', 'Employee', 'Admin');

-- Create account table
CREATE TABLE account (
    account_id SERIAL PRIMARY KEY,
    account_firstname VARCHAR(20) NOT NULL,
    account_lastname VARCHAR(30) NOT NULL,
    account_email VARCHAR(50) NOT NULL UNIQUE,
    account_password VARCHAR(60) NOT NULL,
    account_type account_type DEFAULT 'Client'
);

-- Create classification table
CREATE TABLE classification (
    classification_id SERIAL PRIMARY KEY,
    classification_name VARCHAR(30) NOT NULL
);

-- Create inventory table
CREATE TABLE inventory (
    inv_id SERIAL PRIMARY KEY,
    inv_make VARCHAR(30) NOT NULL,
    inv_model VARCHAR(30) NOT NULL,
    inv_year INTEGER NOT NULL,
    inv_description TEXT NOT NULL,
    inv_image VARCHAR(50) NOT NULL,
    inv_thumbnail VARCHAR(50) NOT NULL,
    inv_price DECIMAL(8,2) NOT NULL,
    inv_miles INTEGER NOT NULL,
    inv_color VARCHAR(20) NOT NULL,
    classification_id INTEGER NOT NULL,
    FOREIGN KEY (classification_id) REFERENCES classification (classification_id)
);

-- Insert data into classification table
INSERT INTO classification (classification_name) VALUES 
('Custom'),
('Sport'),
('SUV'),
('Truck'),
('Sedan');

-- Insert data into inventory table
INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES 
('GM', 'Hummer', 2021, 'This is a "Hummer" H1 in a beautiful condition, it has small interiors, but a great engine', '/images/hummer.jpg', '/images/hummer-tn.jpg', 31499, 41205, 'Yellow', 2),
('Jeep', 'Wrangler', 2019, 'The Jeep Wrangler is a mid-size SUV, with it''s comfort and precision, it is the most sold 4x4 in the world', '/images/wrangler.jpg', '/images/wrangler-tn.jpg', 28045, 41205, 'Silver', 2),
('Ford', 'Mustang', 2022, 'This Ford Mustang is a classic American sports car, known for its powerful performance and iconic design', '/images/mustang.jpg', '/images/mustang-tn.jpg', 35000, 25000, 'Red', 2),
('Chevrolet', 'Camaro', 2021, 'The Chevrolet Camaro is a true muscle car with exceptional handling and aggressive styling', '/images/camaro.jpg', '/images/camaro-tn.jpg', 32000, 30000, 'Black', 2),
('Toyota', 'Prius', 2023, 'This Toyota Prius offers excellent fuel economy and environmental friendliness without sacrificing comfort', '/images/prius.jpg', '/images/prius-tn.jpg', 28000, 15000, 'Blue', 5),
('Honda', 'Accord', 2022, 'The Honda Accord is a reliable midsize sedan with spacious interior and advanced safety features', '/images/accord.jpg', '/images/accord-tn.jpg', 26000, 22000, 'White', 5);

-- queries 4 and 6 from Task 1

-- Query 4: Update GM Hummer record description using PostgreSQL REPLACE function
-- Change "small interiors" to "a huge interior"
UPDATE inventory 
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior') 
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- Query 6: Update all records to add "/vehicles" to image and thumbnail paths
-- Update both inv_image and inv_thumbnail columns in single query
UPDATE inventory 
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');