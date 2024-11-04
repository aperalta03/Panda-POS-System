import fs from 'fs';
import path from 'path';
import database from '../../utils/database';

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