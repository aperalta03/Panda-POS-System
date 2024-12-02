-- ==============================================================================
-- SQL Script: add-customer.sql
-- 
-- Author: Conner Black
-- 
-- Description:
-- This SQL script inserts a new customer record into the `customers` table. The 
-- script accepts the customer's phone number, name, and date of birth as input, 
-- and sets the points to 0 by default upon creation of the customer record.
-- 
-- Features:
-- - Inserts a new record into the `customers` table.
-- - Accepts customer details: phone number, name, and date of birth.
-- - Sets the initial points value to 0 for all new customers.
-- 
-- Dependencies:
-- This script assumes the existence of the `customers` table with the following columns:
--   - phone_number: Text (Customer's phone number, unique for each customer)
--   - name: Text (Customer's name)
--   - dob: Date (Customer's date of birth)
--   - points: Integer (Customer's points, defaulted to 0 for new customers)
-- 
-- Input:
-- The following input parameters are expected:
--   - phone_number: The customer's phone number (e.g., '555-1234').
--   - name: The customer's full name (e.g., 'John Doe').
--   - dob: The customer's date of birth (e.g., '1985-12-31').
-- 
-- Output:
-- If successful, the script inserts a new customer record with the provided details and 
-- a default points value of 0. A confirmation message is returned, indicating the 
-- successful insertion of the new customer.
-- 
-- Example:
-- If the values below are passed to the script, the following SQL insert will occur:
-- INSERT INTO customers (phone_number, name, dob, points)
-- VALUES ('555-1234', 'John Doe', '1985-12-31', 0);
-- 
-- ==============================================================================
-- SQL Query to Add a New Customer
-- ==============================================================================
INSERT INTO customers (phone_number, name, dob, points) 
VALUES (
    $1,  -- phone_number (e.g., '555-1234')
    $2,  -- name (e.g., 'John Doe')
    $3,  -- dob (e.g., '1985-12-31')
    0    -- points (set to 0 by default)
);

-- ==============================================================================
-- End of SQL Script
-- ==============================================================================