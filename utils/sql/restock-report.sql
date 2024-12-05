-- restock_report.sql

/**
 * 
 * @author Alonso Peralta Espinoza
 *
 * Generates a restock report identifying inventory items that need replenishment.
 *
 * @description
 * - Calculates the quantities needed to meet weekly and game-week requirements for inventory items.
 * - Includes only items where current stock is insufficient.
 *
 * @columns
 * - `itemName`: Name of the inventory item.
 * - `currentStock`: Current quantity of the item in stock.
 * - `neededForWeek`: Quantity needed to meet weekly requirements (`needed4week - curr_amount`).
 * - `neededForGameWeek`: Quantity needed to meet game-week requirements (`needed4gameweek - curr_amount`).
 *
 * @filter
 * - Includes items where `neededForWeek` or `neededForGameWeek` is greater than zero.
 *
 * @order
 * - Results are ordered alphabetically by `item_name`.
 *
 * @usage
 * - Used for planning restocking to ensure inventory requirements are met.
 */

SELECT 
    item_name AS "itemName",
    curr_amount AS "currentStock",
    needed4week - curr_amount AS "neededForWeek",
    needed4gameweek - curr_amount AS "neededForGameWeek"
FROM 
    inventory
WHERE 
    (needed4week - curr_amount) > 0 
    OR (needed4gameweek - curr_amount) > 0
ORDER BY 
    item_name;