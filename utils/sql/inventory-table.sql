-- inventory-table.sql

/**
 * 
 * @author Alonso Peralta Espinoza
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
    inventory.inventory_id AS id,
    inventory.item_name AS name,
    inventory.curr_amount AS stocked,
    inventory.needed4week AS required,
    (inventory.needed4week - inventory.curr_amount) AS to_order,
    menu_inventory.menu_item_id AS mid
FROM 
    inventory
LEFT JOIN 
    menu_inventory ON inventory.inventory_id = menu_inventory.inventory_id
ORDER BY
    mid ASC NULLS LAST, inventory.inventory_id ASC;
