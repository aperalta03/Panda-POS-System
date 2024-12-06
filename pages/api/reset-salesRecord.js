import database from '../../utils/database';

/**
 * @description
 * Resets sales data by truncating `saleItems` and `salesRecord` tables.
 * @author Alonso Peralta Espinoza
 * @module api/reset-salesRecord
 *
 * @features
 * - Resets sales data by truncating the `saleItems` and `salesRecord` tables.
 * - Handles the reset operation with error handling for server issues.
 * 
 * @requestBody
 * - No request body is required for this `POST` request.
 *
 * @response
 * - `200 OK`: Returns a success message if the reset is successful.
 * - `500 Internal Server Error`: Returns an error message if there is an issue with resetting sales data.
 *
 * @example
 * // Request:
 * POST /api/reset-salesRecord
 *
 * // Response:
 * {
 *   "message": "Sales data reset successfully"
 * }
 *
 * @errorExample {json} Error response for server issues:
 * {
 *   "error": "Error resetting sales data"
 * }
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