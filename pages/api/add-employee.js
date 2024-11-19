import fs from 'fs';
import path from 'path';
import database from '../../utils/database';

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