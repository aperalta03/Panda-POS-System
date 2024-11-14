-- Get the next available saleNumber
WITH max_sale_number AS (
  SELECT COALESCE(MAX(saleNumber), 0) AS maxSaleNumber
  FROM salesRecord
),
-- Insert the new sale into salesRecord
new_sale AS (
  INSERT INTO salesRecord (saleDate, saleTime, totalPrice, employeeID, source, saleNumber)
  VALUES ($1, $2, $3, $4, $5, (SELECT maxSaleNumber + 1 FROM max_sale_number))
  RETURNING saleNumber
),
-- Get the current max orderNumber
max_order_number AS (
  SELECT COALESCE(MAX(orderNumber), 0) AS maxOrderNumber
  FROM saleItems
),
-- Insert into saleItems, one row per order
inserted_orders AS (
  INSERT INTO saleItems (saleNumber, plateSize, components, orderNumber, status)
  SELECT s.saleNumber,
         order_data->>'plateSize' AS plateSize,
         order_data->'components' AS components,
         (SELECT maxOrderNumber FROM max_order_number) + ROW_NUMBER() OVER () AS orderNumber,
         'Not Started' AS status
  FROM new_sale s, jsonb_array_elements($6::jsonb) AS order_data
  RETURNING plateSize, components
),
-- Collect all items to be decremented, including both the items and their ingredients
items_to_decrement AS (
  SELECT 
    item_name,
    SUM(quantity) AS total_quantity
  FROM (
    SELECT 
      unnest(
        ARRAY[cl.item_name] || COALESCE(mi.ingredients, '{}')
      ) AS item_name,
      cl.quantity
    FROM (
      -- Process components
      SELECT 
        component AS item_name,
        COUNT(*) AS quantity
      FROM inserted_orders io,
           jsonb_array_elements_text(io.components) AS component
      GROUP BY component
      UNION ALL
      -- Process plateSizes
      SELECT
        io.plateSize AS item_name,
        COUNT(*) AS quantity
      FROM inserted_orders io
      GROUP BY io.plateSize
    ) AS cl
    LEFT JOIN menu_ingredients mi ON cl.item_name = mi.item_name
  ) AS all_items
  GROUP BY item_name
)
-- Update inventory
UPDATE inventory
SET curr_amount = curr_amount - items_to_decrement.total_quantity
FROM items_to_decrement
WHERE inventory.item_name = items_to_decrement.item_name
  AND items_to_decrement.total_quantity IS NOT NULL;