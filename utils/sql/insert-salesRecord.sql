-- Get the next available saleNumber
WITH max_sale_number AS (
  SELECT COALESCE(MAX(saleNumber), 0) AS maxSaleNumber
  FROM salesRecord
),
-- Insert the new sale into salesRecord
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
-- Get the current max orderNumber
max_order_number AS (
  SELECT COALESCE(MAX(orderNumber), 0) AS maxOrderNumber
  FROM saleItems
),
-- Insert into saleItems, one row per order, with orderNumber and status
inserted_orders AS (
  INSERT INTO saleItems (saleNumber, plateSize, components, orderNumber, status)
  SELECT
    s.saleNumber,
    order_data->>'plateSize' AS plateSize,
    order_data->'components' AS components,
    (SELECT maxOrderNumber FROM max_order_number) + ROW_NUMBER() OVER () AS orderNumber,
    'Not Started' AS status 
  FROM
    new_sale s,
    jsonb_array_elements($6::jsonb) AS order_data
  RETURNING components
)
-- Update inventory table for each component in the components list
UPDATE inventory
SET curr_amount = curr_amount - 1
WHERE item_name IN (
  SELECT jsonb_array_elements_text(components) FROM inserted_orders
);