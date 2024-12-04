import database from '../../utils/database';
import fs from 'fs';
import path from 'path';

/**
 * 
 * @author Alonso Peralta Espinoza
 *
 * Generates the Z-Report, records sales in the database, and resets sales data.
 *
 * @api {post} /api/generate-z-report
 * @apiName GenerateZReport
 * @apiGroup Reports
 *
 * @apiSuccess {Object} Response object with a success message confirming the Z-Report generation and data reset.
 * 
 * @apiError (500) {Object} Response object with an error message for server issues during the Z-Report process.
 *
 * @apiExample {curl} Example usage:
 *   curl -X POST \
 *     http://localhost:3000/api/z-report-sales
 *
 * @apiSuccessExample {json} Success response:
 *     {
 *       "message": "Z Report generated, sales recorded, and data reset."
 *     }
 *
 * @apiErrorExample {json} General server error response:
 *     {
 *       "error": "Error generating Z Report"
 *     }
 */

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const salesInsertQuery = fs.readFileSync(path.join(process.cwd(), 'utils', 'sql', 'z-report-sales.sql'), 'utf8');
      
      await database.query(salesInsertQuery);
      await database.query('DELETE FROM salesRecord');
      await database.query('DELETE FROM saleItems');

      res.status(200).json({ message: 'Z Report generated, sales recorded, and data reset.' });
    } catch (error) {
      console.error('Error generating Z report:', error);
      res.status(500).json({ error: 'Error generating Z Report' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}