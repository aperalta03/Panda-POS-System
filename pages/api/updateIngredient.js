import database from '../../utils/database';

/**
 * @description
 * Adds a new ingredient to the inventory database.
 * @author Alonso Peralta Espinoza
 * @module api/updateIngredient
 *
 * @param {Number} inventory_id - Unique ID for the inventory item.
 * @param {String} name - Name of the ingredient.
 * @param {String} item_type - Type of the item (default is "ingredient").
 * @param {Number} curr_amount - Current amount of the ingredient in stock.
 * @param {Number} needed4week - Amount needed for a week.
 * @param {Number} needed4gameweek - Amount needed for a game week.
 *
 * @returns {Object} - Response object with a success message.
 *
 * @response
 * - `200 OK`: Returns a success message if the ingredient is added successfully.
 * - `400 Bad Request`: Returns an error message when the ID is already in use.
 * - `500 Internal Server Error`: Returns an error message for server issues.
 *
 * @example
 * // Request:
 * POST /api/updateIngredient
 * {
 *   "inventory_id": 101,
 *   "name": "Chicken Breast",
 *   "curr_amount": 50,
 *   "needed4week": 100,
 *   "needed4gameweek": 150
 * }
 *
 * // Response:
 * {
 *   "message": "Ingredient added successfully"
 * }
 *
 * @errorExample {json} Error response when ID is already in use:
 * {
 *   "error": "ID in Use. Please use a unique inventory_id."
 * }
 *
 * @errorExample {json} General server error response:
 * {
 *   "error": "Error adding ingredient"
 * }
 */

 
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { inventory_id, name, curr_amount, needed4week, needed4gameweek } = req.body;

    try {
      const item_type = 'ingredient';

      const query = `
        INSERT INTO inventory (inventory_id, item_name, item_type, curr_amount, needed4week, needed4gameweek)
        VALUES ($1, $2, $3, $4, $5, $6);
      `;
      await database.query(query, [inventory_id, name, item_type, curr_amount, needed4week, needed4gameweek]);

      res.status(200).json({ message: 'Ingredient added successfully' });
    } catch (error) {
      if (error.code === '23505') {
        console.error('Duplicate inventory_id:', error.detail);
        res.status(400).json({ error: 'ID in Use. Please use a unique inventory_id.' });
      } else {
        console.error('Error adding ingredient:', error);
        res.status(500).json({ error: 'Error adding ingredient' });
      }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}   