-- utils/sql/get-item-price.sql
SELECT name, price
FROM menu
WHERE menu_item_id BETWEEN 5 AND 27;

