import fs from 'fs';
import path from 'path';
import db from '../../utils/database';

/**
 * 
 * @author Alonso Peralta Espinoza
 * 
 * @module api/restock-Report-inventory
 *
 * Retrieves restock data including current stock and amounts needed for the week and game week.
 *
 * @api {get} /api/restock-Report-inventory
 * @apiName GetRestockReport
 * @apiGroup Inventory
 *
 * @apiSuccess {Object} Response object containing an array of restock data.
 * 
 * @apiError (500) {Object} Response object with an error message for server issues during data retrieval.
 *
 * @apiExample {curl} Example usage:
 *   curl -X GET \
 *     http://localhost:3000/api/restock-report
 *
 * @apiSuccessExample {json} Success response:
 *     [
 *       {
 *         "itemName": "Chicken Breast",
 *         "currentStock": 50,
 *         "neededForWeek": 100,
 *         "neededForGameWeek": 150
 *       },
 *       {
 *         "itemName": "Orange Sauce",
 *         "currentStock": 20,
 *         "neededForWeek": 50,
 *         "neededForGameWeek": 70
 *       }
 *     ]
 *
 * @apiErrorExample {json} General server error response:
 *     {
 *       "error": "Failed to fetch restock data"
 *     }
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