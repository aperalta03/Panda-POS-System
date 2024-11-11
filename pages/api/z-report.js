import database from '../../utils/database';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const reportQuery = fs.readFileSync(path.join(process.cwd(), 'utils', 'sql', 'z-report-inventory.sql'), 'utf8');
      
      const result = await database.query(reportQuery);
      const report = result.rows.map(row => ({
        itemName: row.item_name,
        count: row.quantity_sold,
        totalPrice: parseFloat(row.total_price).toFixed(2),
      }));

      // Calculate total sales for the day
      const total = report.reduce((acc, item) => acc + parseFloat(item.totalPrice), 0).toFixed(2);

      res.status(200).json({ report, total });
    } catch (error) {
      console.error('Error fetching Z-Report data:', error);
      res.status(500).json({ error: 'Error fetching Z-Report data' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
