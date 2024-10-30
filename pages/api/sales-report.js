import fs from 'fs';
import path from 'path';
import database from '../../app/utils/database';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { startDate, endDate } = req.query;

        try {
            // Read the SQL file content
            const filePath = path.join(process.cwd(), '../../app/utils/sql/sales_report.sql');
            const queryText = fs.readFileSync(filePath, 'utf-8');

            // Execute the query
            const result = await database.query(queryText, [startDate, endDate]);
            res.status(200).json({ data: result.rows });
        } catch (error) {
            console.error('Error fetching sales report data:', error);
            res.status(500).json({ error: 'Error fetching sales report data' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}