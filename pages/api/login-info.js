import fs from 'fs';
import path from 'path';
import database from '../../utils/database';

/**
 * API Route to Retrieve All Employee Information from the Database
 *
 * @author Conner Black
 * 
 * @module api/login-info
 *
 * @description
 * This API endpoint retrieves the information of all employees from the database. It expects a `GET` request with no 
 * parameters. It returns a list of all employees, including their `employeeID`, `name`, and `isManager` status. If an 
 * error occurs during the database query or while processing the data, appropriate error messages are returned.
 *
 * @features
 * - Database Interaction: Reads an SQL query from a file to fetch all employee information from the database.
 * - Data Transformation: Maps the returned data to a simpler structure containing only `employeeID`, `name`, and `isManager`.
 * - Error Handling: Catches errors related to database issues and responds with appropriate error messages.
 * - Method Validation: Only allows `GET` requests. Returns a `405 Method Not Allowed` error for other HTTP methods.
 *
 * @response
 * - `200 OK`: Returns a list of all employees with their `employeeID`, `name`, and `isManager` status.
 * - `500 Internal Server Error`: Returns an error message if a database error occurs while fetching the employee data.
 * - `405 Method Not Allowed`: Returns this error if the request method is not `GET`.
 *
 * @dependencies
 * - `fs`: For reading the SQL query file that fetches all employee data.
 * - `path`: For resolving the file path to the SQL query.
 * - `database`: Utility module for interacting with the database.
 *
 * @example
 * GET /api/employee-info
 *
 * Response (All Employees Retrieved Successfully):
 * {
 *   "data": [
 *     {
 *       "employeeID": "123",
 *       "name": "John Doe",
 *       "isManager": true
 *     },
 *     {
 *       "employeeID": "124",
 *       "name": "Jane Smith",
 *       "isManager": false
 *     }
 *   ]
 * }
 *
 * Response (Database Error):
 * {
 *   "error": "Error fetching Employee info"
 * }
 */

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const filePath = path.join(process.cwd(), 'utils', 'sql', 'employee-info.sql');
            const queryText = fs.readFileSync(filePath, 'utf-8');

            const result = await database.query(queryText);

            const employeeData = result.rows.map((employee) => ({
                employeeID: employee.employee_id, 
                name: `${employee.first_name} ${employee.last_name}`, 
                isManager: employee.is_manager   
            }));

            // Return the transformed data
            res.status(200).json({ data: employeeData });
        } catch (error) {
            console.error('Error fetching Employee info:', error);
            res.status(500).json({ error: 'Error fetching Employee info' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}