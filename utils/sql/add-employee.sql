-- ==============================================================================
-- SQL Script: add-employee.sql
-- 
-- Author: Conner Black
-- 
-- Description:
-- This SQL script inserts a new employee record into the `employees` table. The 
-- script accepts details about an employee, including employee ID, first and last 
-- name, date of birth, phone number, hourly rate, management status, part-time 
-- status, and whether the employee is currently active. The `is_active` field is 
-- set based on the provided input.
-- 
-- Features:
-- - Inserts a new employee record into the `employees` table.
-- - Accepts employee details: employee_id, first_name, last_name, dob, phone_number, 
--   hourly_rate, is_manager, is_part_time, and is_active.
-- - Supports dynamic insertion of all the fields as parameters.
-- 
-- Dependencies:
-- This script assumes the existence of the `employees` table with the following columns:
--   - employee_id: Integer (Employee's unique ID)
--   - first_name: Text (Employee's first name)
--   - last_name: Text (Employee's last name)
--   - dob: Date (Employee's date of birth)
--   - phone_number: Text (Employee's phone number)
--   - hourly_rate: Numeric (Employee's hourly rate)
--   - is_manager: Boolean (Indicates if the employee is a manager)
--   - is_part_time: Boolean (Indicates if the employee is part-time)
--   - is_active: Boolean (Indicates if the employee is currently active)
-- 
-- Input:
-- The following input parameters are expected:
--   - employee_id: Unique identifier for the employee (e.g., 12345).
--   - first_name: The employee's first name (e.g., 'John').
--   - last_name: The employee's last name (e.g., 'Doe').
--   - dob: The employee's date of birth (e.g., '1985-12-31').
--   - phone_number: The employee's phone number (e.g., '555-1234').
--   - hourly_rate: The employee's hourly wage (e.g., 15.50).
--   - is_manager: Boolean indicating if the employee is a manager (e.g., TRUE or FALSE).
--   - is_part_time: Boolean indicating if the employee is part-time (e.g., TRUE or FALSE).
--   - is_active: Boolean indicating if the employee is currently active (e.g., TRUE or FALSE).
-- 
-- Output:
-- If successful, the script inserts a new employee record into the database. A confirmation 
-- message is returned, indicating the successful insertion of the new employee.
-- 
-- Example:
-- If the values below are passed to the script, the following SQL insert will occur:
-- INSERT INTO employees (employee_id, first_name, last_name, dob, phone_number, hourly_rate, 
-- is_manager, is_part_time, is_active)
-- VALUES (12345, 'John', 'Doe', '1985-12-31', '555-1234', 15.50, TRUE, FALSE, TRUE);
-- 
-- ==============================================================================
-- SQL Query to Add a New Employee
-- ==============================================================================
INSERT INTO employees 
    (
        employee_id, 
        first_name, 
        last_name, 
        dob, 
        phone_number, 
        hourly_rate, 
        is_manager, 
        is_part_time, 
        is_active
    )
VALUES
    (
        $1,  -- employee_id (e.g., 12345)
        $2,  -- first_name (e.g., 'John')
        $3,  -- last_name (e.g., 'Doe')
        $4,  -- dob (e.g., '1985-12-31')
        $5,  -- phone_number (e.g., '555-1234')
        $6,  -- hourly_rate (e.g., 15.50)
        $7,  -- is_manager (e.g., TRUE or FALSE)
        $8,  -- is_part_time (e.g., TRUE or FALSE)
        $9   -- is_active (e.g., TRUE or FALSE)
    );

-- ==============================================================================
-- End of SQL Script
-- ==============================================================================