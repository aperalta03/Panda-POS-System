import database from '../../utils/database';

/**
 * Updates or inserts an inventory item in the database.
 */
export default async function handler(req, res) {
    console.log('Received payload:', req.body);

    if (req.method === 'POST') {
        const {
            inventory_id,
            item_name,
            item_type,
            ingredients,
            curr_amount,
            needed4week,
            needed4gameweek, // Ensure these are lowercase
        } = req.body;

        try {
            // Validate inputs
            if (
                !inventory_id ||
                !item_name ||
                !item_type ||
                isNaN(curr_amount) ||
                isNaN(needed4week) || // Validate lowercase
                isNaN(needed4gameweek) // Validate lowercase
            ) {
                return res.status(400).json({ error: "Invalid input data" });
            }

            // SQL query to insert or update an inventory item
            const updateInventoryQuery = `
                INSERT INTO inventory (inventory_id, item_name, item_type, ingredients, curr_amount, needed4week, needed4gameweek)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT (inventory_id)
                DO UPDATE SET
                    item_name = EXCLUDED.item_name,
                    item_type = EXCLUDED.item_type,
                    ingredients = EXCLUDED.ingredients,
                    curr_amount = EXCLUDED.curr_amount,
                    needed4week = EXCLUDED.needed4week,
                    needed4gameweek = EXCLUDED.needed4gameweek;
            `;

            // Execute the query
            await database.query(updateInventoryQuery, [
                inventory_id,
                item_name,
                item_type,
                ingredients || null,
                curr_amount,
                needed4week, // Pass lowercase
                needed4gameweek, // Pass lowercase
            ]);

            res.status(200).json({ message: 'Inventory item updated successfully' });
        } catch (error) {
            console.error('Error updating inventory item:', error.stack); // Logs full stack trace
            res.status(500).json({ error: 'Failed to update inventory item', details: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}