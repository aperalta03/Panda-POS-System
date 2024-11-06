// pages/api/sales-chart.js

import fs from 'fs';
import path from 'path';
import database from '../../utils/database';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { startDate, endDate, item } = req.query;

        if (!startDate || !endDate || !item) {
            return res.status(400).json({ error: 'Missing required query parameters' });
        }

        try {
            const queryText = `
                SELECT
                    s.date_of_sale,
                    s.time_of_sale,
                    i.item_name
                FROM
                    sales s
                    JOIN sales_menu sm ON s.sale_number = sm.sale_number
                    JOIN menu_inventory mi ON sm.menu_item_id = mi.menu_item_id
                    JOIN inventory i ON mi.inventory_id = i.inventory_id
                WHERE
                    i.item_name = $1 AND
                    s.date_of_sale BETWEEN $2 AND $3
                ORDER BY
                    s.date_of_sale ASC, s.time_of_sale ASC;
            `;

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

// SELECT
// s.date_of_sale,
//     s.time_of_sale,
//     i.item_name
// FROM
//                     sales s
//                     JOIN sales_menu sm ON s.sale_number = sm.sale_number
//                     JOIN menu_inventory mi ON sm.menu_item_id = mi.menu_item_id
//                     JOIN inventory i ON mi.inventory_id = i.inventory_id
// WHERE
// i.item_name = 'Chow Mein' AND
// s.date_of_sale BETWEEN $2 AND $3
//                 ORDER BY
// s.date_of_sale ASC, s.time_of_sale ASC;