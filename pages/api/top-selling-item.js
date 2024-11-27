import fs from 'fs';
import path from 'path';
import database from '../../utils/database';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Read the SQL query from sales-report.sql
      const filePath = path.join(process.cwd(), 'utils', 'sql', 'sales-report.sql');
      const queryText = fs.readFileSync(filePath, 'utf-8');

      // Define date range (e.g., last 30 days)
      const currentDate = new Date();
      const startDate = new Date();
      startDate.setDate(currentDate.getDate() - 30);

      const startDateFormatted = startDate.toISOString().split('T')[0]; // YYYY-MM-DD
      const endDateFormatted = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD

      // Execute query with date range parameters
      const result = await database.query(queryText, [startDateFormatted, endDateFormatted]);

      if (result.rows.length > 0) {
        // Define items to skip
        const excludedItems = [
          'Bowl',
          'Plate',
          'Bigger Plate',
          'A La Carte',
          'Fountain Drink',
          'Bottled Drink',
        ];

        // Find the first item not in the excluded list
        const topItem = result.rows.find(
          (row) => !excludedItems.includes(row.item_name)
        );

        if (topItem) {
          res.status(200).json({ data: topItem });
          //console.log('Fetched top-selling item:', topItem);
        } else {
          res.status(404).json({ error: 'No eligible top-selling item found' });
        }
      } else {
        res.status(404).json({ error: 'No data found' });
      }
    } catch (error) {
      console.error('Error fetching top selling item:', error);
      res.status(500).json({ error: 'Error fetching top selling item' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
