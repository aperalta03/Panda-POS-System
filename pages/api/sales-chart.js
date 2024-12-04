import fs from 'fs';
import path from 'path';
import database from '../../utils/database';

/**
 * 
 * @author Alonso Peralta Espinoza
 *
 * Retrieves sales chart data for a specific menu item within a given date range.
 *
 * @api {get} /api/sales-chart
 * @apiName SalesChart
 * @apiGroup Sales
 *
 * @apiParam {String} startDate Start date for the sales chart data (YYYY-MM-DD format).
 * @apiParam {String} endDate End date for the sales chart data (YYYY-MM-DD format).
 * @apiParam {String} item Name of the menu item to filter sales data by.
 *
 * @apiSuccess {Object} Response object containing sales chart data.
 * 
 * @apiError (400) {Object} Response object with an error message when required query parameters are missing.
 * @apiError (500) {Object} Response object with an error message for server issues.
 *
 * @apiExample {curl} Example usage:
 *   curl -X GET \
 *     'http://localhost:3000/api/sales-chart?startDate=2024-01-01&endDate=2024-01-31&item=Orange%20Chicken'
 *
 * @apiSuccessExample {json} Success response:
 *     {
 *       "data": [
 *         { "date": "2024-01-01", "sales": 100 },
 *         { "date": "2024-01-02", "sales": 120 }
 *       ]
 *     }
 *
 * @apiErrorExample {json} Error response for missing parameters:
 *     {
 *       "error": "Missing required query parameters"
 *     }
 *
 * @apiErrorExample {json} General server error response:
 *     {
 *       "error": "Error fetching sales chart data"
 *     }
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