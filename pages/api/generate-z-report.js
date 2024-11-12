import database from '../../utils/database';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const salesInsertQuery = fs.readFileSync(path.join(process.cwd(), 'utils', 'sql', 'z-report-sales.sql'), 'utf8');
      
      await database.query(salesInsertQuery);
      await database.query('DELETE FROM salesRecord');
      await database.query('DELETE FROM saleItems');

      res.status(200).json({ message: 'Z Report generated, sales recorded, and data reset.' });
    } catch (error) {
      console.error('Error generating Z report:', error);
      res.status(500).json({ error: 'Error generating Z Report' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}