-- inventory-table.sql
SELECT 
    mi.menu_item_id AS id,
    i.item_name AS name,
    i.curr_amount AS stocked,
    i.needed4week AS required,
    (i.needed4week - i.curr_amount) AS to_order
FROM 
    menu_inventory mi
JOIN 
    inventory i ON mi.inventory_id = i.inventory_id;