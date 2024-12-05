import database from '../../utils/database';

/**
 * API Route to Update Order Status
 *
 * @author Anson Thai
 * 
 * @module api/kitchen-update-order-status
 *
 * @description
 * Handles `POST` requests to update an order's status in the database. This API
 * is designed to be used in a kitchen setting where orders can be updated before
 * they are started.
 *
 * @features
 * - **Database Query**: Updates the specified order's status in `saleItems`.
 * - **Request Validation**: Ensures only `POST` requests are processed and that the
 *   `saleNumber`, `orderNumber`, and `status` are provided in the request body.
 * - **Error Handling**: Catches and logs database errors, returning a 500 status code.
 *
 * @requestMethod
 * - `POST`: Updates the order status.
 *
 * @requestBody
 * - `saleNumber` (number): The unique identifier for the sale.
 * - `orderNumber` (number): The order number to update.
 * - `status` (string): The new status of the order (e.g., "Not Started", "In Progress", "Completed").
 *
 * @response
 * - `200 OK`: Returns a success message if the order status is updated successfully.
 * - `400 Bad Request`: Returns an error message if the required data is missing or invalid.
 * - `500 Internal Server Error`: Returns an error message if a database or server error occurs.
 * - `405 Method Not Allowed`: Returns an error message if the request method is not `POST`.
 *
 * @example
 * // Request:
 * POST /api/kitchen-update-order-status
 * {
 *   "saleNumber": 12345,
 *   "orderNumber": 1,
 *   "status": "In Progress"
 * }
 *
 * // Success Response:
 * {
 *   "message": "Order status updated successfully"
 * }
 *
 * // Error Response:
 * {
 *   "error": "Error updating order status"
 * }
 */
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