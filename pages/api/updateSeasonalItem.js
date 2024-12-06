import fs from "fs";
import path from "path";
import database from "../../utils/database";

/**
 * 
 * @author Alonso Peralta Espinoza
 * 
 * @description
 * Updates the seasonal menu item and its associated inventory and ingredients.
 * @module api/updateSeasonalItem
 *
 * @param {String} name - New name for the seasonal menu item.
 * @param {Number} price - New price for the seasonal menu item.
 * @param {Number} calories - Updated caloric value for the seasonal menu item.
 * @param {String} [description] - Optional description of the menu item.
 * @param {String} ingredients - Comma-separated list of updated ingredients.
 * @param {String} itemType - Type of the seasonal menu item.
 *
 * @returns {Object} - Response object with a success message.
 *
 * @response
 * - `200 OK`: Returns a success message if the update is successful.
 * - `400 Bad Request`: Returns an error message for missing fields.
 * - `500 Internal Server Error`: Returns an error message for server or transaction issues.
 *
 * @example
 * // Request:
 * POST /api/updateSeasonalItem
 * {
 *   "name": "Winter Special",
 *   "price": 10.99,
 *   "calories": 300,
 *   "description": "A delicious winter special dish.",
 *   "ingredients": "chicken, vegetables, spices",
 *   "itemType": "seasonal"
 * }
 *
 * // Response:
 * {
 *   "message": "Seasonal item updated successfully"
 * }
 *
 * @errorExample {json} Error response for missing fields:
 * {
 *   "error": "Missing required fields: name, price, or ingredients"
 * }
 *
 * @errorExample {json} General server error response:
 * {
 *   "error": "Failed to update seasonal item"
 * }
 */

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const {
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

  // Hardcoded seasonal menu item ID
  const seasonalMenuItemId = 7;

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
      seasonalMenuItemId,
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
        seasonalMenuItemId,
        name || "Seasonal Item",
        `{${ingredientsArray.join(",")}}`,
      ]);
    }

    // Check for existing inventory ID for the seasonal menu item
    const fetchInventoryIdQuery = `
      SELECT inventory_id 
      FROM menu_inventory 
      WHERE menu_item_id = $1 
      LIMIT 1;
    `;
    const inventoryResult = await database.query(fetchInventoryIdQuery, [seasonalMenuItemId]);

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
        inventory_name || name || "Seasonal Item",
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
        inventory_name || name || "Seasonal Item",
        "seasonal",
        curr_amount || 0,
        needed4week || 0,
        needed4gameweek || 0,
      ]);

      // Delete any existing relationship in `menu_inventory`
      const deleteMenuInventoryQuery = `
        DELETE FROM menu_inventory
        WHERE menu_item_id = $1;
      `;
      await database.query(deleteMenuInventoryQuery, [seasonalMenuItemId]);

      // Link the new inventory entry to the seasonal menu item
      const insertMenuInventoryQuery = `
        INSERT INTO menu_inventory (menu_item_id, inventory_id)
        VALUES ($1, $2);
      `;
      await database.query(insertMenuInventoryQuery, [seasonalMenuItemId, inventoryId]);
    }

    // Commit transaction
    await database.query("COMMIT");

    res.status(200).json({ message: "Seasonal item, ingredients, and inventory updated successfully." });
  } catch (error) {
    // Rollback transaction on error
    await database.query("ROLLBACK");
    console.error("Error updating seasonal item:", error);
    res.status(500).json({ error: "Failed to update seasonal item." });
  }
}