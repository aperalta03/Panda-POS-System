CREATE TABLE employees (
    employee_id int PRIMARY KEY,
    first_name varchar,
    last_name varchar,
    DOB date,
    phone_number bigint,
    hourly_rate float,
    is_manager boolean,
    is_part_time boolean,
    is_active boolean
);