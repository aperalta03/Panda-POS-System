import fs from 'fs';
import path from 'path';
import database from '../../utils/database'; // Utility for database operations
import salesRecord from '../../app/context/salesRecord.json'; // Path to the sales record JSON file

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Read the SQL query files
      const salesQueryPath = path.join(process.cwd(), 'utils/sql/z-report-sales.sql');
      const inventoryQueryPath = path.join(process.cwd(), 'utils/sql/z-report-inventory.sql');
      
      const salesQuery = fs.readFileSync(salesQueryPath, 'utf-8');
      const inventoryQuery = fs.readFileSync(inventoryQueryPath, 'utf-8');

      // Process each sale from salesRecord.json
      for (const sale of salesRecord) {
        // Insert sale into the sales table
        await database.query(salesQuery, [
          sale.date, // $1 - date_of_sale
          sale.employeeID, // $2 - employee_id
          sale.time, // $3 - time_of_sale
          sale.totalPrice, // $4 - price
        ]);

        // Process each item in the sale and update inventory
        for (const itemCategory of sale.items) {
          for (const item of itemCategory.items) {
            // Update inventory based on items sold
            await database.query(inventoryQuery, [1, item]); // Assuming 1 is the quantity sold
          }
        }
      }

      // Clear the salesRecord.json after processing
      fs.writeFileSync(path.join(process.cwd(), 'app/context/salesRecord.json'), JSON.stringify([]));

      // Return a success message
      res.status(200).json({ message: 'Z Report generated, sales recorded, and data reset.' });
    } catch (error) {
      console.error('Error generating Z report:', error);
      res.status(500).json({ error: 'Error generating Z Report' });
    }
  } else {
    // Handle non-POST requests
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}