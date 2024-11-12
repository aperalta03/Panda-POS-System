import database from '../../utils/database';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { saleDate, saleTime, totalPrice, employeeID, source, items } = req.body;

    if (!saleDate || !saleTime) {
      console.error('Missing saleDate or saleTime in request body');
      return res.status(400).json({ error: 'Missing saleDate or saleTime' });
    }

    try {
      const filePath = path.join(process.cwd(), 'utils', 'sql', 'insert-salesRecord.sql');
      const insertScript = fs.readFileSync(filePath, 'utf8');

      await database.query(insertScript, [
        saleDate,
        saleTime,
        totalPrice,
        employeeID,
        source,
        JSON.stringify(
          items.flatMap(({ plateSize, items }) => items.map(itemName => ({ plateSize, itemName })))
        ),
      ]);

      res.status(200).json({ message: 'Sale recorded successfully' });
    } catch (error) {
      console.error('Error writing sales record:', error);
      res.status(500).json({ message: 'Error writing sales record' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}