-- utils/sql/sales-chart.sql

SELECT
    s.date_of_sale,
    s.time_of_sale,
    i.item_name
FROM
    sales s
    JOIN sales_menu sm ON s.sale_number = sm.sale_number
    JOIN menu_inventory mi ON sm.menu_item_id = mi.menu_item_id
    JOIN inventory i ON mi.inventory_id = i.inventory_id
WHERE
    i.item_name = $1 AND
    s.date_of_sale BETWEEN $2 AND $3
ORDER BY
    s.date_of_sale ASC, s.time_of_sale ASC;