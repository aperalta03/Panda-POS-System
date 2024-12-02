import fs from 'fs';
import path from 'path';
import database from '../../utils/database';

/**
 * 
 ** @author Alonso Peralta Espinoza
 *
 * Fetches employee data from the database for viewing.
 *
 * @api {get} /api/employee-viewer
 * @apiName EmployeeViewer
 * @apiGroup Employee
 *
 * @apiSuccess {Object} Response object containing employee data.
 * 
 * @apiError (500) {Object} Response object with an error message for server issues.
 *
 * @apiExample {curl} Example usage:
 *   curl -X GET \
 *     http://localhost:3000/api/employee-viewer
 *
 * @apiSuccessExample {json} Success response:
 *     {
 *       "data": [
 *         { "employeeId": 123, "name": "John Doe", "isActive": true },
 *         { "employeeId": 456, "name": "Jane Smith", "isActive": false }
 *       ]
 *     }
 *
 * @apiErrorExample {json} General server error response:
 *     {
 *       "error": "Error accessing database"
 *     }
 */

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const filePath = path.join(process.cwd(), 'utils', 'sql', 'employee-viewer.sql');
      const queryText = fs.readFileSync(filePath, 'utf-8');

      const result = await database.query(queryText);
      res.status(200).json({ data: result.rows });
    } catch (error) {
      console.error('Error accessing database:', error);
      res.status(500).json({ error: 'Error accessing database' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 