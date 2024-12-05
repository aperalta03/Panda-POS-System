import fs from 'fs';
import path from 'path';
import database from '../../utils/database';
/**
 * @description
 * This API endpoint retrieves employee data from the database for viewing. It expects a GET request with no parameters. 
 * It returns a list of all employees, including their `employeeId`, `name`, and `isActive` status. If an error occurs 
 * during the database query or while processing the data, appropriate error messages are returned.
 *
 * @author Alonso Peralta Espinoza
 * @module api/employee-viewer
 *
 * @requestBody
 * No request body is required.
 *
 * @response
 * - `200 OK`: Returns a list of all employees with their `employeeId`, `name`, and `isActive` status.
 * - `500 Internal Server Error`: Returns an error message if a database error occurs while fetching the employee data.
 *
 * @example
 * curl -X GET \
 *   http://localhost:3000/api/employee-viewer
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