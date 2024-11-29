import fs from 'fs';
import path from 'path';
import database from '../../utils/database';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        // Use query parameters for GET requests
        const { phoneNumber } = req.query;

        if (!phoneNumber) {
            return res.status(400).json({ error: 'Invalid Phone Number' });
        }

        try {
            const filePath = path.join(process.cwd(), 'utils', 'sql', 'customer-login.sql');
            const queryText = fs.readFileSync(filePath, 'utf-8');
            
            const result = await database.query(queryText, [phoneNumber]);

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Customer not found' });
            }

            // Assuming result.rows[0] contains the customer data
            const customer = result.rows[0];
            res.status(200).json({ message: `${customer.name} has been signed in`, customer });
        } catch (error) {
            console.error('Error accessing database:', error);
            res.status(500).json({ error: `Error accessing database: ${error.message}` });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}