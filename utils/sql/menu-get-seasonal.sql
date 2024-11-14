SELECT name, price, calories
FROM menu
WHERE menu_item_id = $1;