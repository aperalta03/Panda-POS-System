
/**
 * 
 ** @author Uzair Khan, Alonso Peralta Espinoza
 *
 * Fetches details of menu items within a specific ID range.
 *
 * @description
 * - Retrieves menu items based on `menu_item_id` range, providing key attributes for each item.
 *
 * @columns
 * - `name`: Name of the menu item.
 * - `price`: Price of the menu item.
 * - `calories`: Caloric value of the menu item.
 * - `designation`: Designation or category of the menu item (e.g., premium, regular).
 * - `image`: Image URL or reference for the menu item.
 * - `type`: Type of the menu item (e.g., entree, side, dessert).
 * - `description`: Description of the menu item.
 *
 * @filter
 * - Filters results to include only items where `menu_item_id` is between 5 and 27 (inclusive).
 *
 * @usage
 * - Designed for menu display or reporting purposes.
 *
 * @order
 * - Results are not explicitly ordered; default ordering is based on the query execution plan.
 */

SELECT name, price, calories, designation, image, type, description
FROM menu
WHERE menu_item_id BETWEEN 5 AND 27;