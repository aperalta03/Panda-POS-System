import fs from 'fs';
import path from 'path';
import database from '../../app/utils/database';
import tempSalesData from '../../app/data/tempSalesData';
import sql from '../../app/utils/sql/z-report';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            // Calculate daily totals from tempSalesData
            const totalSales = tempSalesData.reduce((acc, transaction) => acc + transaction.total, 0);
            const totalOrders = tempSalesData.length;
            const today = new Date().toISOString().split('T')[0];

            // Read the SQL file for Z-Report
            const filePath = path.join(process.cwd(), sql);
            const queryText = fs.readFileSync(filePath, 'utf-8');

            // Insert daily totals into the database
            await database.query(queryText, [today, totalSales, totalOrders]);

            // Reset tempSalesData for the next day
            tempSalesData.length = 0;

            res.status(200).json({ message: 'Z-Report generated, totals reset for the next day.' });
        } catch (error) {
            console.error('Error running Z-Report:', error);
            res.status(500).json({ error: 'Error running Z-Report' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
