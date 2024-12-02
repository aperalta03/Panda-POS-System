import database from '../../utils/database';
import fs from 'fs';
import path from 'path';

/**
 * 
 ** @author Alonso Peralta Espinoza
 *
 * Inserts a new sales record into the database along with associated order details.
 *
 * @api {post} /api/updateSalesRecord
 * @apiName UpdateSalesRecord
 * @apiGroup Sales
 *
 * @apiParam {String} saleDate Date of the sale (YYYY-MM-DD format).
 * @apiParam {String} saleTime Time of the sale (HH:mm:ss format).
 * @apiParam {Number} totalPrice Total price of the sale.
 * @apiParam {Number} employeeID ID of the employee processing the sale.
 * @apiParam {String} source Source of the sale (e.g., "in-store", "online").
 * @apiParam {Array} orders Array of objects representing the sale details, each containing:
 * - {String} plateSize: Size of the plate (e.g., "Small", "Medium", "Large").
 * - {Array} components: List of components in the plate.
 *
 * @apiSuccess {Object} Response object with a success message.
 * 
 * @apiError (400) {Object} Response object with an error message for missing fields.
 * @apiError (500) {Object} Response object with an error message for server issues.
 *
 * @apiExample {curl} Example usage:
 *   curl -X POST \
 *     http://localhost:3000/api/insertSalesRecord \
 *     -H 'Content-Type: application/json' \
 *     -d '{
 *           "saleDate": "2024-12-01",
 *           "saleTime": "14:30:00",
 *           "totalPrice": 45.99,
 *           "employeeID": 123,
 *           "source": "in-store",
 *           "orders": [
 *             { "plateSize": "Large", "components": ["Orange Chicken", "Rice"] },
 *             { "plateSize": "Small", "components": ["Beef Broccoli"] }
 *           ]
 *         }'
 *
 * @apiSuccessExample {json} Success response:
 *     {
 *       "message": "Sale recorded successfully"
 *     }
 *
 * @apiErrorExample {json} Error response for missing fields:
 *     {
 *       "error": "Missing required fields: saleDate, saleTime, or employeeID"
 *     }
 *
 * @apiErrorExample {json} General server error response:
 *     {
 *       "message": "Error writing sales record",
 *       "error": "Database connection failed"
 *     }
 */

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { saleDate, saleTime, totalPrice, employeeID, source, orders } = req.body;

    if (!saleDate || !saleTime || !employeeID) {
      console.error('Missing saleDate, saleTime, or employeeID in request body');
      return res.status(400).json({ error: 'Missing required fields: saleDate, saleTime, or employeeID' });
    }

    try {
      const filePath = path.join(process.cwd(), 'utils', 'sql', 'insert-salesRecord.sql');
      const insertScript = fs.readFileSync(filePath, 'utf8');

      const itemsData = orders.map(({ plateSize, components }) => ({
        plateSize,
        components,
      }));
      
      const response = await database.query(insertScript, [
        saleDate,
        saleTime,
        totalPrice,
        employeeID,
        source,
        JSON.stringify(itemsData),
      ]);

      res.status(200).json({ message: 'Sale recorded successfully' });
    } catch (error) {
      console.error('Error writing sales record:', error);
      res.status(500).json({ message: 'Error writing sales record', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}