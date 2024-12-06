import database from '../../utils/database';

/**
 * 
 * @author Alonso Peralta Espinoza
 *
 * Adds a new ingredient to the inventory database.
 * @module api/updateIngredient
 * @api {post} /api/updateIngredient
 * @apiName UpdateIngredient
 * @apiGroup Manager
 *
 * @apiParam {Number} inventory_id Unique ID for the inventory item.
 * @apiParam {String} name Name of the ingredient.
 * @apiParam {String} item_type Type of the item (default is "ingredient").
 * @apiParam {Number} curr_amount Current amount of the ingredient in stock.
 * @apiParam {Number} needed4week Amount needed for a week.
 * @apiParam {Number} needed4gameweek Amount needed for a game week.
 *
 * @apiSuccess {Object} Response object with a success message.
 * 
 * @apiError (400) {Object} Response object with an error message when ID is already in use.
 * @apiError (500) {Object} Response object with an error message for other server issues.
 *
 * @apiExample {curl} Example usage:
 *   curl -X POST \
 *     http://localhost:3000/api/updateIngredient \
 *     -H 'Content-Type: application/json' \
 *     -d '{
 *           "inventory_id": 101,
 *           "name": "Chicken Breast",
 *           "curr_amount": 50,
 *           "needed4week": 100,
 *           "needed4gameweek": 150
 *         }'
 *
 * @apiSuccessExample {json} Success response:
 *     {
 *       "message": "Ingredient added successfully"
 *     }
 *
 * @apiErrorExample {json} Error response when ID is already in use:
 *     {
 *       "error": "ID in Use. Please use a unique inventory_id."
 *     }
 *
 * @apiErrorExample {json} General server error response:
 *     {
 *       "error": "Error adding ingredient"
 *     }
 */

 
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { inventory_id, name, curr_amount, needed4week, needed4gameweek } = req.body;

  if (!inventory_id) {
    return res.status(400).json({ error: "inventory_id is required." });
  }

  try {
    const item_type = "ingredient";

    const updateIngredientQuery = `
      INSERT INTO inventory (inventory_id, item_name, item_type, curr_amount, needed4week, needed4gameweek)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (inventory_id)
      DO UPDATE SET
        item_name = COALESCE(NULLIF(EXCLUDED.item_name, ''), inventory.item_name),
        curr_amount = COALESCE(EXCLUDED.curr_amount, inventory.curr_amount),
        needed4week = COALESCE(EXCLUDED.needed4week, inventory.needed4week),
        needed4gameweek = COALESCE(EXCLUDED.needed4gameweek, inventory.needed4gameweek);
    `;

    await database.query(updateIngredientQuery, [
      inventory_id,      // $1
      name || "Unnamed Ingredient", // $2 (Default name if not provided)
      item_type,         // $3
      curr_amount,       // $4
      needed4week,       // $5
      needed4gameweek,   // $6
    ]);

    res.status(200).json({ message: "Ingredient updated successfully." });
  } catch (error) {
    console.error("Error updating ingredient:", error);
    res.status(500).json({ error: "Failed to update ingredient." });
  }
}