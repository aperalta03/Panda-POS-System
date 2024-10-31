-- Toggle employee is_active status
UPDATE employees 
SET is_active = $1 
WHERE employee_id = $2;