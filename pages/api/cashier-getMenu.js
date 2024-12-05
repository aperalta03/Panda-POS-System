import database from '../../utils/database';

/**
 * 
 * @author Alonso Peralta Espinoza
 * 
 * @module api/cashier-getMenu
 *
 * Retrieves menu items from the database, sorted by type and menu item ID.
 *
 * @api {get} /api/cashier-getMenu
 * @apiName GetMenuItemsSorted
 * @apiGroup Menu
 *
 * @apiSuccess {Object} Response object containing an array of sorted menu items.
 * 
 * @apiError (500) {Object} Response object with an error message for server issues.
 * 
 * @apiExample {curl} Example usage:
 *   curl -X GET \
 *     http://localhost:3000/api/menu-items-sorted
 *
 * @apiSuccessExample {json} Success response:
 *     {
 *       "data": [
 *         { "name": "Plate", "price": 9.99, "type": "box" },
 *         { "name": "Coca Cola", "price": 1.99, "type": "drink" }
 *       ]
 *     }
 *
 * @apiErrorExample {json} General server error response:
 *     {
 *       "error": "Failed to fetch menu items"
 *     }
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