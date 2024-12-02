import database from '../../utils/database';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const resyncQuery = `
        INSERT INTO menu_inventory (menu_item_id, inventory_id)
        SELECT m.menu_item_id, i.inventory_id
        FROM menu m
        JOIN inventory i ON m.name = i.item_name
        WHERE NOT EXISTS (
          SELECT 1
          FROM menu_inventory mi
          WHERE mi.menu_item_id = m.menu_item_id
          AND mi.inventory_id = i.inventory_id
        );
      `;
      await database.query(resyncQuery);

      res.status(200).json({ message: 'IDs re-synced successfully.' });
    } catch (error) {
      console.error('Error re-syncing IDs:', error);
      res.status(500).json({ error: 'Error re-syncing IDs.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}