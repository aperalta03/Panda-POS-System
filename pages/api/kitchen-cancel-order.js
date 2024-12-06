import database from '../../utils/database';

/**
 * @description
 * This API endpoint handles the cancellation of an order. It expects a `POST` request
 * containing the `saleNumber` and `orderNumber` in the request body. The endpoint
 * validates the data, deletes the specified order from the `saleItems` table, and
 * checks for remaining items under the same `saleNumber`. If no items remain, the
 * corresponding `salesRecord` is also deleted. On success, it responds with a success
 * message. If an error occurs, it returns an appropriate error response.
 *
 * @author Anson Thai
 * @module api/kitchen-cancel-order
 *
 * @requestBody
 * - `saleNumber` (number): The unique identifier for the sale.
 * - `orderNumber` (number): The order number to cancel.
 *
 * @response
 * - `200 OK`: Returns a success message if the cancellation is successful.
 * - `400 Bad Request`: Returns an error message if the required data is missing or invalid.
 * - `405 Method Not Allowed`: Returns an error message if the request method is not `POST`.
 * - `500 Internal Server Error`: Returns an error message if a database or server error occurs.
 *
 * @example
 * // Request:
 * POST /api/kitchen-cancel-order
 * {
 *   "saleNumber": 12345,
 *   "orderNumber": 1
 * }
 *
 * // Response:
 * {
 *   "message": "Order canceled successfully"
 * }
 *
 * // Error Example:
 * {
 *   "error": "Error cancelling order"
 * }
 */
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