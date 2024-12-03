-- ==============================================================================
-- SQL Script: employee-details.sql
-- 
-- Author: Conner Black
-- 
-- Description:
-- This SQL script retrieves all columns for a specific employee from the `employees` table 
-- based on the provided `employee_id`. The query is typically used when detailed 
-- information about an employee is needed, such as for editing employee data 
-- or verifying employee details.
-- 
-- Features:
-- - Retrieves all data associated with a specific employee using their `employee_id`.
-- - Useful for detailed views or updating an employee's record.
-- 
-- Dependencies:
-- This script assumes the existence of the `employees` table with the following columns:
--   - employee_id: Integer (Unique identifier for each employee)
--   - first_name: Text (Employee's first name)
--   - last_name: Text (Employee's last name)
--   - dob: Date (Employee's date of birth)
--   - phone_number: Text (Employee's phone number)
--   - hourly_rate: Numeric (Employee's hourly rate)
--   - is_manager: Boolean (Indicates if the employee is a manager)
--   - is_part_time: Boolean (Indicates if the employee works part-time)
--   - is_active: Boolean (Indicates if the employee is currently active)
-- 
-- Input:
-- - `employee_id`: The unique identifier for the employee whose data is to be fetched.
-- 
-- Output:
-- - All details of the employee with the provided `employee_id`.
-- 
-- Example:
-- If executed with a specific `employee_id`, the query might return results like the following:
-- 
-- +-------------+------------+-----------+------------+-----------------+--------------+-------------+--------------+-----------+
-- | employee_id | first_name | last_name | dob        | phone_number    | hourly_rate  | is_manager  | is_part_time | is_active |
-- +-------------+------------+-----------+------------+-----------------+--------------+-------------+--------------+-----------+
-- | 1           | John       | Doe       | 1990-05-15 | 123-456-7890    | 20.00        | true        | false        | true      |
-- +-------------+------------+-----------+------------+-----------------+--------------+-------------+--------------+-----------+
-- ==============================================================================
-- SQL Query to Retrieve Employee Details by Employee ID
-- ==============================================================================
SELECT * 
FROM employees 
WHERE employee_id = $1;

-- ==============================================================================
-- End of SQL Script
-- ==============================================================================