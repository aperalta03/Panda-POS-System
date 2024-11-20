import fs from 'fs';
import path from 'path';
import database from '../../utils/database';

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