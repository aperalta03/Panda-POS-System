import database from '../../utils/database';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  
    const { startId, endId, date } = req.body;
  
    try {
      let query = `
        SELECT 
          s.sale_number, 
          s.date_of_sale, 
          s.time_of_sale, 
          ARRAY_AGG(mi.name) AS items
        FROM sales AS s
        LEFT JOIN sales_menu AS sm ON s.sale_number = sm.sale_number
        LEFT JOIN menu AS mi ON sm.menu_item_id = mi.menu_item_id
      `;
      const params = [];
  
      if (startId && endId) {
        query += ' WHERE s.sale_number BETWEEN $1 AND $2';
        params.push(startId, endId);
      } else if (date) {
        query += ' WHERE s.date_of_sale = $1';
        params.push(date);
      }
  
      query += ' GROUP BY s.sale_number ORDER BY s.sale_number ASC';
  
      const result = await database.query(query, params);
  
      res.status(200).json({ sales: result.rows });
    } catch (error) {
      console.error('Error searching sales:', error);
      res.status(500).json({ error: 'Error searching sales' });
    }
  }  