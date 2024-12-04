import fs from 'fs';
import path from 'path';
import database from '../../utils/database';

/**
 * 
 * @author Alonso Peralta Espinoza
 *
 * Fetches inventory data from the database using a pre-defined SQL script.
 *
 * @api {get} /api/inventory-table
 * @apiName GetInventoryData
 * @apiGroup Inventory
 *
 * @apiSuccess {Object} Response object containing an array of inventory data.
 * 
 * @apiError (500) {Object} Response object with an error message for server issues.
 * 
 * @apiExample {curl} Example usage:
 *   curl -X GET \
 *     http://localhost:3000/api/inventory-data
 *
 * @apiSuccessExample {json} Success response:
 *     {
 *       "data": [
 *         { "inventory_id": 1, "item_name": "Orange Chicken", "curr_amount": 100 },
 *         { "inventory_id": 2, "item_name": "Beef Broccoli", "curr_amount": 50 }
 *       ]
 *     }
 *
 * @apiErrorExample {json} General server error response:
 *     {
 *       "error": "Error fetching inventory data"
 *     }
 */

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const filePath = path.join(process.cwd(), 'utils', 'sql', 'inventory-table.sql');
            // console.log("SQL file path:", filePath);
            const queryText = fs.readFileSync(filePath, 'utf-8');

            const result = await database.query(queryText);
            res.status(200).json({ data: result.rows });
        } catch (error) {
            console.error('Error fetching inventory data:', error);
            res.status(500).json({ error: 'Error fetching inventory data' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}