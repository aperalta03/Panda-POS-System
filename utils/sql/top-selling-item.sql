-- top-selling-item.sql
SELECT 
    m.name AS item_name,
    SUM(s.price) AS total_revenue,
    m.image_path AS image_url
FROM 
    sales s
JOIN 
    sales_menu sm ON s.sale_number = sm.sale_number
JOIN 
    menu m ON sm.menu_item_id = m.menu_item_id
WHERE 
    s.date_of_sale BETWEEN CURRENT_DATE - INTERVAL '1 month' AND CURRENT_DATE
GROUP BY 
    m.name, m.image_path
ORDER BY 
    total_revenue DESC
LIMIT 1;
