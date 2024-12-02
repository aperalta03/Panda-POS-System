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

        // Validate inputs
        if (
            !inventory_id ||
            !item_name ||
            !item_type ||
            isNaN(curr_amount) ||
            isNaN(needed4Week) ||
            isNaN(needed4GameWeek)
        ) {
            return res.status(400).json({ error: "Invalid input data" });
        }

        try {
            // Read the SQL query from an external file
            const filePath = path.join(process.cwd(), 'utils', 'sql', 'update-inventory-item.sql');
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

            await database.query(upsertQuery, params);
            res.status(200).json({ message: 'Inventory item updated successfully' });
        } catch (error) {
            console.error('Error updating inventory item:', error);
            res.status(500).json({ error: 'Failed to update inventory item' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}