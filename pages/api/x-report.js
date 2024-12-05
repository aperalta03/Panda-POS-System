import database from '../../utils/database';
import fs from 'fs';
import path from 'path';

/**
 * 
 * @author Alonso Peralta Espinoza, Conner Black
 * 
 * @description
 * Retrieves hourly sales data for the current day (X-Report).
 * @module api/x-report
 *
 * @returns {Object} Response object containing hourly sales data.
 *
 * @response
 * - `200 OK`: Returns a JSON object with hourly sales data.
 * - `500 Internal Server Error`: Returns an error message for server issues during data retrieval.
 *
 * @example
 * // Request:
 * GET /api/x-report
 *
 * // Response:
 * {
 *   "data": [
 *     { "hour": 9, "sales": 150.25 },
 *     { "hour": 10, "sales": 200.75 }
 *   ]
 * }
 *
 * @errorExample {json} General server error response:
 * {
 *   "error": "Error fetching X-Report data"
 * }
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