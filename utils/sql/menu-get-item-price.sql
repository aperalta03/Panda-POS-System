-- utils/sql/get-item-price.sql
SELECT name, price
FROM menu
WHERE menu_item_id BETWEEN 1 AND 22;

