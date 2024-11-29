import fs from 'fs';
import path from 'path';
import database from '../../utils/database';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const {
            phoneNumber,
            name,
            date_of_birth,
        } = req.body;

        if (!phoneNumber || !name) {
            return res.status(400).json({ error: 'Phone number and name are required' });
        }

        try{
            const filePath = path.join(process.cwd(), 'utils', 'sql', 'add-customer.sql');
            const queryText = fs.readFileSync(filePath, 'utf-8');

            const values = [
                phoneNumber,
                name,
                date_of_birth || null
            ];
            const result = await database.query(queryText, values);
            res.status(200).json({message: "Customer Added", customer: result.rows[0]});
        }
        catch (error) {
            console.error('Error adding new customer:', error);

            res.status(400).json({ error: 'Bad input. Please check your data and try again.' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}