WITH max_sale_number AS (
  SELECT COALESCE(MAX(saleNumber), 0) AS maxSaleNumber
  FROM salesRecord
),
new_sale AS (
  INSERT INTO salesRecord (saleDate, saleTime, totalPrice, employeeID, source, saleNumber)
  VALUES (
    $1, 
    $2, 
    $3, 
    $4, 
    $5,
    (SELECT maxSaleNumber + 1 FROM max_sale_number)
  )
  RETURNING saleNumber
),
max_item_id AS (
  SELECT COALESCE(MAX(itemid), 0) AS maxItemId
  FROM saleItems
),
numbered_items AS (
  SELECT 
    (SELECT maxItemId FROM max_item_id) + ROW_NUMBER() OVER () AS newItemId,
    (SELECT saleNumber FROM new_sale) AS saleNumber,
    item->>'plateSize' AS plateSize,
    item->>'itemName' AS itemName
  FROM jsonb_array_elements($6::jsonb) AS item
)
INSERT INTO saleItems (itemid, saleNumber, plateSize, itemName)
SELECT newItemId, saleNumber, plateSize, itemName
FROM numbered_items;