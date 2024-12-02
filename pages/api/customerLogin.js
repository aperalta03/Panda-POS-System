import fs from 'fs';
import path from 'path';
import database from '../../utils/database';

/**
 * API Route to Retrieve Customer Data by Phone Number
 *
 * @author Conner Black
 *
 * @description
 * This API endpoint retrieves customer information from the database based on the provided phone number.
 * It expects a `GET` request with a query parameter `phoneNumber`. If the customer is found, their data is returned 
 * along with a success message. If no customer is found, an error message is sent. In case of other errors (e.g., database issues),
 * a 500 status code is returned with the error message.
 *
 * @features
 * - Query Parameter Validation: Ensures the `phoneNumber` query parameter is provided and valid.
 * - Database Interaction: Reads the SQL query from a file and executes it to fetch the customer data based on the phone number.
 * - Error Handling: Catches errors during the database query execution and responds with appropriate error messages.
 * - Method Validation: Only allows `GET` requests. Returns a `405 Method Not Allowed` error for other HTTP methods.
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
 * @dependencies
 * - `fs`: For reading the SQL query file.
 * - `path`: For resolving the file path to the SQL query.
 * - `database`: Utility module for interacting with the database.
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
 *     "id": "1",
 *     "name": "John Doe",
 *     "phone_number": "123-456-7890",
 *     "email": "johndoe@example.com"
 *   }
 * }
 *
 * Response (Customer Not Found):
 * {
 *   "error": "Customer not found"
 * }
 */

export default async function handler(req, res) {
    if (req.method === 'GET') {
        // Use query parameters for GET requests
        const { phoneNumber } = req.query;

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
            res.status(200).json({ message: `${customer.name} has been signed in`, customer });
        } catch (error) {
            console.error('Error accessing database:', error);
            res.status(500).json({ error: `Error accessing database: ${error.message}` });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}