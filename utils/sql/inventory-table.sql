-- inventory-table.sql
SELECT 
    inventory_id AS id,
    item_name AS name,
    curr_amount AS stocked,
    needed4week AS required,
    (needed4week - curr_amount) AS to_order
FROM 
    inventory
ORDER BY
    inventory_id;
