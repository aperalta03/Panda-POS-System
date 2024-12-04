import fs from 'fs';
import path from 'path';
import database from '../../utils/database';

/**
 * 
 * @author Uzair Khan, Alonso Peralta Espinoza
 *
 * Fetches all available menu items from the database.
 *
 * @api {get} /api/menu-get-items
 * @apiName GetMenuItems
 * @apiGroup Menu
 *
 * @apiSuccess {Object} Response object containing an array of menu items.
 * 
 * @apiError (404) {Object} Response object with an error message when no menu items are found.
 * @apiError (500) {Object} Response object with an error message for server issues.
 *
 * @apiExample {curl} Example usage:
 *   curl -X GET \
 *     http://localhost:3000/api/menu-items
 *
 * @apiSuccessExample {json} Success response:
 *     {
 *       "menuItems": [
 *         { "menu_item_id": 1, "name": "Orange Chicken", "price": 10.99 },
 *         { "menu_item_id": 2, "name": "Kung Pao Chicken", "price": 9.99 }
 *       ]
 *     }
 *
 * @apiErrorExample {json} Error response when no items are found:
 *     {
 *       "error": "Menu items not found"
 *     }
 *
 * @apiErrorExample {json} General server error response:
 *     {
 *       "error": "Error fetching menu items"
 *     }
 */

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const filePath = path.join(process.cwd(), 'utils', 'sql', 'menu-get-items.sql');
      const queryText = fs.readFileSync(filePath, 'utf-8');

      const result = await database.query(queryText);

      if (result.rows.length > 0) {
        res.status(200).json({ menuItems: result.rows });
        //console.log("Fetched item:", result.rows);
      } else {
        res.status(404).json({ error: 'Menu items not found' });
      }      
    } catch (error) {
      console.error('Error fetching menu items:', error);
      res.status(500).json({ error: 'Error fetching menu items' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}