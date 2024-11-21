CREATE TABLE employee_login (
    employee_id INT REFERENCES employees(employee_id) ON DELETE SET NULL,
    email VARCHAR(255) UNIQUE NOT NULL PRIMARY KEY,
    password VARCHAR(255) NOT NULL
    verified BOOLEAN DEFAULT false
);