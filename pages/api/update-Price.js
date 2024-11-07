import fs from 'fs';
import path from 'path';
import database from '../../utils/database';

export default async function handler(req, res) {
    if (req.method === 'POST') {
      const { name, price } = req.body;
  
      // Validate inputs
      if (!name || price === undefined || isNaN(price)) {
        return res.status(400).json({ error: "Invalid item name or price" });
      }
  
      try {
        console.log("Updating price:", name, price);
        const filePath = path.join(process.cwd(), 'utils', 'sql', 'update-price.sql');
        const queryText = fs.readFileSync(filePath, 'utf-8');
  
        // Run the query and capture the result
        const result = await database.query(queryText, [price, name.trim()]);
  
        console.log("Query result:", result);
        res.status(200).json({ message: 'Item price updated successfully' });
      } catch (error) {
        console.error('Error updating item price:', error);
        res.status(500).json({ error: 'Failed to update item price' });
      }
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}  