import fs from 'fs';
import path from 'path';
import database from '../../utils/database';

/**
 * @description
 * This API endpoint retrieves an employee's information from the database based on the provided `employeeId`.
 * It expects a `POST` request with the `employeeId` in the request body. If the employee is found, their details are returned.
 * If not, appropriate error messages are returned.
 *
 * @author Conner Black
 * @module api/get-employee-info
 *
 * @requestBody
 * - `employeeId`: The unique ID of the employee to be fetched (required).
 *
 * @response
 * - `200 OK`: Returns the employee's data if the employee is found.
 * - `400 Bad Request`: Returns an error message if `employeeId` is missing in the request body.
 * - `404 Not Found`: Returns an error message if no employee is found with the provided `employeeId`.
 * - `500 Internal Server Error`: Returns an error message if a database error occurs while fetching the employee.
 * - `405 Method Not Allowed`: Returns this error if the request method is not `POST`.
 *
 * @example
 * POST /api/get-employee-info
 * Request Body:
 * {
 *   "employeeId": "123"
 * }
 *
 * Response (Employee Found):
 * {
 *   "data": {
 *     "employee_id": "123",
 *     "first_name": "John",
 *     "last_name": "Doe",
 *     "phone_number": "555-1234",
 *     "hourly_rate": "25",
 *     "is_manager": true
 *   }
 * }
 *
 * Response (Missing Employee ID):
 * {
 *   "error": "Employee ID is required"
 * }
 *
 * Response (Employee Not Found):
 * {
 *   "error": "Employee not found"
 * }
 */

export default async function handler(req, res) {
  if (req.method === 'POST') {  // Change to POST method since you're using POST from the frontend
    try {
      const { employeeId } = req.body;  // Extract employeeId from request body

      if (!employeeId) {
        return res.status(400).json({ error: 'Employee ID is required' });
      }

      // Read SQL query from file
      const filePath = path.join(process.cwd(), 'utils', 'sql', 'get-employee.sql');
      const queryText = fs.readFileSync(filePath, 'utf-8');

      // Execute the query with the provided employeeId
      const result = await database.query(queryText, [employeeId]);

      // Check if any employee was found with the given ID
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Employee not found' });
      }

      // Return the found employee's data
      res.status(200).json({ data: result.rows[0] });  // Return only the first matching employee
    } catch (error) {
      console.error('Error fetching employee data:', error);
      res.status(500).json({ error: 'An error occurred while fetching the employee. Please try again.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}