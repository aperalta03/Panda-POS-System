SELECT si.itemname AS item_name, COUNT(si.itemname) AS quantity_sold, SUM(sr.totalprice) AS total_price
FROM saleItems si
JOIN salesRecord sr ON si.salenumber = sr.salenumber
GROUP BY si.itemname
ORDER BY quantity_sold DESC;