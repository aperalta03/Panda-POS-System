import database from '../../utils/database';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { name, price, ingredients } = req.body;

  if (!name || price === undefined || !ingredients || typeof ingredients !== 'string') {
    return res.status(400).json({ error: 'Name, price, and ingredients (as a comma-separated string) are required' });
  }

  try {
    // Start a transaction
    await database.query('BEGIN');

    // Update Menu Table, ID = 25
    const updateMenuQuery = `
      UPDATE menu
      SET name = $1, price = $2
      WHERE menu_item_id = 25
    `;
    await database.query(updateMenuQuery, [name, price]);

    // Update Inventory Table, ID = 79
    const updateInventoryQuery = `
      UPDATE inventory
      SET item_name = $1, ingredients = $2
      WHERE inventory_id = 79
    `;
    await database.query(updateInventoryQuery, [name, ingredients]);

    // Commit the transaction
    await database.query('COMMIT');
    res.status(200).json({ message: 'Seasonal item and ingredients updated successfully' });

  } catch (error) {
    // Rollback the transaction in case of an error
    await database.query('ROLLBACK');
    console.error('Error updating seasonal item:', error);
    res.status(500).json({ error: 'Failed to update seasonal item' });
  }
}