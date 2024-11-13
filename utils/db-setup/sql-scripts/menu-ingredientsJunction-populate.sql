INSERT INTO menu_ingredients (menu_item_id, item_name, ingredients)
SELECT menu_item_id, name, '{}'::TEXT[]
FROM menu;

UPDATE menu_ingredients mi
SET ingredients = string_to_array(i.ingredients, ',')
FROM inventory i
WHERE mi.item_name = i.item_name AND i.ingredients IS NOT NULL;