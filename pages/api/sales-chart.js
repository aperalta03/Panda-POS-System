import fs from 'fs';
import path from 'path';
import database from '../../utils/database';

/**
 * @description
 * Retrieves sales chart data for a specific menu item within a given date range.
 * @author Alonso Peralta Espinoza
 * @module api/sales-chart
 * 
 * @param {string} startDate - Start date for the sales chart data (YYYY-MM-DD format).
 * @param {string} endDate - End date for the sales chart data (YYYY-MM-DD format).
 * @param {string} item - Name of the menu item to filter sales data by.
 * 
 * @returns {Object} Response object containing sales chart data.
 * 
 * @response
 * - `200 OK`: Returns the sales chart data.
 * - `400 Bad Request`: Returns an error message when required query parameters are missing.
 * - `500 Internal Server Error`: Returns an error message for server issues.
 * 
 * @example
 * // Request:
 * GET /api/sales-chart?startDate=2024-01-01&endDate=2024-01-31&item=Orange%20Chicken
 *
 * // Response:
 * {
 *   "data": [
 *     { "date": "2024-01-01", "sales": 100 },
 *     { "date": "2024-01-02", "sales": 120 }
 *   ]
 * }
 *
 * @errorExample {json} Error response for missing parameters:
 * {
 *   "error": "Missing required query parameters"
 * }
 *
 * @errorExample {json} General server error response:
 * {
 *   "error": "Error fetching sales chart data"
 * }
 */

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { startDate, endDate, item } = req.query;

        if (!startDate || !endDate || !item) {
            return res.status(400).json({ error: 'Missing required query parameters' });
        }

        try {
            const filePath = path.join(process.cwd(), 'utils', 'sql', 'sales-chart.sql');
            const queryText = fs.readFileSync(filePath, 'utf-8'); 

            const result = await database.query(queryText, [item, startDate, endDate]);
            res.status(200).json({ data: result.rows });
        } catch (error) {
            console.error('Error fetching sales chart data:', error);
            res.status(500).json({ error: 'Error fetching sales chart data' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}