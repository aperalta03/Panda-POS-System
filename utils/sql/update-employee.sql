-- ==============================================================================
-- SQL Script: update-employee.sql
-- 
-- Author: Conner Black
-- 
-- Description:
-- This SQL script updates an employee's information in the `employees` table 
-- based on their `employee_id`. It allows the modification of an employee's 
-- details such as their name, phone number, hourly rate, and employment status 
-- (manager or part-time).
-- 
-- Features:
-- - Updates the following employee fields:
--   - `first_name`: Employee's first name.
--   - `last_name`: Employee's last name.
--   - `phone_number`: Employee's contact number.
--   - `hourly_rate`: Employee's hourly wage.
--   - `is_manager`: Whether the employee is a manager.
--   - `is_part_time`: Whether the employee is part-time.
-- - The employee is identified by their `employee_id`, ensuring the correct employee is updated.
-- 
-- Dependencies:
-- This script assumes the existence of the `employees` table with the following columns:
--   - employee_id: Text (Unique identifier for each employee)
--   - first_name: Text (Employee's first name)
--   - last_name: Text (Employee's last name)
--   - phone_number: Text (Employee's contact phone number)
--   - hourly_rate: Numeric (Employee's hourly wage)
--   - is_manager: Boolean (Indicates if the employee is a manager)
--   - is_part_time: Boolean (Indicates if the employee is part-time)
-- 
-- Input:
-- - `first_name`: The updated first name for the employee.
-- - `last_name`: The updated last name for the employee.
-- - `phone_number`: The updated contact number for the employee.
-- - `hourly_rate`: The updated hourly wage for the employee.
-- - `is_manager`: The updated status of whether the employee is a manager.
-- - `is_part_time`: The updated status of whether the employee is part-time.
-- - `employee_id`: The unique identifier of the employee whose details are being updated.
-- 
-- Output:
-- - Updates the employee record in the `employees` table where `employee_id` matches the provided value.
-- 
-- Example:
-- If executed with the following parameters:
--   $1 = 'John'
--   $2 = 'Doe'
--   $3 = '123-456-7890'
--   $4 = 25.50
--   $5 = true  -- Manager
--   $6 = false -- Not Part-Time
--   $7 = 'EMP123'
-- The employee with `employee_id = 'EMP123'` will have their details updated.
-- 
-- ==============================================================================
-- SQL Query to Update Employee Information
-- ==============================================================================
UPDATE employees
SET 
    first_name = $1, 
    last_name = $2, 
    phone_number = $3, 
    hourly_rate = $4, 
    is_manager = $5, 
    is_part_time = $6 
WHERE employee_id = $7;

-- ==============================================================================
-- End of SQL Script
-- ==============================================================================