import database from '../../utils/database';

/**
 * @description
 * Re-syncs the IDs of menu items and their respective inventory items.
 * @author Alonso Peralta Espinoza
 * @module api/resyncIds
 *
 * @features
 * - Re-syncs IDs between menu items and inventory items to ensure consistency.
 *
 * @requestMethod
 * - `POST`: Re-syncs the IDs.
 *
 * @response
 * - `200 OK`: Returns a success message when the IDs are successfully re-synced.
 * - `500 Internal Server Error`: Returns an error message if the re-sync operation fails.
 *
 * @example
 * // Request:
 * POST /api/resyncIds
 *
 * // Response:
 * {
 *   "message": "IDs re-synced successfully."
 * }
 *
 * @errorExample {json} Error response:
 * {
 *   "error": "Error re-syncing IDs."
 * }
 */

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