import fs from 'fs';
import path from 'path';
import db from '../../utils/database';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const query = fs.readFileSync(path.join(process.cwd(), 'utils', 'sql', 'restock-report.sql'), 'utf8');
    const result = await db.query(query);
    
    const restockData = result.rows.map(row => ({
      itemName: row.itemName,
      currentStock: row.currentStock,
      neededForWeek: row.neededForWeek,
      neededForGameWeek: row.neededForGameWeek,
    }));

    res.status(200).json(restockData);
  } catch (error) {
    console.error('Error fetching restock data:', error);
    res.status(500).json({ error: 'Failed to fetch restock data' });
  }
}