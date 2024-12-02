
/**
 * 
 ** @author Alonso Peralta Espinoza
 *
 * Updates the seasonal menu item and its associated inventory and ingredients.
 *
 * @description
 * - Fetches the seasonal menu item ID and its associated inventory ID.
 * - Updates the `menu`, `menu_ingredients`, and `inventory` tables with new data.
 *
 * @queries
 * 1. **Fetch Seasonal Menu Item ID**:
 *    - Retrieves the `menu_item_id` of the seasonal menu item.
 * 2. **Fetch Inventory ID**:
 *    - Retrieves the `inventory_id` linked to the seasonal menu item.
 * 3. **Update Menu**:
 *    - Updates the name, price, calories, and optional description of the seasonal menu item.
 * 4. **Update Ingredients**:
 *    - Updates the `item_name` and `ingredients` fields in the `menu_ingredients` table.
 * 5. **Update Inventory**:
 *    - Updates the `item_name` field in the `inventory` table.
 *
 * @parameters
 * - `$1`: Seasonal `menu_item_id`.
 * - `$2`: New name for the menu item.
 * - `$3`: Updated price of the menu item.
 * - `$4`: Updated calories of the menu item.
 * - `$5`: Optional updated description for the menu item.
 * - `$6`: Updated ingredients for the menu item (as an array).
 * - `$7`: `inventory_id` associated with the menu item.
 *
 * @usage
 * - This script is designed to synchronize updates across the `menu`, `menu_ingredients`, and `inventory` tables for seasonal items.
 */


-- Fetch seasonal menu item ID
SELECT menu_item_id FROM menu WHERE type = 'seasonal' LIMIT 1;

-- Fetch inventory ID associated with seasonal item
SELECT inventory_id FROM menu_inventory WHERE menu_item_id = $1 LIMIT 1;

-- Update menu table
UPDATE menu
SET name = $2, price = $3, calories = $4, description = COALESCE($5, description)
WHERE menu_item_id = $1;

-- Update menu_ingredients table
UPDATE menu_ingredients
SET item_name = $2, ingredients = $6
WHERE menu_item_id = $1;

-- Update inventory table
UPDATE inventory
SET item_name = $2
WHERE inventory_id = $7;