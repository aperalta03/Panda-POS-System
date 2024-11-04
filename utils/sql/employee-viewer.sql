-- employee-viewer.sql
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