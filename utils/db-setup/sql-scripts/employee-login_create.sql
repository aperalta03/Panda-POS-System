CREATE TABLE employee_login (
    employee_id INT PRIMARY KEY REFERENCES employees(employee_id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);