import database from '../../utils/database';

/**
 * 
 * @author Alonso Peralta Espinoza
 *
 * Deletes an inventory item and its linked menu item if applicable.
 * 
 * @module api/deleteItem
 *
 * @api {delete} /api/deleteItem
 * @apiName DeleteItem
 * @apiGroup Manager
 *
 * @apiParam {Number} id Unique ID of the inventory item to delete.
 *
 * @apiSuccess {Object} Response object with a success message.
 * 
 * @apiError (500) {Object} Response object with an error message for server issues.
 *
 * @apiExample {curl} Example usage:
 *   curl -X DELETE \
 *     http://localhost:3000/api/deleteItem \
 *     -H 'Content-Type: application/json' \
 *     -d '{
 *           "id": 5
 *         }'
 *
 * @apiSuccessExample {json} Success response:
 *     {
 *       "message": "Item deleted successfully."
 *     }
 *
 * @apiErrorExample {json} General server error response:
 *     {
 *       "error": "Error deleting item."
 *     }
 */

 
export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { id } = req.body;

    try {
      // Begin transaction
      await database.query("BEGIN");

      // Check if the inventory ID is linked to a menu item
      const findMenuItemQuery = `
        SELECT menu_item_id 
        FROM menu_inventory 
        WHERE inventory_id = $1;
      `;
      const menuItemResult = await database.query(findMenuItemQuery, [id]);

      if (menuItemResult.rows.length > 0) {
        const menuItemId = menuItemResult.rows[0].menu_item_id;

        // Delete the relationship from `menu_inventory` first
        const deleteMenuInventoryQuery = `DELETE FROM menu_inventory WHERE menu_item_id = $1;`;
        await database.query(deleteMenuInventoryQuery, [menuItemId]);

        // Delete from the `menu` table using the menu_item_id
        const deleteMenuQuery = `DELETE FROM menu WHERE menu_item_id = $1;`;
        await database.query(deleteMenuQuery, [menuItemId]);
      }

      // Delete from the `inventory` table using inventory_id
      const deleteInventoryQuery = `DELETE FROM inventory WHERE inventory_id = $1;`;
      await database.query(deleteInventoryQuery, [id]);

      // Commit transaction
      await database.query("COMMIT");

      res.status(200).json({ message: 'Item deleted successfully.' });
    } catch (error) {
      // Rollback transaction in case of error
      await database.query("ROLLBACK");
      console.error('Error deleting item:', error);
      res.status(500).json({ error: 'Error deleting item.' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}