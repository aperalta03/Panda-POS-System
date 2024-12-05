
/**
 * 
 * @author Alonso Peralta Espinoza
 *
 * Inserts data from `salesRecord` into the `sales` table and assigns new sale numbers.
 *
 * @description
 * - Transfers data from the temporary `salesRecord` table into the permanent `sales` table.
 * - Generates a new sale number using the `sales_sale_number_seq` sequence.
 *
 * @columns
 * - `sale_number`: New unique identifier for the sale.
 * - `date_of_sale`: Date of the sale.
 * - `employee_id`: ID of the employee who processed the sale.
 * - `time_of_sale`: Time of the sale.
 * - `price`: Total price of the sale.
 * - `franchise_id`: Defaulted to 1 in this script for all transferred records.
 *
 * @usage
 * - Finalizes sales data by transferring it to the `sales` table for permanent storage and analysis.
 */


INSERT INTO sales (sale_number, date_of_sale, employee_id, time_of_sale, price, franchise_id)
SELECT nextval('sales_sale_number_seq'), sr.saleDate, sr.employeeID::integer, sr.saleTime, sr.totalPrice, 1
FROM salesRecord sr;