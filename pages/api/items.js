import database from '../../utils/database';

/**
 * @description
 * Handles GET requests to fetch distinct item names from the inventory.
 * Executes a SQL query to select distinct item names from the inventory, ordered alphabetically.
 * Returns a JSON response with an array of item names if successful.
 *
 * @author Alonso Peralta Espinoza
 * @module api/items
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 *
 * @response
 * - `200 OK`: Returns a JSON object containing an array of item names.
 * - `500 Internal Server Error`: Returns an error message if there is a server-side issue.
 * - `405 Method Not Allowed`: Returns an error message if the request method is not allowed.
 *
 * @example
 * // Request
 * GET /api/items
 *
 * // Response (Success)
 * {
 *   "items": ["Orange Chicken", "Beef Broccoli", "Sweet and Sour Chicken"]
 * }
 *
 * // Response (Error)
 * {
 *   "error": "Error fetching item names"
 * }
 */
export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const queryText = 'SELECT DISTINCT item_name FROM inventory ORDER BY item_name;';
            const result = await database.query(queryText);
            res.status(200).json({ items: result.rows });
        } catch (error) {
            console.error('Error fetching items:', error);
            res.status(500).json({ error: 'Error fetching items' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}