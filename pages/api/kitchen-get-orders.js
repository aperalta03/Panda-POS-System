import database from '../../utils/database';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      //! Change to 'Kiosk' and 'Cashier'
      const salesQuery = `
        SELECT 
          sr.saleNumber,
          sr.saleDate,
          sr.saleTime,
          sr.totalPrice,
          sr.employeeID,
          sr.source,
          si.plateSize,
          si.components,
          si.status,
          si.orderNumber
        FROM salesRecord sr
        LEFT JOIN saleItems si ON sr.saleNumber = si.saleNumber
        WHERE sr.source = 'Cashier'
        ORDER BY sr.saleNumber, si.orderNumber;
      `;

      const result = await database.query(salesQuery);

      // Group items by saleNumber
      const orders = {};
      result.rows.forEach(row => {
        if (!orders[row.salenumber]) {
          orders[row.salenumber] = {
            saleNumber: row.salenumber,
            saleDate: row.saledate,
            saleTime: row.saltime,
            totalPrice: row.totalprice,
            employeeID: row.employeeid,
            source: row.source,
            items: [],
          };
        }
        
        orders[row.salenumber].items.push({
          orderNumber: row.ordernumber,
          plateSize: row.platesize,
          components: row.components,
          status: row.status
        });
      });

      res.status(200).json({ orders: Object.values(orders) });
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: 'Error fetching orders' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}