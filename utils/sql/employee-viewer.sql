-- employee-viewer.sql

/**
 * 
 ** @author Alonso Peralta Espinoza
 *
 * Retrieves employee details from the database, including personal and job-related information.
 *
 * @description
 * - Fetches employee details such as name, ID, phone number, date of birth, hourly rate, and status.
 * - The result is ordered by the employee's first name.
 *
 * @columns
 * - `first_name`: Employee's first name.
 * - `last_name`: Employee's last name.
 * - `employee_id`: Unique ID for the employee.
 * - `phone_number`: Employee's contact phone number.
 * - `date_of_birth`: Employee's date of birth (formatted as `dob`).
 * - `hourly_rate`: Employee's hourly rate of pay.
 * - `pt`: Indicates if the employee is part-time (`true` or `false`).
 * - `active`: Indicates if the employee is currently active (`true` or `false`).
 * - `is_manager`: Indicates if the employee has manager privileges (`true` or `false`).
 *
 * @order
 * - Results are ordered by `first_name` in ascending order.
 *
 * @usage
 * This query is typically used in employee management systems to display or manage employee records.
 */

SELECT 
    first_name,
    last_name,
    employee_id,
    phone_number,
    dob AS date_of_birth,
    hourly_rate,
    is_part_time AS pt,
    is_active AS active,
    is_manager
FROM 
    employees
ORDER BY 
    first_name;