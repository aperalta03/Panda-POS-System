import fs from 'fs';
import path from 'path';
import database from '../../utils/database';

/**
 * @description
 * Updates the active/inactive status of an employee in the database.
 * @author Alonso Peralta Espinoza
 * @module api/toggle-employee
 *
 * @param {Number} employeeId - ID of the employee whose status is being updated.
 * @param {Boolean} isActive - New status of the employee (true for active, false for inactive).
 *
 * @returns {Object} Response object with a success message.
 *
 * @response
 * - `200 OK`: Returns a success message if the status was updated successfully.
 * - `500 Internal Server Error`: Returns an error message for server issues.
 *
 * @example
 * // Request:
 * POST /api/toggle-employee
 * {
 *   "employeeId": 123,
 *   "isActive": true
 * }
 *
 * // Response:
 * {
 *   "message": "Employee status updated successfully"
 * }
 *
 * @errorExample {json} General server error response:
 * {
 *   "error": "Error updating employee status"
 * }
 */

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { employeeId, isActive } = req.body;

    try {
      const filePath = path.join(process.cwd(), 'utils', 'sql', 'toggle-employee.sql');
      const queryText = fs.readFileSync(filePath, 'utf-8');

      await database.query(queryText, [isActive, employeeId]);
      res.status(200).json({ message: 'Employee status updated successfully' });
    } catch (error) {
      console.error('Error updating employee status:', error);
      res.status(500).json({ error: 'Error updating employee status' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}