
// pages/api/items.js
import database from '../../utils/database';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const queryText = 'SELECT DISTINCT item_name FROM inventory ORDER BY item_name;';
            const result = await database.query(queryText);
            res.status(200).json({ items: result.rows });
        } catch (error) {
            console.error('Error fetching items:', error);
            res.status(500).json({ error: 'Error fetching items' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}