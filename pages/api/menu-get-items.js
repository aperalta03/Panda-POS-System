import fs from 'fs';
import path from 'path';
import database from '../../utils/database';

/**
 * @description
 * Fetches all available menu items from the database.
 * @author Uzair Khan, Alonso Peralta Espinoza
 * @module api/menu-get-items
 *
 * @features
 * - Fetches all menu items from the database.
 * - Returns a list of items with their ID, name, and price.
 * 
 * @requestMethod
 * - `GET`: Retrieves the menu items.
 *
 * @response
 * - `200 OK`: Returns a JSON object containing an array of menu items.
 * - `404 Not Found`: Returns an error message if no menu items are found.
 * - `500 Internal Server Error`: Returns an error message if there is an issue fetching data.
 *
 * @returns {Object} JSON response containing the list of menu items:
 * - `menuItems` (Array): Array of menu item objects.
 *   - `menu_item_id` (number): Unique identifier for the menu item.
 *   - `name` (string): The name of the menu item.
 *   - `price` (number): The price of the menu item.
 *
 * @example
 * // Request:
 * GET /api/menu-get-items
 *
 * // Response:
 * {
 *   "menuItems": [
 *     { "menu_item_id": 1, "name": "Orange Chicken", "price": 10.99 },
 *     { "menu_item_id": 2, "name": "Kung Pao Chicken", "price": 9.99 }
 *   ]
 * }
 *
 * // Error Response (No Menu Items Found):
 * {
 *   "error": "Menu items not found"
 * }
 *
 * // Error Response (Server Issue):
 * {
 *   "error": "Error fetching menu items"
 * }
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