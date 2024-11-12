import database from '../../utils/database';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { saleNumber, status } = req.body;

    try {
      const updateQuery = `
        UPDATE salesRecord
        SET status = $1
        WHERE saleNumber = $2
      `;
      await database.query(updateQuery, [status, saleNumber]);

      res.status(200).json({ message: 'Order status updated successfully' });
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ error: 'Failed to update order status' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}