import fs from 'fs';
import path from 'path';
import database from '../../utils/database';

/**
 * API Route to Fetch Sales Report
 *
 * @author Conner Black
 *
 * @description
 * This API endpoint retrieves the sales report data between a given date range. It expects a `GET` request with the query parameters 
 * `startDate` and `endDate` to filter the sales data within the provided range. The sales report data is fetched from the database 
 * using an SQL query stored in an external file.
 *
 * @features
 * - Date Range Filtering: Accepts `startDate` and `endDate` as query parameters to filter the sales data.
 * - Database Interaction: Reads an SQL query from an external file to retrieve sales data from the database.
 * - Error Handling: Catches errors related to database issues and returns an appropriate error message if the query fails.
 * - Method Validation: Only allows `GET` requests. Returns a `405 Method Not Allowed` error for other HTTP methods.
 *
 * @requestQuery
 * - `startDate`: The start date for the sales data filter (required).
 * - `endDate`: The end date for the sales data filter (required).
 *
 * @response
 * - `200 OK`: Returns the sales report data for the specified date range.
 * - `400 Bad Request`: Returns an error message if the `startDate` or `endDate` query parameters are missing or invalid.
 * - `500 Internal Server Error`: Returns an error message if a database error occurs while fetching the sales data.
 * - `405 Method Not Allowed`: Returns this error if the request method is not `GET`.
 *
 * @dependencies
 * - `fs`: For reading the SQL query file that retrieves the sales data.
 * - `path`: For resolving the file path to the SQL query.
 * - `database`: Utility module for interacting with the database.
 *
 * @example
 * GET /api/sales-report?startDate=2024-01-01&endDate=2024-12-31
 *
 * Response (Sales Report Data):
 * {
 *   "data": [
 *     { "sale_id": 1, "amount": 500, "date": "2024-01-01", ... },
 *     { "sale_id": 2, "amount": 300, "date": "2024-01-02", ... },
 *     ...
 *   ]
 * }
 *
 * Response (Invalid Query Parameters):
 * {
 *   "error": "Error fetching sales report data"
 * }
 */

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { startDate, endDate } = req.query;

    try {
      const filePath = path.join(process.cwd(), 'utils', 'sql', 'sales-report.sql');
      const queryText = fs.readFileSync(filePath, 'utf-8');

      const result = await database.query(queryText, [startDate, endDate]);
      res.status(200).json({ data: result.rows });
    } catch (error) {
      console.error('Error fetching sales report data:', error);
      res.status(500).json({ error: 'Error fetching sales report data' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}