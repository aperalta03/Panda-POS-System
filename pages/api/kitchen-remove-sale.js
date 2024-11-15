import database from '../../utils/database';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { saleNumber } = req.body;

        if (!saleNumber) {
            return res.status(400).json({ error: 'Missing required saleNumber' });
        }

        try {
            // Delete from saleItems
            const deleteItemsQuery = `
                DELETE FROM saleItems
                WHERE saleNumber = $1;
            `;
            await database.query(deleteItemsQuery, [saleNumber]);

            // Delete from saleRecord
            const deleteRecordQuery = `
                DELETE FROM salesRecord
                WHERE saleNumber = $1;
            `;
            await database.query(deleteRecordQuery, [saleNumber]);

            res.status(200).json({ message: 'Sale removed successfully' });
        } catch (error) {
            console.error('Error removing sale:', error);
            res.status(500).json({ error: 'Error removing sale' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}