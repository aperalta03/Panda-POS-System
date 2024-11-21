CREATE TABLE employee_login (
    employee_id INT,
    email VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    verified BOOLEAN DEFAULT false
);
