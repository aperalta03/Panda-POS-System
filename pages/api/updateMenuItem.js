import database from '../../utils/database';

/**
 * 
 ** @author Alonso Peralta Espinoza
 *
 * Adds a new menu item to the database and links it with its ingredients.
 *
 * @api {post} /api/updateMenuItem
 * @apiName UpdateMenuItem
 * @apiGroup Manager
 *
 * @apiParam {Number} menu_item_id Unique ID for the menu item.
 * @apiParam {String} name Name of the menu item.
 * @apiParam {Number} price Price of the menu item.
 * @apiParam {Number} calories Caloric value of the menu item.
 * @apiParam {String} description Description of the menu item.
 * @apiParam {String} designation Designation/category of the menu item.
 * @apiParam {String} type Type of the menu item (e.g., "entree", "side").
 * @apiParam {String} ingredients Comma-separated list of ingredients for the menu item.
 *
 * @apiSuccess {Object} Response object with a success message.
 * 
 * @apiError (400) {Object} Response object with an error message when ID is already in use.
 * @apiError (500) {Object} Response object with an error message for other server issues.
 *
 * @apiExample {curl} Example usage:
 *   curl -X POST \
 *     http://localhost:3000/api/updateMenuItem \
 *     -H 'Content-Type: application/json' \
 *     -d '{
 *           "menu_item_id": 1,
 *           "name": "Orange Chicken",
 *           "price": 9.99,
 *           "calories": 500,
 *           "description": "Our signature dish.",
 *           "designation": "Main",
 *           "type": "entree",
 *           "ingredients": "chicken,orange-sauce"
 *         }'
 *
 * @apiSuccessExample {json} Success response:
 *     {
 *       "message": "Menu item added successfully"
 *     }
 *
 * @apiErrorExample {json} Error response when ID is already in use:
 *     {
 *       "error": "ID in Use. Please use a unique menu_item_id."
 *     }
 *
 * @apiErrorExample {json} General server error response:
 *     {
 *       "error": "Error adding menu item"
 *     }
 */

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { menu_item_id, name, price, calories, description, designation, type, ingredients } = req.body;

        try {
            // Insert into `menu` table
            const menuInsertQuery = `
        INSERT INTO menu (menu_item_id, name, price, calories, description, designation, type)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
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