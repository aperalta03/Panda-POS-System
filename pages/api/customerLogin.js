import fs from 'fs';
import path from 'path';
import database from '../../utils/database';

/**
 * @description
 * This API endpoint retrieves customer information from the database based on the provided phone number.
 * It expects a `GET` request with a query parameter `phoneNumber`. If the customer is found, their data is returned 
 * along with a success message. If no customer is found, an error message is sent. In case of other errors (e.g., database issues),
 * a 500 status code is returned with the error message.
 * 
 * @author Conner Black
 *
 * @module api/customerLogin
 *
 * @requestQuery
 * - `phoneNumber`: The phone number of the customer, used to look up their data.
 *
 * @response
 * - `200 OK`: Returns a success message along with the customer data if the customer is found.
 * - `400 Bad Request`: Returns an error message if the `phoneNumber` query parameter is not provided.
 * - `404 Not Found`: Returns an error message if the customer is not found in the database.
 * - `500 Internal Server Error`: Returns an error message if there is an issue accessing the database.
 *
 * @example
 * GET /api/get-customer-by-phone
 * Query Parameters:
 * {
 *   "phoneNumber": "123-456-7890"
 * }
 *
 * Response (Customer Found):
 * {
 *   "message": "John Doe has been signed in",
 *   "customer": {
 *     "phone_number": "123-456-7890",
 *     "name": "John Doe",
 *     "points": 1234
 *   }
 * }
 *
 * Response (Customer Not Found):
 * {
 *   "error": "Customer not found"
 * }
 *
 * @module api/customerLogin
 */

export default async function handler(req, res) {
    if (req.method === 'POST') {
        // Access the phoneNumber from the request body
        const { phoneNumber } = req.body;

        if (!phoneNumber) {
            return res.status(400).json({ error: 'Invalid Phone Number' });
        }

        try {
            const filePath = path.join(process.cwd(), 'utils', 'sql', 'customer-login.sql');
            const queryText = fs.readFileSync(filePath, 'utf-8');
            
            const result = await database.query(queryText, [phoneNumber]);

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Customer not found' });
            }

            // Assuming result.rows[0] contains the customer data
            const customer = result.rows[0];
            console.log('Customer:', customer);
            res.status(200).json({
                message: `${customer.name} has been signed in`,
                customer: {
                    phoneNumber: customer.phone_number,
                    name: customer.name,
                    totalPoints: customer.points,  // Ensure totalPoints is correctly passed
                }
            });
        } catch (error) {
            console.error('Error accessing database:', error);
            res.status(500).json({ error: `Error accessing database: ${error.message}` });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}