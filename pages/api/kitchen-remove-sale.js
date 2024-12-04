import database from '../../utils/database';

/**
 * API Route to Remove a Sale from the Kitchen
 *
 * @author Anson Thai
 *
 * @description
 * Handles `POST` requests to remove a sale from the kitchen. The request body
 * should contain the `saleNumber` of the sale to be removed. This API is designed
 * to be used in a kitchen setting where orders can be cancelled before they are
 * started.
 *
 * @features
 * - **Database Query**: Deletes the sale record from `salesRecord` and associated
 *   items from `saleItems`.
 * - **Request Validation**: Ensures only `POST` requests are processed and that the
 *   `saleNumber` is provided in the request body.
 * - **Error Handling**: Catches and logs database errors, returning a 500 status code.
 *
 * @requestMethod
 * - `POST`: Deletes the sale.
 *
 * @requestBody
 * - `saleNumber` (number): The unique identifier for the sale.
 *
 * @response
 * - `200 OK`: Returns a success message if the sale is deleted successfully.
 * - `400 Bad Request`: Returns an error message if the `saleNumber` is missing or invalid.
 * - `500 Internal Server Error`: Returns an error message if a database or server error occurs.
 * - `405 Method Not Allowed`: Returns an error message if the request method is not `POST`.
 *
 * @example
 * // Request:
 * POST /api/kitchen-remove-sale
 * {
 *   "saleNumber": 12345
 * }
 *
 * // Success Response:
 * {
 *   "message": "Sale removed successfully"
 * }
 *
 * // Error Response:
 * {
 *   "error": "Error removing sale"
 * }
 */
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