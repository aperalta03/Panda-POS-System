import fs from 'fs';
import path from 'path';
import database from '../../utils/database';

/**
 * @module api/add-employee
 * 
 * @author Conner Black
 * 
 * @description
 * Handles adding a new employee to the database. This function validates input data, interacts with the database,
 * and returns a success or error response.
 * 
 * @function addEmployee
 * 
 * @param {Object} employeeData - The details of the employee to add.
 * @param {string} employeeData.employee_id - The unique identifier for the employee.
 * @param {string} employeeData.first_name - The employee's first name.
 * @param {string} employeeData.last_name - The employee's last name.
 * @param {string} employeeData.date_of_birth - The employee's date of birth in the format YYYY-MM-DD.
 * @param {string} employeeData.phone_number - The employee's phone number.
 * @param {number} employeeData.hourly_rate - The employee's hourly pay rate.
 * @param {boolean} employeeData.is_manager - Whether the employee is a manager.
 * @param {boolean} employeeData.is_parttime - Whether the employee works part-time.
 * 
 * @returns {Object} Returns a success response or an error message.
 * 
 * @throws {Error} Throws an error if the database query fails.
 * 
 * @example
 * // Example usage of the addEmployee function
 * const newEmployee = {
 *   employee_id: "12345",
 *   first_name: "John",
 *   last_name: "Doe",
 *   date_of_birth: "1990-01-01",
 *   phone_number: "123-456-7890",
 *   hourly_rate: 20.5,
 *   is_manager: false,
 *   is_parttime: true,
 * };
 * 
 * const result = await addEmployee(newEmployee);
 * console.log(result);
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
