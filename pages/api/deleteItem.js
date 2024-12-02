import database from '../../utils/database';

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
