UPDATE employees
SET 
    first_name = $1, 
    last_name = $2, 
    phone_number = $3, 
    hourly_rate = $4, 
    is_manager = $5, 
    is_part_time = $6 
WHERE employee_id = $7;