import fs from 'fs';
import path from 'path';
import database from '../../utils/database';

/**
 * API Route to Update an Employee's Information in the Database
 *
 * @author Conner Black
 *
 * @description
 * This API endpoint updates the information of an existing employee in the database. It expects a `POST` request with the 
 * necessary employee details (such as `employee_id`, `first_name`, `last_name`, `phone_number`, `hourly_rate`, 
 * `is_manager`, and `is_part_time`) in the request body. If the employee with the provided `employee_id` is found, 
 * the employee's details are updated. If any required field is missing or the employee does not exist, appropriate error messages are returned.
 *
 * @features
 * - Input Validation: Ensures that all required fields are provided in the request.
 * - Database Interaction: Reads an SQL query from a file to update the employee's data in the database.
 * - Error Handling: Catches errors related to missing fields, employee not found, and database issues, returning 
 *   meaningful error responses.
 * - Method Validation: Only allows `POST` requests. Returns a `405 Method Not Allowed` error for other HTTP methods.
 *
 * @requestBody
 * - `employee_id`: The unique ID of the employee to be updated (required).
 * - `first_name`: The new first name of the employee (required).
 * - `last_name`: The new last name of the employee (required).
 * - `phone_number`: The new phone number of the employee (required).
 * - `hourly_rate`: The new hourly rate of the employee (required).
 * - `is_manager`: A boolean indicating if the employee is a manager (required).
 * - `is_part_time`: A boolean indicating if the employee is part-time (required).
 *
 * @response
 * - `200 OK`: Returns a success message if the employee was successfully updated.
 * - `400 Bad Request`: Returns an error message if any required fields are missing in the request.
 * - `404 Not Found`: Returns an error message if no employee was found with the given `employee_id`.
 * - `500 Internal Server Error`: Returns an error message if a database error occurs while updating the employee.
 * - `405 Method Not Allowed`: Returns this error if the request method is not `POST`.
 *
 * @dependencies
 * - `fs`: For reading the SQL query file that updates the employee data.
 * - `path`: For resolving the file path to the SQL query.
 * - `database`: Utility module for interacting with the database.
 *
 * @example
 * POST /api/update-employee
 * Request Body:
 * {
 *   "employee_id": "123",
 *   "first_name": "John",
 *   "last_name": "Doe",
 *   "phone_number": "555-1234",
 *   "hourly_rate": "25",
 *   "is_manager": true,
 *   "is_part_time": false
 * }
 *
 * Response (Employee Updated Successfully):
 * {
 *   "message": "Employee updated successfully"
 * }
 *
 * Response (Missing Data):
 * {
 *   "error": "All fields are required"
 * }
 *
 * Response (Employee Not Found):
 * {
 *   "error": "Employee not found"
 * }
 */

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Extracting all necessary fields from the request body
      const { 
        employee_id, 
        first_name, 
        last_name, 
        phone_number, 
        hourly_rate, 
        is_manager, 
        is_part_time, 
      } = req.body;

      // Validate that all required fields are provided
      if (!employee_id || !first_name || !last_name || !phone_number || !hourly_rate || is_manager === undefined || is_part_time === undefined) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      // Read the SQL query from the file
      const filePath = path.join(process.cwd(), 'utils', 'sql', 'update-employee.sql');
      const queryText = fs.readFileSync(filePath, 'utf-8');

      // Execute the query with the provided values
      const result = await database.query(queryText, [
        first_name, 
        last_name, 
        phone_number, 
        hourly_rate, 
        is_manager, 
        is_part_time,  
        employee_id
      ]);

      // Check if any employee was found with the given employee_id
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Employee not found' });
      }

      // Return a success message
      res.status(200).json({ message: 'Employee updated successfully' });
    } catch (error) {
      console.error('Error updating employee:', error);
      res.status(500).json({ error: 'An error occurred while updating the employee. Please try again.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}