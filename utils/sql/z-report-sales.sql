INSERT INTO sales (sale_number, date_of_sale, employee_id, time_of_sale, price, franchise_id)
SELECT nextval('sales_sale_number_seq'), sr.saleDate, sr.employeeID::integer, sr.saleTime, sr.totalPrice, 1
FROM salesRecord sr;