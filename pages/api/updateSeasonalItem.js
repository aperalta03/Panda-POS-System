import fs from 'fs';
import path from 'path';
import database from '../../utils/database';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { name, price, calories, description = null, ingredients } = req.body;

  // Validate inputs
  if (!name || price === undefined || calories === undefined || !ingredients || typeof ingredients !== 'string') {
    return res.status(400).json({ error: 'Name, price, calories, and ingredients (as a comma-separated string) are required' });
  }

  try {
    // Convert ingredients to an array
    const ingredientsArray = ingredients.split(',').map((ingredient) => ingredient.trim());

    // Read and split the SQL file by sections
    const sqlFilePath = path.join(process.cwd(), 'utils', 'sql', 'update-seasonal-item.sql');
    const sqlFileContent = fs.readFileSync(sqlFilePath, 'utf-8');
    const [fetchMenuIdQuery, fetchInventoryIdQuery, updateMenuQuery, updateIngredientsQuery, updateInventoryQuery] = sqlFileContent.split('--');

    //
    await database.query('BEGIN');

    const seasonalMenuResult = await database.query(fetchMenuIdQuery);
    if (seasonalMenuResult.rows.length === 0) {
      throw new Error('No seasonal item found in the menu');
    }
    const seasonalMenuItemId = seasonalMenuResult.rows[0].menu_item_id;
    const menuInventoryResult = await database.query(fetchInventoryIdQuery, [seasonalMenuItemId]);
    if (menuInventoryResult.rows.length === 0) {
      throw new Error('No matching inventory item found for the seasonal menu item');
    }
    const inventoryId = menuInventoryResult.rows[0].inventory_id;

    await database.query(updateMenuQuery, [seasonalMenuItemId, name, price, calories, description]);
    await database.query(updateIngredientsQuery, [seasonalMenuItemId, name, ingredientsArray]);
    await database.query(updateInventoryQuery, [name, inventoryId]);

    await database.query('COMMIT');
    console.log("Transaction committed successfully.");
    res.status(200).json({ message: 'Seasonal item and ingredients updated successfully' });
    //
  } catch (error) {
    await database.query('ROLLBACK');
    console.error('Error updating seasonal item:', error);
    res.status(500).json({ error: 'Failed to update seasonal item' });
  }
}