import database from '../../utils/database';

/**
 * 
 * @author Alonso Peralta Espinoza
 * 
 * @module api/reset-salesRecord
 *
 * Resets sales data by truncating `saleItems` and `salesRecord` tables.
 *
 * @api {post} /api/reset-salesRecord
 * @apiName ResetSalesRecord
 * @apiGroup Sales
 *
 * @apiSuccess {Object} Response object with a success message.
 * 
 * @apiError (500) {Object} Response object with an error message for server issues during the reset process.
 *
 * @apiExample {curl} Example usage:
 *   curl -X POST \
 *     http://localhost:3000/api/reset-sales-data
 *
 * @apiSuccessExample {json} Success response:
 *     {
 *       "message": "Sales data reset successfully"
 *     }
 *
 * @apiErrorExample {json} General server error response:
 *     {
 *       "error": "Error resetting sales data"
 *     }
 */

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