UPDATE inventory i 
SET curr_amount = curr_amount - $1
FROM menu m 
JOIN menu_inventory j on m.menu_item_id = j.menu_item_id 
WHERE j.inventory_id = i.inventory_id AND m.name = $2;
