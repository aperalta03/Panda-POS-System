import database from '../../utils/database';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { menu_item_id, name, price, calories, description, designation, type, ingredients } = req.body;

    try {
      // Insert into `menu` table
      const menuInsertQuery = `
        INSERT INTO menu (menu_item_id, name, price, calories, description, designation, type)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING menu_item_id;
      `;
      await database.query(menuInsertQuery, [
        menu_item_id,
        name,
        price,
        calories,
        description,
        designation,
        type,
      ]);

      // Insert into `menu_ingredients` table
      const ingredientInsertQuery = `
        INSERT INTO menu_ingredients (menu_item_id, item_name, ingredients)
        VALUES ($1, $2, $3);
      `;
      await database.query(ingredientInsertQuery, [
        menu_item_id,
        name,
        `{${ingredients.split(',').join(',')}}`,
      ]);

      res.status(200).json({ message: 'Menu item added successfully' });
    } catch (error) {
      if (error.code === '23505') {
        console.error('Duplicate menu_item_id:', error.detail);
        res.status(400).json({ error: 'ID in Use. Please use a unique menu_item_id.' });
      } else {
        console.error('Error adding menu item:', error);
        res.status(500).json({ error: 'Error adding menu item' });
      }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}