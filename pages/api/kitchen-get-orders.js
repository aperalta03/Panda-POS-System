import database from '../../utils/database';

/**
 * API Route to Fetch Kitchen Orders
 * 
 * @author Anson Thai
 *
 * @description
 * Handles `GET` requests to retrieve kitchen orders from the database. Orders
 * are grouped by `saleNumber` and include sale details and associated items
 * for each sale. This API is designed to fetch orders originating from a kiosk.
 *
 * @features
 * - **Database Query**: Retrieves sales and their associated items using a 
 *   `LEFT JOIN` on `salesRecord` and `saleItems`.
 * - **Data Grouping**: Groups items by `saleNumber` for structured JSON output.
 * - **Error Handling**: Catches and logs database errors, returning a 500 status code.
 * - **Request Validation**: Ensures only `GET` requests are processed.
 *
 * @requestMethod
 * - `GET`: Fetches the orders.
 *
 * @response
 * - `200 OK`: Returns a JSON object containing the grouped orders.
 * - `500 Internal Server Error`: Returns an error message if data retrieval fails.
 * - `405 Method Not Allowed`: Returns an error message if the request method is not `GET`.
 *
 * @returns {Object} JSON response with grouped orders:
 * - `orders` (Array): Array of order objects grouped by `saleNumber`.
 *   - `saleNumber` (number): Unique identifier for the sale.
 *   - `saleDate` (Date): Date of the sale.
 *   - `saleTime` (string): Time of the sale.
 *   - `totalPrice` (number): Total price of the sale.
 *   - `employeeID` (number): ID of the employee who processed the sale.
 *   - `source` (string): Source of the sale (e.g., "Kiosk").
 *   - `items` (Array): Array of items for the sale, where each item contains:
 *     - `orderNumber` (number): Order number.
 *     - `plateSize` (string): Size of the plate.
 *     - `components` (Array): List of components in the plate.
 *     - `status` (string): Status of the order (e.g., "Not Started", "In Progress", "Completed").
 *
 * @example
 * // Request:
 * GET /api/kitchen-orders
 *
 * // Response:
 * {
 *   "orders": [
 *     {
 *       "saleNumber": 12345,
 *       "saleDate": "2024-01-01",
 *       "saleTime": "12:34:56",
 *       "totalPrice": 29.99,
 *       "employeeID": 1001,
 *       "source": "Kiosk",
 *       "items": [
 *         {
 *           "orderNumber": 1,
 *           "plateSize": "Large",
 *           "components": [
 *             { "componentName": "Chicken", "quantity": 2 },
 *             { "componentName": "Rice", "quantity": 1 }
 *           ],
 *           "status": "In Progress"
 *         }
 *       ]
 *     }
 *   ]
 * }
 *
 * // Error Response:
 * {
 *   "error": "Error fetching orders"
 * }
 */
export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const salesQuery = `
                SELECT 
                    sr.saleNumber,
                    sr.saleDate,
                    sr.saleTime,
                    sr.totalPrice,
                    sr.employeeID,
                    sr.source,
                    si.plateSize,
                    si.components,
                    si.status,
                    si.orderNumber
                FROM salesRecord sr
                LEFT JOIN saleItems si ON sr.saleNumber = si.saleNumber
                WHERE sr.source = 'Kiosk'
                ORDER BY sr.saleNumber, si.orderNumber;
            `;

            const result = await database.query(salesQuery);

            // Group items by saleNumber
            const orders = {};
            result.rows.forEach(row => {
                const saleNumber = row.salenumber;

                if (!orders[saleNumber]) {
                    orders[saleNumber] = {
                        saleNumber,
                        saleDate: row.saledate,
                        saleTime: row.saletime, // Corrected from 'row.saltime' to 'row.saletime'
                        totalPrice: row.totalprice,
                        employeeID: row.employeeid,
                        source: row.source,
                        items: [],
                    };
                }

                // Parse 'components' if it's a string
                let components = row.components;
                if (typeof components === 'string') {
                    try {
                        components = JSON.parse(components);
                    } catch (e) {
                        console.error('Error parsing components:', e);
                        components = [];
                    }
                }

                orders[saleNumber].items.push({
                    orderNumber: row.ordernumber,
                    plateSize: row.platesize,
                    components,
                    status: row.status
                });
            });

            res.status(200).json({ orders: Object.values(orders) });
        } catch (error) {
            console.error('Error fetching orders:', error);
            res.status(500).json({ error: 'Error fetching orders' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}