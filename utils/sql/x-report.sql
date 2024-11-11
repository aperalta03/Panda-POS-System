SELECT EXTRACT(HOUR FROM saleTime) AS hour, SUM(totalPrice) AS sales
FROM salesRecord
WHERE saleDate = CURRENT_DATE
GROUP BY hour
ORDER BY hour;