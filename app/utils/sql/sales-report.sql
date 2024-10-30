-- sales_report.sql
SELECT item_name, SUM(quantity) AS total_sold, SUM(total_price) AS total_revenue
FROM sales
WHERE sale_date BETWEEN $1 AND $2
GROUP BY item_name
ORDER BY total_sold DESC;
