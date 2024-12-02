import database from '../../utils/database';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { inventory_id, name, curr_amount, needed4week, needed4gameweek } = req.body;

    try {
      // Define item_type as 'ingredient' for ingredients
      const item_type = 'ingredient';

      const query = `
        INSERT INTO inventory (inventory_id, item_name, item_type, curr_amount, needed4week, needed4gameweek)
        VALUES ($1, $2, $3, $4, $5, $6);
      `;
      await database.query(query, [inventory_id, name, item_type, curr_amount, needed4week, needed4gameweek]);

      res.status(200).json({ message: 'Ingredient added successfully' });
    } catch (error) {
      if (error.code === '23505') { // Unique constraint violation error code
        console.error('Duplicate inventory_id:', error.detail);
        res.status(400).json({ error: 'ID in Use. Please use a unique inventory_id.' });
      } else {
        console.error('Error adding ingredient:', error);
        res.status(500).json({ error: 'Error adding ingredient' });
      }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}   