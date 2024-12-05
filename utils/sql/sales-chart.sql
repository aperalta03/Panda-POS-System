-- utils/sql/sales-chart.sql

/**
 * 
 * @author Alonso Peralta Espinoza
 *
 * Retrieves sales data for a specific inventory item within a date range.
 *
 * @description
 * - Joins multiple tables to track sales of a specific inventory item over time.
 *
 * @columns
 * - `date_of_sale`: Date of the sale.
 * - `time_of_sale`: Time of the sale.
 * - `item_name`: Name of the inventory item sold.
 *
 * @parameters
 * - `$1`: The name of the inventory item.
 * - `$2`: Start date for the sales data (inclusive).
 * - `$3`: End date for the sales data (inclusive).
 *
 * @filter
 * - Filters sales data to include only those for the specified item and within the given date range.
 *
 * @order
 * - Results are ordered by `date_of_sale` (ascending) and `time_of_sale` (ascending).
 *
 * @usage
 * - Designed for generating sales trends and performance charts for specific inventory items.
 */


SELECT
    s.date_of_sale,
    s.time_of_sale,
    i.item_name
FROM
    sales s
    JOIN sales_menu sm ON s.sale_number = sm.sale_number
    JOIN menu_inventory mi ON sm.menu_item_id = mi.menu_item_id
    JOIN inventory i ON mi.inventory_id = i.inventory_id
WHERE
    i.item_name = $1 AND
    s.date_of_sale BETWEEN $2 AND $3
ORDER BY
    s.date_of_sale ASC, s.time_of_sale ASC;