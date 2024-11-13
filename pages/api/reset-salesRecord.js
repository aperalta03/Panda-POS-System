import database from '../../utils/database';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {

      //! TODO: Need to Re-Add Inventory when you Delete... delete is only for testing so not high priority
      await database.query('BEGIN');
      await database.query('TRUNCATE TABLE saleItems, salesRecord CASCADE');
      await database.query('COMMIT');

      res.status(200).json({ message: 'Sales data reset successfully' });
    } catch (error) {
      await database.query('ROLLBACK');
      console.error('Error resetting sales data:', error);
      res.status(500).json({ error: 'Error resetting sales data' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}