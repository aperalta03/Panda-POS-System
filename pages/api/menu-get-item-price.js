import fs from 'fs';
import path from 'path';
import database from '../../utils/database';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const filePath = path.join(process.cwd(), 'utils', 'sql', 'menu-get-item-price.sql');
      const queryText = fs.readFileSync(filePath, 'utf-8');

      const result = await database.query(queryText);

      if (result.rows.length > 0) {
        res.status(200).json({ menuItems: result.rows });
        console.log("Fetched item:", result.rows);
      } else {
        res.status(404).json({ error: 'Menu items not found' });
      }      
    } catch (error) {
      console.error('Error fetching menu items:', error);
      res.status(500).json({ error: 'Error fetching menu items' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}