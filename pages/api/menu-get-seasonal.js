import fs from 'fs';
import path from 'path';
import database from '../../utils/database';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const filePath = path.join(process.cwd(), 'utils', 'sql', 'menu-get-seasonal.sql');
      const queryText = fs.readFileSync(filePath, 'utf-8');

      // Seasonal Menu Item ID = 7
      const values = [7];
      const result = await database.query(queryText, values);

      if (result.rows.length > 0) {
        res.status(200).json({ seasonalItem: result.rows[0] });
      } else {
        res.status(404).json({ error: 'Seasonal item not found' });
      }
    } catch (error) {
      console.error('Error fetching seasonal item:', error);
      res.status(500).json({ error: 'Error fetching seasonal item' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}