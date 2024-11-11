CREATE TABLE sales (
    sale_number int PRIMARY KEY,
    date_of_sale date,
    employee_id int REFERENCES employees(employee_id),
    time_of_sale time,
    price float,
    franchise_id int
);