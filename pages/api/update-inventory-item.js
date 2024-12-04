import fs from 'fs';
import path from 'path';
import database from '../../utils/database';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const {
            inventory_id,
            item_name,
            item_type,
            ingredients,
            curr_amount,
            needed4Week,
            needed4GameWeek,
        } = req.body;

        // Log the received data
        console.log('Received payload:', {
            inventory_id,
            item_name,
            item_type,
            ingredients,
            curr_amount,
            needed4Week,
            needed4GameWeek,
        });

        try {
            // Validate inputs
            if (
                !inventory_id ||
                !item_name ||
                !item_type ||
                isNaN(curr_amount) ||
                isNaN(needed4Week) ||
                isNaN(needed4GameWeek)
            ) {
                console.error('Validation failed:', req.body);
                return res.status(400).json({ error: "Invalid input data" });
            }

            // Read the SQL file
            const filePath = path.join(process.cwd(), 'utils', 'sql', 'update-inventory-item.sql');
            console.log('Reading SQL file from:', filePath);
            const upsertQuery = fs.readFileSync(filePath, 'utf-8');

            const params = [
                inventory_id,
                item_name,
                item_type,
                ingredients || null,
                curr_amount,
                needed4Week,
                needed4GameWeek,
            ];

            // Log the query and parameters
            console.log('Executing query:', upsertQuery);
            console.log('With parameters:', params);

            await database.query(upsertQuery, params);

            res.status(200).json({ message: 'Inventory item updated successfully' });
        } catch (error) {
            console.error('Error updating inventory item:', error.message);
            console.error('Stack trace:', error.stack);
            res.status(500).json({ error: 'Failed to update inventory item' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}