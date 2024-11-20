import fs from 'fs';
import path from 'path';
import database from '../../utils/database';

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