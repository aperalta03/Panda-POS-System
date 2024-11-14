-- Fetch seasonal menu item ID
SELECT menu_item_id FROM menu WHERE type = 'seasonal' LIMIT 1;

-- Fetch inventory ID associated with seasonal item
SELECT inventory_id FROM menu_inventory WHERE menu_item_id = $1 LIMIT 1;

-- Update menu table
UPDATE menu
SET name = $2, price = $3, calories = $4, description = COALESCE($5, description)
WHERE menu_item_id = $1;

-- Update menu_ingredients table
UPDATE menu_ingredients
SET item_name = $2, ingredients = $6
WHERE menu_item_id = $1;

-- Update inventory table
UPDATE inventory
SET item_name = $2
WHERE inventory_id = $7;