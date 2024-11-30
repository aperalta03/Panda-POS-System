import database from '../../utils/database';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { phoneNumber, points } = req.body;
    
    if(!phoneNumber){
        return res.status(400).json({ error: 'Missing required fields: phone number' });
    }

    try{
        const filePath = path.join(process.cwd(), 'utils', 'sql', 'update-customer-points.sql');
        const insertScript = fs.readFileSync(filePath, 'utf8');

        const values = [points, phoneNumber];

        const result = await database.query(queryText, values);

        res.status(200).json({ message: 'Points updated sucessfully successfully', employee: result.rows[0] });
    }
    catch (error) {
        // Log the error (for debugging) but do not crash the app
        console.error('Error updating points:', error);

        // Send a generic error message to the user
        res.status(400).json({ error: 'Bad input. Please check your data and try again.' });
    }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}