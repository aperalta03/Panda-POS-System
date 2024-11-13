INSERT INTO menu_inventory (menu_item_id, inventory_id)
SELECT m.menu_item_id, i.inventory_id
FROM menu m
JOIN inventory i ON m.name = i.item_name;