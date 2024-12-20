-- top-selling-item.sql

/**
 * @author Uzair Khan
 *
 * Retrieves the top-selling menu item for the past month.
 *
 * @description
 * - Calculates the total revenue generated by each menu item based on sales data from the past month.
 * - Joins the `sales`, `sales_menu`, and `menu` tables to retrieve item names, total revenue, and image URLs.
 * - Groups results by item and orders by total revenue in descending order.
 * - Returns the name, total revenue, and image URL of the highest-earning item.
 *
 * @usage
 * - Provides insights into the most popular item for inventory and marketing analysis.
 * - Can be integrated into dashboards or reports for management review.
 */

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
