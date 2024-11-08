-- utils/sql/get-seasonal-item.sql
SELECT name, price
FROM menu
WHERE menu_item_id = $1;
