import database from '../../utils/database';

/**
 * @description
 * Adds a new menu item to the database and links it with its ingredients.
 * @author Alonso Peralta Espinoza
 * @module api/updateMenuItem
 *
 * @param {Number} menu_item_id - Unique ID for the menu item.
 * @param {String} name - Name of the menu item.
 * @param {Number} price - Price of the menu item.
 * @param {Number} calories - Caloric value of the menu item.
 * @param {String} description - Description of the menu item.
 * @param {String} designation - Designation/category of the menu item.
 * @param {String} type - Type of the menu item (e.g., "entree", "side").
 * @param {String} ingredients - Comma-separated list of ingredients for the menu item.
 *
 * @returns {Object} - Response object with a success message.
 *
 * @response
 * - `200 OK`: Returns a success message if the menu item is added successfully.
 * - `400 Bad Request`: Returns an error message when the ID is already in use.
 * - `500 Internal Server Error`: Returns an error message for server issues.
 *
 * @example
 * // Request:
 * POST /api/updateMenuItem
 * {
 *   "menu_item_id": 1,
 *   "name": "Orange Chicken",
 *   "price": 9.99,
 *   "calories": 500,
 *   "description": "Our signature dish.",
 *   "designation": "Main",
 *   "type": "entree",
 *   "ingredients": "chicken,orange-sauce"
 * }
 *
 * // Response:
 * {
 *   "message": "Menu item added successfully"
 * }
 *
 * @errorExample {json} Error response when ID is already in use:
 * {
 *   "error": "ID in Use. Please use a unique menu_item_id."
 * }
 *
 * @errorExample {json} General server error response:
 * {
 *   "error": "Error adding menu item"
 * }
 */

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { menu_item_id, name, price, calories, description, designation, type, ingredients } = req.body;

        try {
            // Insert into `menu` table
            const menuInsertQuery = `
        INSERT INTO menu (menu_item_id, name, price, calories, description, designation, type, image)
        VALUES ($1, $2, $3, $4, $5, $6, $7, 'Seasonal_Item.png')
        RETURNING menu_item_id;
      `;
            await database.query(menuInsertQuery, [
                menu_item_id,
                name,
                price,
                calories,
                description,
                designation,
                type,
            ]);

            // Insert into `menu_ingredients` table
            const ingredientInsertQuery = `
        INSERT INTO menu_ingredients (menu_item_id, item_name, ingredients)
        VALUES ($1, $2, $3);
      `;
            await database.query(ingredientInsertQuery, [
                menu_item_id,
                name,
                `{${ingredients.split(',').join(',')}}`,
            ]);

            res.status(200).json({ message: 'Menu item added successfully' });
        } catch (error) {
            if (error.code === '23505') {
                console.error('Duplicate menu_item_id:', error.detail);
                res.status(400).json({ error: 'ID in Use. Please use a unique menu_item_id.' });
            } else {
                console.error('Error adding menu item:', error);
                res.status(500).json({ error: 'Error adding menu item' });
            }
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}