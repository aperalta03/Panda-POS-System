import fs from 'fs';
import path from 'path';
import database from '../../utils/database';

/**
 * Handles GET requests to fetch the top-selling item from sales data.
 *
 * @author Uzair Khan
 * 
 * @module api/top-selling-item
 * 
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 *
 * @description
 * - Reads and executes a SQL query from 'sales-report.sql' to retrieve sales data
 *   for the last 30 days.
 * - Filters out certain items and identifies the top-selling item based on total revenue.
 * - Returns the top-selling item data or an error message if no eligible item is found.
 *
 * @response
 * - 200: Returns the top-selling item data in JSON format.
 * - 404: Returns an error message if no data is found or no eligible item is identified.
 * - 500: Returns an error message if there is a server-side issue.
 * - 405: Returns an error message if the request method is not allowed.
 */
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
