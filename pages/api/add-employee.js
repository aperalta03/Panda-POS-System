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
            const queryText = `
                INSERT INTO employees 
                (
                    employee_id, 
                    first_name, 
                    last_name, 
                    dob, 
                    phone_number, 
                    hourly_rate, 
                    is_manager, 
                    is_part_time, 
                    is_active
                )
                VALUES
                (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9
                )
            `;
            
            const values = [
                employee_id, 
                first_name,   // already wrapped in single quotes in the frontend
                last_name,    // already wrapped in single quotes in the frontend
                date_of_birth, // already formatted as 'YYYY-MM-DD'
                phone_number,
                hourly_rate,
                is_manager,
                is_parttime,
                true // Assuming all new employees are active
            ];

            const result = await database.query(queryText, values);
            res.status(200).json({ message: 'Employee added successfully', employee: result.rows[0] });
        } catch (error) {
            console.error('Error adding new employee:', error);
            res.status(500).json({ error: 'Failed to add new employee' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}