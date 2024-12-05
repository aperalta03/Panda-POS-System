import fs from 'fs';
import path from 'path';
import database from '../../utils/database';

/**
 * @description
 * This API endpoint adds a new customer to the database using the provided `phoneNumber`, `name`, and `date_of_birth`.
 * It expects a `POST` request with the required customer details in the request body. If the request is successful, 
 * the customer is added to the database, and the details are returned in the response. If any required data is missing, 
 * or if there is a problem with the database query, an appropriate error message is returned.
 * 
 * @author Conner Black
 *
 * @module api/customerSignUp
 *
 * @requestBody
 * - `phoneNumber`: The phone number of the new customer (required).
 * - `name`: The name of the new customer (required).
 * - `date_of_birth`: The customer's date of birth (optional).
 *
 * @response
 * - `200 OK`: Returns a success message and the details of the newly added customer.
 * - `400 Bad Request`: Returns an error message if `phoneNumber` or `name` is missing, or if there is an issue with the data.
 * - `405 Method Not Allowed`: Returns this error if the request method is not `POST`.
 *
 * @example
 * POST /api/add-customer
 * Request Body:
 * {
 *   "phoneNumber": "123-456-7890",
 *   "name": "Jane Doe",
 *   "date_of_birth": "1990-01-01"
 * }
 *
 * Response (Customer Added):
 * {
 *   "message": "Customer Added",
 *   "customer": {
 *     "id": "1",
 *     "phone_number": "123-456-7890",
 *     "name": "Jane Doe",
 *     "date_of_birth": "1990-01-01"
 *   }
 * }
 *
 * Response (Missing Data):
 * {
 *   "error": "Phone number and name are required"
 * }
 */
export default async function handler(req, res) {
    if (req.method === 'POST') {
        const {
            phoneNumber,
            name,
            date_of_birth,
        } = req.body;

        if (!phoneNumber || !name) {
            return res.status(400).json({ error: 'Phone number and name are required' });
        }

        try{
            const filePath = path.join(process.cwd(), 'utils', 'sql', 'add-customer.sql');
            const queryText = fs.readFileSync(filePath, 'utf-8');

            const values = [
                phoneNumber,
                name,
                date_of_birth || null
            ];
            const result = await database.query(queryText, values);
            res.status(200).json({message: "Customer Added", customer: result.rows[0]});
        }
        catch (error) {
            console.error('Error adding new customer:', error);

            res.status(400).json({ error: 'Bad input. Please check your data and try again.' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}