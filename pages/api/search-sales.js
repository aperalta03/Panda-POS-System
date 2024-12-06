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
          sm.menu_item_id,
          mi.name AS item_name,
          ARRAY_AGG(DISTINCT mi.type) AS item_types -- Aggregates types like "bowl," "plate," etc.
        FROM sales AS s
        LEFT JOIN sales_menu AS sm ON s.sale_number = sm.sale_number
        LEFT JOIN menu AS mi ON sm.menu_item_id = mi.menu_item_id
      `;
      const params = [];
  
      // Adding conditions dynamically based on user input
      if (startId && endId) {
        query += ' WHERE s.sale_number BETWEEN $1 AND $2';
        params.push(startId, endId);
      } else if (date) {
        query += ' WHERE s.date_of_sale = $1';
        params.push(date);
      }
  
      query += ' GROUP BY s.sale_number, sm.menu_item_id, mi.name ORDER BY s.sale_number ASC';
  
      const result = await database.query(query, params);
  
      const sales = result.rows.reduce((acc, curr) => {
        const existingSale = acc.find((sale) => sale.sale_number === curr.sale_number);
  
        if (existingSale) {
          existingSale.items.push({ item_name: curr.item_name, item_type: curr.item_types });
        } else {
          acc.push({
            sale_number: curr.sale_number,
            date_of_sale: curr.date_of_sale,
            time_of_sale: curr.time_of_sale,
            items: [{ item_name: curr.item_name, item_type: curr.item_types }],
          });
        }
  
        return acc;
      }, []);
  
      res.status(200).json({ sales });
    } catch (error) {
      console.error('Error searching sales:', error);
      res.status(500).json({ error: 'Error searching sales' });
    }
  }  