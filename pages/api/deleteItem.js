import database from '../../utils/database';

/**
 * @author Alonso Peralta Espinoza
 * @module api/deleteItem
 * @description
 * Deletes an inventory item and its linked menu item if applicable.
 * @features
 * - Deletes an inventory item by its ID.
 * - Deletes a menu item if linked to the inventory item.
 * @requestBody
 * - id: The inventory ID to delete.
 * @response
 * - message: Success message.
 * @dependencies
 * - database
 * @example
 * curl -X DELETE \
 *   http://localhost:3000/api/deleteItem \
 *   -H 'Content-Type: application/json' \
 *   -d '{
 *         "id": 5
 *       }'
 **/
export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { id } = req.body;

    try {
      // Check if the inventory ID is linked to a menu item
      const findMenuItemQuery = `
        SELECT menu_item_id 
        FROM menu_inventory 
        WHERE inventory_id = $1;
      `;
      const menuItemResult = await database.query(findMenuItemQuery, [id]);

      if (menuItemResult.rows.length > 0) {
        const menuItemId = menuItemResult.rows[0].menu_item_id;

        // Delete from the `menu` table using the menu_item_id
        const deleteMenuQuery = `DELETE FROM menu WHERE menu_item_id = $1;`;
        await database.query(deleteMenuQuery, [menuItemId]);

        // Delete the relationship from `menu_inventory`
        const deleteMenuInventoryQuery = `DELETE FROM menu_inventory WHERE menu_item_id = $1;`;
        await database.query(deleteMenuInventoryQuery, [menuItemId]);
      }

      // Delete from the `inventory` table using inventory_id
      const deleteInventoryQuery = `DELETE FROM inventory WHERE inventory_id = $1;`;
      await database.query(deleteInventoryQuery, [id]);

      res.status(200).json({ message: 'Item deleted successfully.' });
    } catch (error) {
      console.error('Error deleting item:', error);
      res.status(500).json({ error: 'Error deleting item.' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
