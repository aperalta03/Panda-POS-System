import database from '../../utils/database';
import fs from 'fs';
import path from 'path';

/**
 * 
 * @author Alonso Peralta Espinoza, Connner Black
 * 
 * @module api/x-report
 *
 * Retrieves hourly sales data for the current day (X-Report).
 *
 * @api {get} /api/x-report
 * @apiName GetXReport
 * @apiGroup Reports
 *
 * @apiSuccess {Object} Response object containing hourly sales data.
 * 
 * @apiError (500) {Object} Response object with an error message for server issues during data retrieval.
 *
 * @apiExample {curl} Example usage:
 *   curl -X GET \
 *     http://localhost:3000/api/x-report
 *
 * @apiSuccessExample {json} Success response:
 *     {
 *       "data": [
 *         { "hour": 9, "sales": 150.25 },
 *         { "hour": 10, "sales": 200.75 }
 *       ]
 *     }
 *
 * @apiErrorExample {json} General server error response:
 *     {
 *       "error": "Error fetching X-Report data"
 *     }
 */


 export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const filePath = path.join(process.cwd(), 'utils', 'sql', 'x-report.sql');
      const hourlySalesQuery = fs.readFileSync(filePath, 'utf-8');

      //console.log('Executing SQL:', hourlySalesQuery); // Debugging

      const result = await database.query(hourlySalesQuery);

      //console.log('Query Results:', result.rows); // Debugging

      const hourlySalesArray = result.rows.map(({ hour, sales }) => ({
        hour: parseInt(hour, 10),
        sales: parseFloat(sales),
      }));

      res.status(200).json({ data: hourlySalesArray });
    } catch (error) {
      console.error('Error fetching X-Report data:', error);
      res.status(500).json({ error: 'Error fetching X-Report data' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}