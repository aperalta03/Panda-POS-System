import database from '../../utils/database';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const filePath = path.join(process.cwd(), 'utils', 'sql', 'x-report.sql');
      const hourlySalesQuery = fs.readFileSync(filePath, 'utf-8');

      const result = await database.query(hourlySalesQuery);

      const hourlySalesArray = result.rows.map(({ hour, sales }) => ({
        hour: parseInt(hour, 10),
        sales: parseFloat(sales),
      }));

      res.status(200).json({ data: hourlySalesArray });
    } catch (error) {
      console.error('Error fetching X-Report data:', error);
      res.status(500).json({ error: 'Error fetching X-Report data' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}