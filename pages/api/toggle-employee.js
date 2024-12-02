import fs from 'fs';
import path from 'path';
import database from '../../utils/database';

/**
 * 
 ** @author Alonso Peralta Espinoza
 *
 * Updates the active/inactive status of an employee in the database.
 *
 * @api {post} /api/toggle-employee
 * @apiName ToggleEmployeeStatus
 * @apiGroup Employee
 *
 * @apiParam {Number} employeeId ID of the employee whose status is being updated.
 * @apiParam {Boolean} isActive New status of the employee (true for active, false for inactive).
 *
 * @apiSuccess {Object} Response object with a success message.
 * 
 * @apiError (500) {Object} Response object with an error message for server issues.
 *
 * @apiExample {curl} Example usage:
 *   curl -X POST \
 *     http://localhost:3000/api/toggle-employee \
 *     -H 'Content-Type: application/json' \
 *     -d '{
 *           "employeeId": 123,
 *           "isActive": true
 *         }'
 *
 * @apiSuccessExample {json} Success response:
 *     {
 *       "message": "Employee status updated successfully"
 *     }
 *
 * @apiErrorExample {json} General server error response:
 *     {
 *       "error": "Error updating employee status"
 *     }
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