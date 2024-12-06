import database from '../../utils/database';

/**
 * @description
 * Deletes a sale entry from the `sales` table using the provided `sale_number`.
 * 
 * @author Alonso Peralta Espinoza
 * @module api/deleteSale
 *
 * @requestBody
 * - `saleNumber`: The Sale Number of the sale to delete.
 *
 * @response
 * - `200 OK`: Returns a success message if the sale entry is deleted successfully.
 * - `400 Bad Request`: Returns an error message if the Sale Number is missing.
 * - `500 Internal Server Error`: Returns an error message if deletion fails.
 *
 * @example
 * // Request
 * fetch('/api/deleteSale', {
 *   method: 'DELETE',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ saleNumber: '123' }),
 * });
 *
 * // Success Response
 * { "message": "Sale entry deleted successfully" }
 *
 * // Error Response
 * { "error": "No sale found with the given Sale Number" }
 */

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { saleNumber } = req.body;

  try {
    const deleteSalesMenuQuery = `DELETE FROM sales_menu WHERE sale_number = $1;`;
    await database.query(deleteSalesMenuQuery, [saleNumber]);

    const deleteSalesQuery = `DELETE FROM sales WHERE sale_number = $1;`;
    await database.query(deleteSalesQuery, [saleNumber]);

    res.status(200).json({ message: 'Sale deleted successfully' });
  } catch (error) {
    console.error('Error deleting sale:', error);
    res.status(500).json({ error: 'Error deleting sale' });
  }
}