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
-- Insert into saleItems, one row per order, with orderNumber, status, and quantity
inserted_orders AS (
  INSERT INTO saleItems (saleNumber, plateSize, components, orderNumber, status)
  SELECT s.saleNumber,
         order_data->>'plateSize' AS plateSize,
         order_data->'components' AS components,
         (SELECT maxOrderNumber FROM max_order_number) + ROW_NUMBER() OVER () AS orderNumber,
         'Not Started' AS status
  FROM new_sale s, jsonb_array_elements($6::jsonb) AS order_data
  RETURNING components
),
-- Collect all items to be decremented, including ingredients from menu_ingredients
items_to_decrement AS (
  SELECT DISTINCT 
    unnest(array_agg(i.item_name)) AS item_name, 
    COALESCE(SUM(components_list.quantity), 0) AS total_quantity
  FROM (
    SELECT jsonb_array_elements_text(io.components) AS component,
           (io.components->>'quantity')::int AS quantity
    FROM inserted_orders AS io
  ) AS components_list
  LEFT JOIN menu_ingredients mi ON components_list.component = mi.item_name
  LEFT JOIN LATERAL unnest(COALESCE(mi.ingredients, ARRAY[components_list.component])) AS i(item_name) ON true
  GROUP BY i.item_name
)
-- Update inventory table for each item in items_to_decrement
UPDATE inventory
SET curr_amount = curr_amount - items_to_decrement.total_quantity
FROM items_to_decrement
WHERE inventory.item_name = items_to_decrement.item_name
  AND items_to_decrement.total_quantity IS NOT NULL;