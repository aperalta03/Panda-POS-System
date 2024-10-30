import tempSalesData from '../../app/data/tempSalesData';

export default function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const hourlySales = {};

            tempSalesData.forEach((transaction) => {
                const hour = new Date(transaction.time).getHours();
                if (!hourlySales[hour]) {
                    hourlySales[hour] = 0;
                }
                hourlySales[hour] += transaction.total;
            });

            const hourlySalesArray = Object.entries(hourlySales).map(([hour, sales]) => ({ hour, sales }));
            res.status(200).json({ data: hourlySalesArray });
        } catch (error) {
            console.error('Error fetching X-Report data:', error);
            res.status(500).json({ error: 'Error fetching X-Report data' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}