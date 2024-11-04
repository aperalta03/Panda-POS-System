-- sales-chart.sql
SELECT 
    s.date_of_sale AS sale_date,
    SUM(s.price) AS total_sales
FROM 
    sales s
WHERE 
    s.date_of_sale BETWEEN $1 AND $2
GROUP BY 
    s.date_of_sale
ORDER BY 
    s.date_of_sale;