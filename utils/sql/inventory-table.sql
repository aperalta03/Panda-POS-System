-- inventory-table.sql

/**
 * 
 ** @author Alonso Peralta Espinoza
 *
 * Retrieves inventory data, including current stock levels, weekly requirements, and items to reorder.
 *
 * @description
 * - This query provides a detailed view of inventory status by calculating the quantity needed to reorder for each item.
 *
 * @columns
 * - `id`: Unique identifier for each inventory item.
 * - `name`: Name of the inventory item.
 * - `stocked`: Current quantity of the item in stock (`curr_amount`).
 * - `required`: Weekly required quantity (`needed4week`).
 * - `to_order`: Quantity needed to meet the weekly requirement, calculated as `needed4week - curr_amount`.
 *
 * @order
 * - Results are ordered by `inventory_id` in ascending order.
 *
 * @usage
 * - Used for inventory management and restocking decisions.
 *
 * @example
 * - To identify items that need restocking, filter rows where `to_order` is greater than zero.
 */

SELECT 
    inventory_id AS id,
    item_name AS name,
    curr_amount AS stocked,
    needed4week AS required,
    (needed4week - curr_amount) AS to_order
FROM 
    inventory
ORDER BY
    inventory_id;
