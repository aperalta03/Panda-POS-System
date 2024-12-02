import database from '../../utils/database';
import fs from 'fs';
import path from 'path';

/**
 * API Route to Update Customer Points in the Database
 *
 * @author Conner Black
 * 
 * @description
 * This API endpoint allows for the updating of a customer's points based on their phone number. It accepts a `POST` 
 * request with the necessary customer information (specifically `phoneNumber` and `points`). If the customer exists 
 * and the phone number is valid, their points will be updated in the database. If any required fields are missing 
 * or there is a database issue, an appropriate error message will be returned.
 *
 * @features
 * - Input Validation: Ensures that the `phoneNumber` field is provided in the request body.
 * - Database Interaction: Reads an SQL query from a file to update the customer's points in the database.
 * - Error Handling: Catches errors related to missing fields, database issues, or incorrect query execution, and returns 
 *   meaningful error responses.
 * - Method Validation: Only allows `POST` requests. Returns a `405 Method Not Allowed` error for other HTTP methods.
 *
 * @requestBody
 * - `phoneNumber`: The phone number of the customer whose points are to be updated (required).
 * - `points`: The number of points to be updated for the customer (optional, but must be provided if updating).
 *
 * @response
 * - `200 OK`: Returns a success message if the points were updated successfully.
 * - `400 Bad Request`: Returns an error message if any required fields are missing, such as the `phoneNumber`.
 * - `500 Internal Server Error`: Returns an error message if a database error occurs while updating the customer points.
 * - `405 Method Not Allowed`: Returns this error if the request method is not `POST`.
 *
 * @dependencies
 * - `fs`: For reading the SQL query file that updates the customer's points.
 * - `path`: For resolving the file path to the SQL query.
 * - `database`: Utility module for interacting with the database.
 *
 * @example
 * POST /api/update-customer-points
 * Request Body:
 * {
 *   "phoneNumber": "555-1234",
 *   "points": 200
 * }
 *
 * Response (Points Updated Successfully):
 * {
 *   "message": "Points updated successfully"
 * }
 *
 * Response (Missing Data):
 * {
 *   "error": "Missing required fields: phone number"
 * }
 *
 * Response (Database Error):
 * {
 *   "error": "Bad input. Please check your data and try again."
 * }
 */

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { phoneNumber, points } = req.body;
        
        if(!phoneNumber){
            return res.status(400).json({ error: 'Missing required fields: phone number' });
        }

        try{
            const filePath = path.join(process.cwd(), 'utils', 'sql', 'update-customer-points.sql');
            const insertScript = fs.readFileSync(filePath, 'utf8');

            const values = [points, phoneNumber];

            const result = await database.query(queryText, values);

            res.status(200).json({ message: 'Points updated sucessfully successfully', employee: result.rows[0] });
        }
        catch (error) {
            // Log the error (for debugging) but do not crash the app
            console.error('Error updating points:', error);

            // Send a generic error message to the user
            res.status(400).json({ error: 'Bad input. Please check your data and try again.' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}