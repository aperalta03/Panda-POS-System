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