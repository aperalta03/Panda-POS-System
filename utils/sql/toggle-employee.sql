-- Toggle employee is_active status

/**
 * 
 ** @author Alonso Peralta Espinoza
 *
 * Toggles the active status (`is_active`) of an employee.
 *
 * @description
 * - Updates the `is_active` status of an employee in the database based on their `employee_id`.
 *
 * @parameters
 * - `$1`: The new `is_active` status (`true` for active, `false` for inactive).
 * - `$2`: The ID of the employee whose status is being updated.
 *
 * @usage
 * - Used for enabling or disabling employee access in the system.
 */


UPDATE employees 
SET is_active = $1 
WHERE employee_id = $2;