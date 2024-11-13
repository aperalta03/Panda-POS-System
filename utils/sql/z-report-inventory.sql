WITH item_sales AS (
    SELECT 
        jsonb_array_elements_text(si.components) AS item_name,
        COUNT(*) AS quantity_sold,
        SUM(sr.totalprice / jsonb_array_length(si.components)) AS total_price
    FROM 
        saleItems si
    JOIN 
        salesRecord sr ON si.salenumber = sr.salenumber
    GROUP BY 
        item_name
)
SELECT 
    item_name,
    quantity_sold,
    ROUND(total_price, 2) AS total_price,
    (SELECT ROUND(SUM(total_price), 2) FROM item_sales) AS total_sales
FROM 
    item_sales
ORDER BY 
    quantity_sold DESC;