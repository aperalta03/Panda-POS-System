import database from '../../utils/database';
import fs from 'fs';
import path from 'path';

/**
 * 
 ** @author Alonso Peralta Espinoza, Conner Black
 *
 * Retrieves Z-Report data including items sold, quantities, and total revenue.
 *
 * @api {get} /api/z-report
 * @apiName GetZReportInventory
 * @apiGroup Reports
 *
 * @apiSuccess {Object} Response object containing an array of Z-Report data and the total revenue.
 * 
 * @apiError (500) {Object} Response object with an error message for server issues during data retrieval.
 *
 * @apiExample {curl} Example usage:
 *   curl -X GET \
 *     http://localhost:3000/api/z-report-inventory
 *
 * @apiSuccessExample {json} Success response:
 *     {
 *       "report": [
 *         { "itemName": "Orange Chicken", "count": 50, "totalPrice": "499.50" },
 *         { "itemName": "Kung Pao Chicken", "count": 30, "totalPrice": "299.70" }
 *       ],
 *       "total": "799.20"
 *     }
 *
 * @apiErrorExample {json} General server error response:
 *     {
 *       "error": "Error fetching Z-Report data"
 *     }
 */

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const reportQuery = fs.readFileSync(path.join(process.cwd(), 'utils', 'sql', 'z-report-inventory.sql'), 'utf8');
      
      const result = await database.query(reportQuery);
      const report = result.rows.map(row => ({
        itemName: row.item_name,
        count: row.quantity_sold,
        totalPrice: parseFloat(row.total_price).toFixed(2),
      }));

      // Calculate total sales for the day
      const total = report.reduce((acc, item) => acc + parseFloat(item.totalPrice), 0).toFixed(2);

      res.status(200).json({ report, total });
    } catch (error) {
      console.error('Error fetching Z-Report data:', error);
      res.status(500).json({ error: 'Error fetching Z-Report data' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
