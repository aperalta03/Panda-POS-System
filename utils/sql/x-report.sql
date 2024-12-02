
/**
 * 
 ** @author Alonso Peralta Espinoza
 *
 * Retrieves hourly sales data for the current day (X-Report).
 *
 * @description
 * - Aggregates total sales per hour for the current day from the `salesRecord` table.
 *
 * @columns
 * - `hour`: The hour of the day (0-23).
 * - `sales`: Total sales amount for the respective hour.
 *
 * @filters
 * - Includes only sales data for the current date (`CURRENT_DATE`).
 *
 * @grouping
 * - Groups results by hour.
 *
 * @order
 * - Results are ordered by `hour` in ascending order.
 *
 * @usage
 * - Generates hourly sales trends for managerial reporting.
 */

SELECT EXTRACT(HOUR FROM saleTime) AS hour, SUM(totalPrice) AS sales
FROM salesRecord
WHERE saleDate = CURRENT_DATE
GROUP BY hour
ORDER BY hour;