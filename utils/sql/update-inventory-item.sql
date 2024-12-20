INSERT INTO inventory (inventory_id, item_name, item_type, ingredients, curr_amount, needed4week, needed4GameWeek)
VALUES ($1, $2, $3, $4, $5, $6, $7)
ON CONFLICT (inventory_id)
DO UPDATE SET
    item_name = EXCLUDED.item_name,
    item_type = EXCLUDED.item_type,
    ingredients = EXCLUDED.ingredients,
    curr_amount = EXCLUDED.curr_amount,
    needed4week = EXCLUDED.needed4week,
    needed4gameweek = EXCLUDED.needed4gameweek;