import fs from 'fs';
import path from 'path';
import db from '../../utils/database';

/**
 * @description
 * Retrieves restock data including current stock and amounts needed for the week and game week.
 * @author Alonso Peralta Espinoza
 * @module api/restock-Report-inventory
 *
 * @features
 * - Retrieves restock data, including current stock and amounts needed for the week and game week.
 * - Provides structured JSON response with restock data.
 * - Handles errors for server issues during data retrieval.
 *
 * @requestMethod
 * - `GET`: Fetches the restock data.
 *
 * @response
 * - `200 OK`: Returns a JSON array containing the restock data.
 * - `500 Internal Server Error`: Returns an error message if there is an issue fetching the data.
 *
 * @example
 * // Request:
 * GET /api/restock-Report-inventory
 *
 * // Response:
 * [
 *   {
 *     "itemName": "Chicken Breast",
 *     "currentStock": 50,
 *     "neededForWeek": 100,
 *     "neededForGameWeek": 150
 *   },
 *   {
 *     "itemName": "Orange Sauce",
 *     "currentStock": 20,
 *     "neededForWeek": 50,
 *     "neededForGameWeek": 70
 *   }
 * ]
 *
 * @errorExample {json} Error response for server issues:
 * {
 *   "error": "Failed to fetch restock data"
 * }
 */

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const query = fs.readFileSync(path.join(process.cwd(), 'utils', 'sql', 'restock-report.sql'), 'utf8');
    const result = await db.query(query);
    
    const restockData = result.rows.map(row => ({
      itemName: row.itemName,
      currentStock: row.currentStock,
      neededForWeek: row.neededForWeek,
      neededForGameWeek: row.neededForGameWeek,
    }));

    res.status(200).json(restockData);
  } catch (error) {
    console.error('Error fetching restock data:', error);
    res.status(500).json({ error: 'Failed to fetch restock data' });
  }
}