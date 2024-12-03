import fs from 'fs';
import path from 'path';
import database from '../../utils/database';

/**
 * API Route to Add a New Employee
 *
 * @author Conner Black
 *
 * @description
 * This API endpoint handles adding a new employee to the database. It expects a `POST` request
 * containing employee details in the request body. The data is validated, formatted, and inserted into
 * the database using a pre-defined SQL query. If the insertion is successful, it responds with the employee's data.
 * In case of an error, it returns a generic error message.
 *
 * @features
 * - Employee Data Validation: Ensures that the provided employee data is correctly formatted before insertion.
 * - Database Interaction: Reads the SQL query from a file and executes it to insert the employee data into the database.
 * - Error Handling: Catches errors during the process and responds with a status code and error message.
 * - Method Validation: Only allows `POST` requests. If the method is not `POST`, it returns a `405 Method Not Allowed` error.
 *
 * @requestBody
 * - `employee_id`: The unique identifier for the employee.
 * - `first_name`: The employee's first name.
 * - `last_name`: The employee's last name.
 * - `date_of_birth`: The employee's date of birth, formatted as a string (YYYY-MM-DD).
 * - `phone_number`: The employee's phone number.
 * - `hourly_rate`: The employee's hourly pay rate.
 * - `is_manager`: A boolean indicating if the employee is a manager.
 * - `is_parttime`: A boolean indicating if the employee works part-time.
 *
 * @response
 * - `200 OK`: Returns a success message and the added employee's data if the insertion is successful.
 * - `400 Bad Request`: Returns an error message if there is an issue with the input data.
 * - `405 Method Not Allowed`: Returns an error message if the request method is not `POST`.
 *
 * @dependencies
 * - `fs`: For reading the SQL query file.
 * - `path`: For resolving the file path to the SQL query.
 * - `database`: Utility module for interacting with the database.
 *
 * @example
 * POST /api/add-employee
 * Request Body:
 * {
 *   "employee_id": "12345",
 *   "first_name": "John",
 *   "last_name": "Doe",
 *   "date_of_birth": "1990-01-01",
 *   "phone_number": "123-456-7890",
 *   "hourly_rate": 20.5,
 *   "is_manager": false,
 *   "is_parttime": true
 * }
 *
 * Response:
 * {
 *   "message": "Employee added successfully",
 *   "employee": {
 *     "employee_id": "12345",
 *     "first_name": "John",
 *     "last_name": "Doe",
 *     "date_of_birth": "1990-01-01",
 *     "phone_number": "123-456-7890",
 *     "hourly_rate": 20.5,
 *     "is_manager": false,
 *     "is_parttime": true
 *   }
 * }
 */

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const {
            employee_id,
            first_name,
            last_name,
            date_of_birth,
            phone_number,
            hourly_rate,
            is_manager,
            is_parttime,
        } = req.body;

        try {
            // SQL query to insert the new employee
            const formattedDateOfBirth = new Date(date_of_birth);
            const formattedDateString = formattedDateOfBirth.toISOString().split('T')[0];  // This formats it as YYYY-MM-DD

            // SQL query to insert the new employee
            const filePath = path.join(process.cwd(), 'utils', 'sql', 'add-employee.sql');
            const queryText = fs.readFileSync(filePath, 'utf-8');
            
            const values = [
                employee_id, 
                first_name,   
                last_name,    
                formattedDateString,  // Use the formatted date string
                phone_number,
                hourly_rate,
                is_manager,
                is_parttime,
                true
            ];

            // Attempt to add the new employee to the database
            const result = await database.query(queryText, values);

            // Send success response with employee details
            res.status(200).json({ message: 'Employee added successfully', employee: result.rows[0] });
        } catch (error) {
            // Log the error (for debugging) but do not crash the app
            console.error('Error adding new employee:', error);

            // Send a generic error message to the user
            res.status(400).json({ error: 'Bad input. Please check your data and try again.' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}