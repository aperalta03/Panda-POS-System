import database from '../../utils/database';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { saleDate, saleTime, totalPrice, employeeID, source, items } = req.body;

    if (!saleDate || !saleTime || !employeeID) {
      console.error('Missing saleDate, saleTime, or employeeID in request body');
      return res.status(400).json({ error: 'Missing required fields: saleDate, saleTime, or employeeID' });
    }

    try {
      const filePath = path.join(process.cwd(), 'utils', 'sql', 'insert-salesRecord.sql');
      const insertScript = fs.readFileSync(filePath, 'utf8');

      console.log('Executing SQL script:', insertScript);

      const response = await database.query(insertScript, [
        saleDate,
        saleTime,
        totalPrice,
        employeeID,
        source,
        JSON.stringify(
          items.flatMap(({ plateSize, items }) => items.map(itemName => ({ plateSize, itemName })))
        ),
      ]);

      console.log('SQL script executed successfully:', response);
      res.status(200).json({ message: 'Sale recorded successfully' });
    } catch (error) {
      console.error('Error writing sales record:', error);
      res.status(500).json({ message: 'Error writing sales record', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}