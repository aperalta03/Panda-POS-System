-- sales_report.sql
SELECT 
    m.name AS item_name,
    COUNT(sm.menu_item_id) AS total_sold,
    SUM(s.price) AS total_revenue
FROM 
    sales s
JOIN 
    sales_menu sm ON s.sale_number = sm.sale_number
JOIN 
    menu m ON sm.menu_item_id = m.menu_item_id
WHERE 
    s.date_of_sale BETWEEN $1 AND $2
GROUP BY 
    m.name
ORDER BY 
    total_sold DESC;