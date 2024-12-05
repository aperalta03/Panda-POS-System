import fs from "fs";
import path from "path";
import database from "../../utils/database";

/**
 * 
 * @author Alonso Peralta Espinoza
 * 
 * @module api/updateSeasonalItem
 *
 * Updates the seasonal menu item and its associated inventory and ingredients.
 *
 * @api {post} /api/updateSeasonalItem
 * @apiName UpdateSeasonalItem
 * @apiGroup Manager
 *
 * @apiParam {String} name New name for the seasonal menu item.
 * @apiParam {Number} price New price for the seasonal menu item.
 * @apiParam {Number} calories Updated caloric value for the seasonal menu item.
 * @apiParam {String} [description] Optional description of the menu item.
 * @apiParam {String} ingredients Comma-separated list of updated ingredients.
 * @apiParam {String} itemType Type of the seasonal menu item.
 *
 * @apiSuccess {Object} Response object with a success message.
 * 
 * @apiError (400) {Object} Response object with an error message for missing fields.
 * @apiError (500) {Object} Response object with an error message for server or transaction issues.
 */

 export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { name, price, calories, description = null, ingredients, type } = req.body;

  console.log("Received Payload:", req.body);

  // Validate inputs
  if (
    !name ||
    price === undefined ||
    calories === undefined ||
    !ingredients ||
    typeof ingredients !== "string" ||
    !type
  ) {
    return res
      .status(400)
      .json({ error: "Name, price, calories, ingredients, and type are required" });
  }

  try {
    // Convert ingredients to an array
    const ingredientsArray = ingredients.split(",").map((ingredient) => ingredient.trim());

    // Hardcoded menu_item_id
    const seasonalMenuItemId = 7;

    // Start transaction
    await database.query("BEGIN");

    // Fetch inventory ID associated with the seasonal item
    const fetchInventoryIdQuery = `
      SELECT inventory_id 
      FROM menu_inventory 
      WHERE menu_item_id = $1 
      LIMIT 1;
    `;
    const inventoryResult = await database.query(fetchInventoryIdQuery, [seasonalMenuItemId]);
    if (inventoryResult.rows.length === 0) {
      throw new Error("No matching inventory item found for the seasonal menu item");
    }
    const inventoryId = inventoryResult.rows[0].inventory_id;

    // Update menu table
    const updateMenuQuery = `
      UPDATE menu
      SET 
        name = $2, 
        price = $3, 
        calories = $4, 
        description = COALESCE($5, description), 
        type = $6
        image = 'Seasonal_Item.png'
      WHERE menu_item_id = $1;
    `;
    await database.query(updateMenuQuery, [
      seasonalMenuItemId, // $1
      name,               // $2
      price,              // $3
      calories,           // $4
      description,        // $5
      type,               // $6
    ]);

    // Update menu_ingredients table
    const updateIngredientsQuery = `
      UPDATE menu_ingredients
      SET 
        item_name = $2, 
        ingredients = $3
      WHERE menu_item_id = $1;
    `;
    await database.query(updateIngredientsQuery, [
      seasonalMenuItemId, // $1
      name,               // $2
      ingredientsArray,   // $3
    ]);

    // Update inventory table
    const updateInventoryQuery = `
      UPDATE inventory
      SET 
        item_name = $2
      WHERE inventory_id = $1;
    `;
    await database.query(updateInventoryQuery, [
      inventoryId, // $1
      name,        // $2
    ]);

    // Commit transaction
    await database.query("COMMIT");

    console.log("Transaction committed successfully.");
    res.status(200).json({ message: "Seasonal item and ingredients updated successfully" });
  } catch (error) {
    await database.query("ROLLBACK");
    console.error("Error updating seasonal item:", error);
    res.status(500).json({ error: "Failed to update seasonal item" });
  }
 }