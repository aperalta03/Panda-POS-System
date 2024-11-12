import database from '../../utils/database';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { saleNumber, orderNumber } = req.body;

    if (!saleNumber || !orderNumber) {
      return res.status(400).json({ error: 'Missing saleNumber or orderNumber' });
    }

    try {
      // Start a transaction
      await database.query('BEGIN');

      // Delete the specific saleItem
      await database.query(
        `DELETE FROM saleItems WHERE saleNumber = $1 AND orderNumber = $2`,
        [saleNumber, orderNumber]
      );

      // Check if there are remaining items for the saleNumber
      const remainingItemsResult = await database.query(
        `SELECT COUNT(*) FROM saleItems WHERE saleNumber = $1`,
        [saleNumber]
      );
      const remainingItemsCount = parseInt(remainingItemsResult.rows[0].count, 10);

      // If there are no remaining items, delete the salesRecord
      if (remainingItemsCount === 0) {
        await database.query(
          `DELETE FROM salesRecord WHERE saleNumber = $1`,
          [saleNumber]
        );
      }

      // Commit the transaction
      await database.query('COMMIT');

      res.status(200).json({ message: 'Order canceled successfully' });
    } catch (error) {
      // Rollback the transaction in case of error
      await database.query('ROLLBACK');
      console.error('Error cancelling order:', error);
      res.status(500).json({ error: 'Error cancelling order' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}