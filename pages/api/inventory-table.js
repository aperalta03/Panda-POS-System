import fs from 'fs';
import path from 'path';
import database from '../../utils/database';

/**
 * @description
 * Fetches inventory data from the database using a pre-defined SQL script.
 * 
 * @author Alonso Peralta Espinoza
 * @module api/inventory-table
 * 
 * @api {get} /api/inventory-table
 * @apiName GetInventoryData
 * @apiGroup Inventory
 * 
 * @requestBody
 * No request body is required.
 * 
 * @response
 * - `200 OK`: Returns an array of inventory data.
 * - `500 Internal Server Error`: Returns an error message for server issues.
 * 
 * @example
 * curl -X GET http://localhost:3000/api/inventory-table
 *
 * Response (Success):
 * {
 *   "data": [
 *     { "inventory_id": 1, "item_name": "Orange Chicken", "curr_amount": 100 },
 *     { "inventory_id": 2, "item_name": "Beef Broccoli", "curr_amount": 50 }
 *   ]
 * }
 *
 * Response (Error):
 * {
 *   "error": "Error fetching inventory data"
 * }
 */

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const filePath = path.join(process.cwd(), 'utils', 'sql', 'inventory-table.sql');
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
