import database from '../../utils/database';


/**
 * Handles updating an inventory item.
 * @author Anson Thai
 * @api {post} /api/update-inventory-item
 * @apiName UpdateInventoryItem
 * @apiGroup Manager
 *
 * @apiParam {Number} inventory_id Unique ID for the inventory item.
 * @apiParam {String} item_name Name of the inventory item.
 * @apiParam {String} item_type Type of the inventory item (e.g., food item, supply).
 * @apiParam {String} [ingredients] List of ingredients used in menu items (NULL for non-menu items).
 * @apiParam {Number} curr_amount Current stock level of the inventory item.
 * @apiParam {Number} needed4week Amount needed for a standard week.
 * @apiParam {Number} needed4gameweek Amount needed for a peak-demand "game week".
 *
 * @apiSuccess {Object} Response object with a success message.
 * 
 * @apiError (400) {Object} Response object with an error message for invalid input data.
 * @apiError (500) {Object} Response object with an error message for other server issues.
 *
 * @apiExample {curl} Example usage:
 *   curl -X POST \
 *     http://localhost:3000/api/update-inventory-item \
 *     -H 'Content-Type: application/json' \
 *     -d '{
 *           "inventory_id": 100,
 *           "item_name": "name",
 *           "item_type": "type",
 *           "ingredients": "a, b, c",
 *           "curr_amount": 100,
 *           "needed4week": 100,
 *           "needed4gameweek": 100
 *         }'
 *
 * @apiSuccessExample {json} Success response:
 *     {
 *       "message": "Inventory item updated successfully"
 *     }
 *
 * @apiErrorExample {json} Error response for invalid input data:
 *     {
 *       "error": "Invalid input data"
 *     }
 *
 * @apiErrorExample {json} Error response for other server issues:
 *     {
 *       "error": "Failed to update inventory item",
 *       "details": "Error message from the server"
 *     }
 */
export default async function handler(req, res) {
    console.log('Received payload:', req.body);

    if (req.method === 'POST') {
        const {
            inventory_id,
            item_name,
            item_type,
            ingredients,
            curr_amount,
            needed4week,
            needed4gameweek, // Ensure these are lowercase
        } = req.body;

        try {
            // Validate inputs
            if (
                !inventory_id ||
                !item_name ||
                !item_type ||
                isNaN(curr_amount) ||
                isNaN(needed4week) || // Validate lowercase
                isNaN(needed4gameweek) // Validate lowercase
            ) {
                return res.status(400).json({ error: "Invalid input data" });
            }

            // SQL query to insert or update an inventory item
            const updateInventoryQuery = `
                INSERT INTO inventory (inventory_id, item_name, item_type, ingredients, curr_amount, needed4week, needed4gameweek)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT (inventory_id)
                DO UPDATE SET
                    item_name = EXCLUDED.item_name,
                    item_type = EXCLUDED.item_type,
                    ingredients = EXCLUDED.ingredients,
                    curr_amount = EXCLUDED.curr_amount,
                    needed4week = EXCLUDED.needed4week,
                    needed4gameweek = EXCLUDED.needed4gameweek;
            `;

            // Execute the query
            await database.query(updateInventoryQuery, [
                inventory_id,
                item_name,
                item_type,
                ingredients || null,
                curr_amount,
                needed4week, // Pass lowercase
                needed4gameweek, // Pass lowercase
            ]);

            res.status(200).json({ message: 'Inventory item updated successfully' });
        } catch (error) {
            console.error('Error updating inventory item:', error.stack); // Logs full stack trace
            res.status(500).json({ error: 'Failed to update inventory item', details: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
