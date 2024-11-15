import database from '../../utils/database';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { saleNumber, orderNumber, status } = req.body;

        if (!saleNumber || !orderNumber || !status) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        try {
            const updateQuery = `
        UPDATE saleItems
        SET status = $1
        WHERE saleNumber = $2 AND orderNumber = $3;
      `;

            await database.query(updateQuery, [status, saleNumber, orderNumber]);
            res.status(200).json({ message: 'Order status updated successfully' });
        } catch (error) {
            console.error('Error updating order status:', error);
            res.status(500).json({ error: 'Error updating order status' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}