/**
 * @author Uzair Khan
 *
 * Updates the price of a specific menu item in the database.
 *
 * @description
 * - Modifies the `price` of a menu item identified by its `name` in the `menu` table.
 * - Ensures the menu remains up-to-date with current pricing.
 *
 * @parameters
 * - `$1`: The new price to be set for the menu item.
 * - `$2`: The name of the menu item whose price is being updated.
 *
 * @usage
 * - Used for price adjustments during promotions, seasonal changes, or inflation updates.
 * - Can be executed by management tools for maintaining menu consistency.
 */

UPDATE menu SET price = $1 WHERE name = $2;