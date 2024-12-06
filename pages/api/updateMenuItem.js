import database from '../../utils/database';

/**
 * @description
 * Adds a new menu item to the database and links it with its ingredients.
 * @author Alonso Peralta Espinoza
 * @module api/updateMenuItem
 *
 * @param {Number} menu_item_id - Unique ID for the menu item.
 * @param {String} name - Name of the menu item.
 * @param {Number} price - Price of the menu item.
 * @param {Number} calories - Caloric value of the menu item.
 * @param {String} description - Description of the menu item.
 * @param {String} designation - Designation/category of the menu item.
 * @param {String} type - Type of the menu item (e.g., "entree", "side").
 * @param {String} ingredients - Comma-separated list of ingredients for the menu item.
 *
 * @returns {Object} - Response object with a success message.
 *
 * @response
 * - `200 OK`: Returns a success message if the menu item is added successfully.
 * - `400 Bad Request`: Returns an error message when the ID is already in use.
 * - `500 Internal Server Error`: Returns an error message for server issues.
 *
 * @example
 * // Request:
 * POST /api/updateMenuItem
 * {
 *   "menu_item_id": 1,
 *   "name": "Orange Chicken",
 *   "price": 9.99,
 *   "calories": 500,
 *   "description": "Our signature dish.",
 *   "designation": "Main",
 *   "type": "entree",
 *   "ingredients": "chicken,orange-sauce"
 * }
 *
 * // Response:
 * {
 *   "message": "Menu item added successfully"
 * }
 *
 * @errorExample {json} Error response when ID is already in use:
 * {
 *   "error": "ID in Use. Please use a unique menu_item_id."
 * }
 *
 * @errorExample {json} General server error response:
 * {
 *   "error": "Error adding menu item"
 * }
 */

export default async function handler(req, res) {
    if (req.method !== "POST") {
      res.setHeader("Allow", ["POST"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  
    const {
      menu_item_id,
      name,
      price,
      calories,
      description,
      designation,
      type,
      ingredients,
      inventory_name,
      curr_amount,
      needed4week,
      needed4gameweek,
    } = req.body;
  
    if (!menu_item_id) {
      return res.status(400).json({ error: "menu_item_id is required." });
    }
  
    try {
      // Begin transaction
      await database.query("BEGIN");
  
      // Update the `menu` table
      const updateMenuQuery = `
        UPDATE menu
        SET 
          name = COALESCE(NULLIF($2, ''), name), 
          price = COALESCE($3, price), 
          calories = COALESCE($4, calories), 
          description = COALESCE(NULLIF($5, ''), description), 
          designation = COALESCE(NULLIF($6, ''), designation), 
          type = COALESCE(NULLIF($7, ''), type)
        WHERE menu_item_id = $1;
      `;
      await database.query(updateMenuQuery, [
        menu_item_id,
        name,
        price,
        calories,
        description,
        designation,
        type,
      ]);
  
      // Update the `menu_ingredients` table if ingredients are provided
      if (ingredients) {
        const ingredientsArray = ingredients.split(",").map((i) => i.trim());
        const updateIngredientsQuery = `
          INSERT INTO menu_ingredients (menu_item_id, item_name, ingredients)
          VALUES ($1, $2, $3)
          ON CONFLICT (menu_item_id)
          DO UPDATE SET
            ingredients = EXCLUDED.ingredients;
        `;
        await database.query(updateIngredientsQuery, [
          menu_item_id,
          name || "Unnamed Item",
          `{${ingredientsArray.join(",")}}`,
        ]);
      }
  
      // Check for existing inventory ID for the menu item
      const fetchInventoryIdQuery = `
        SELECT inventory_id 
        FROM menu_inventory 
        WHERE menu_item_id = $1 
        LIMIT 1;
      `;
      const inventoryResult = await database.query(fetchInventoryIdQuery, [menu_item_id]);
  
      let inventoryId;
      if (inventoryResult.rows.length > 0) {
        // Existing inventory entry found
        inventoryId = inventoryResult.rows[0].inventory_id;
  
        // Update the inventory table
        const updateInventoryQuery = `
          UPDATE inventory
          SET 
            item_name = COALESCE(NULLIF($2, ''), item_name),
            curr_amount = COALESCE($3, curr_amount),
            needed4week = COALESCE($4, needed4week),
            needed4gameweek = COALESCE($5, needed4gameweek)
          WHERE inventory_id = $1;
        `;
        await database.query(updateInventoryQuery, [
          inventoryId,
          inventory_name || name || "Unnamed Inventory Item",
          curr_amount,
          needed4week,
          needed4gameweek,
        ]);
      } else {
        // No existing inventory entry; insert a new one
        const generateInventoryIdQuery = `SELECT COALESCE(MAX(inventory_id), 0) + 1 AS new_id FROM inventory;`;
        const newIdResult = await database.query(generateInventoryIdQuery);
        inventoryId = newIdResult.rows[0].new_id;
  
        const insertInventoryQuery = `
          INSERT INTO inventory (inventory_id, item_name, item_type, curr_amount, needed4week, needed4gameweek)
          VALUES ($1, $2, $3, $4, $5, $6);
        `;
        await database.query(insertInventoryQuery, [
          inventoryId,
          inventory_name || name || "Unnamed Inventory Item",
          "regular",
          curr_amount || 0,
          needed4week || 0,
          needed4gameweek || 0,
        ]);
  
        // Link the new inventory entry to the menu item in `menu_inventory`
        const insertMenuInventoryQuery = `
          INSERT INTO menu_inventory (menu_item_id, inventory_id)
          VALUES ($1, $2);
        `;
        await database.query(insertMenuInventoryQuery, [menu_item_id, inventoryId]);
      }
  
      // Commit transaction
      await database.query("COMMIT");
  
      res.status(200).json({ message: "Menu item, ingredients, and inventory updated successfully." });
    } catch (error) {
      // Rollback transaction on error
      await database.query("ROLLBACK");
      console.error("Error updating menu item:", error);
      res.status(500).json({ error: "Failed to update menu item." });
    }
  }  