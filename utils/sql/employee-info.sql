-- ==============================================================================
-- SQL Script: employee-list.sql
-- 
-- Author: Conner Black
-- 
-- Description:
-- This SQL script selects the `employee_id`, `first_name`, `last_name`, and 
-- `is_manager` columns from the `employees` table. This query is typically used 
-- to retrieve basic information about employees, such as during employee 
-- listings or when checking for management roles.
-- 
-- Features:
-- - Retrieves the basic information (ID, name, and manager status) of employees.
-- - Useful for generating an employee directory or for identifying managers.
-- 
-- Dependencies:
-- This script assumes the existence of the `employees` table with the following columns:
--   - employee_id: Integer (Unique identifier for each employee)
--   - first_name: Text (Employee's first name)
--   - last_name: Text (Employee's last name)
--   - is_manager: Boolean (Indicates if the employee is a manager)
-- 
-- Input:
-- No input parameters are required for this query.
-- 
-- Output:
-- This query returns a list of employees with their IDs, names, and manager status.
-- 
-- Example:
-- If executed, the query might return results like the following:
-- 
-- +-------------+------------+-----------+------------+
-- | employee_id | first_name | last_name | is_manager |
-- +-------------+------------+-----------+------------+
-- | 1           | John       | Doe       | true       |
-- | 2           | Jane       | Smith     | false      |
-- +-------------+------------+-----------+------------+
-- ==============================================================================
-- SQL Query to Retrieve Employee Information
-- ==============================================================================
SELECT
    employee_id,
    first_name,
    last_name,
    is_manager
FROM employees;

-- ==============================================================================
-- End of SQL Script
-- ==============================================================================