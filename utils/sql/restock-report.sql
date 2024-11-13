-- restock_report.sql
SELECT 
    item_name AS "itemName",
    curr_amount AS "currentStock",
    needed4week - curr_amount AS "neededForWeek",
    needed4gameweek - curr_amount AS "neededForGameWeek"
FROM 
    inventory
WHERE 
    (needed4week - curr_amount) > 0 
    OR (needed4gameweek - curr_amount) > 0
ORDER BY 
    item_name;