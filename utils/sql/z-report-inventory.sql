
/**
 * 
 ** @author Alonso Peralta Espinoza
 *
 * Generates a sales report for individual items, including total quantities sold and total revenue.
 *
 * @description
 * - Aggregates sales data for individual items and calculates total revenue per item and overall.
 *
 * @columns
 * - `item_name`: Name of the sold item.
 * - `quantity_sold`: Total quantity sold for the item.
 * - `total_price`: Total revenue generated by the item, rounded to two decimal places.
 * - `total_sales`: Total revenue from all items, rounded to two decimal places.
 *
 * @grouping
 * - Groups results by `item_name`.
 *
 * @order
 * - Results are ordered by `quantity_sold` in descending order.
 *
 * @usage
 * - Used for analyzing individual item performance and overall sales contributions.
 */


WITH item_sales AS (
    SELECT 
        jsonb_array_elements_text(si.components) AS item_name,
        COUNT(*) AS quantity_sold,
        SUM(sr.totalprice / jsonb_array_length(si.components)) AS total_price
    FROM 
        saleItems si
    JOIN 
        salesRecord sr ON si.salenumber = sr.salenumber
    GROUP BY 
        item_name
)
SELECT 
    item_name,
    quantity_sold,
    ROUND(total_price, 2) AS total_price,
    (SELECT ROUND(SUM(total_price), 2) FROM item_sales) AS total_sales
FROM 
    item_sales
ORDER BY 
    quantity_sold DESC;