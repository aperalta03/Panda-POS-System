import database from '../../utils/database';

/**
 * @description
 * Retrieves menu items from the database, sorted by type and menu item ID. This endpoint is used to
 * fetch all menu items available for a cashier in a structured format.
 * 
 * @author Alonso Peralta Espinoza
 *
 *
 * @requestBody
 * - None: This is a `GET` request and does not require a request body.
 *
 * @response
 * - `200 OK`: Returns a JSON array of sorted menu items.
 * - `500 Internal Server Error`: Returns an error message in case of a server issue.
 *
 * @example
 * curl -X GET http://localhost:3000/api/cashier-getMenu
 *
 * Response:
 * {
 *   "data": [
 *     { "name": "Plate", "price": 9.99, "type": "box" },
 *     { "name": "Coca Cola", "price": 1.99, "type": "drink" }
 *   ]
 * }
 *
 * @module api/cashier-getMenu
 */
export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const menuItemsQuery = `
        SELECT name, price, type, menu_item_id
        FROM menu
        ORDER BY 
          CASE 
            WHEN type = 'box' THEN 1
            WHEN type = 'drink' THEN 2
            WHEN type = 'side' THEN 3
            WHEN type = 'appetizer' THEN 4
            WHEN type = 'dessert' THEN 5
            WHEN type = 'entree' THEN 6
            WHEN type = 'seasonal' THEN 7
            ELSE 8
          END,
          menu_item_id;
      `;
      const result = await database.query(menuItemsQuery);

      const menuItemsArray = result.rows.map(({ name, price, type }) => ({
        name,
        price: parseFloat(price),
        type,
      }));

      res.status(200).json({ data: menuItemsArray });
    } catch (error) {
      console.error('Error fetching menu items:', error);
      res.status(500).json({ error: 'Failed to fetch menu items' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}