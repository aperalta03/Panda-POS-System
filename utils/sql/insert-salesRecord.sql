--* UPDATE SALES RECORD *--

/**
 * 
 ** @author Alonso Peralta Espinoza
 *
 * Handles the process of recording a new sale, updating sale items, and decrementing inventory based on items sold.
 *
 * @description
 * - This query processes a sale transaction, including:
 *   1. Determining the next available `saleNumber`.
 *   2. Inserting a new sale record into the `salesRecord` table.
 *   3. Calculating and assigning `orderNumber` for each item in the sale.
 *   4. Adding sale items to the `saleItems` table.
 *   5. Decrementing inventory quantities based on items sold and their ingredients.
 *
 * @tables
 * - `salesRecord`: Stores sale transaction details such as date, time, employee ID, source, and sale number.
 * - `saleItems`: Tracks individual items included in a sale, including plate sizes and components.
 * - `inventory`: Updates the current stock (`curr_amount`) of items based on the total quantity sold.
 * - `menu_ingredients`: Used to include ingredients in the inventory adjustment.
 *
 * @parameters
 * - `$1`: `saleDate` - The date of the sale.
 * - `$2`: `saleTime` - The time of the sale.
 * - `$3`: `totalPrice` - The total price of the sale.
 * - `$4`: `employeeID` - The ID of the employee who processed the sale.
 * - `$5`: `source` - The source of the sale (e.g., in-store, online).
 * - `$6`: A JSON array of orders, where each order includes plate size and components.
 *
 * @usage
 * - This query is designed to be used in point-of-sale systems for processing customer transactions.
 *
 * @steps
 * 1. **Get the Next Sale Number**: Uses a CTE (`max_sale_number`) to determine the next `saleNumber`.
 * 2. **Insert Sale Record**: Adds a new entry to the `salesRecord` table with the calculated `saleNumber`.
 * 3. **Determine Order Numbers**: Uses `ROW_NUMBER()` to calculate `orderNumber` for each sale item.
 * 4. **Insert Sale Items**: Adds details for each item (plate size and components) to the `saleItems` table.
 * 5. **Calculate Inventory Decrement**: Aggregates quantities of items and their ingredients to determine the total reduction in stock.
 * 6. **Update Inventory**: Adjusts `curr_amount` in the `inventory` table based on the calculated reductions.
 *
 * @dependencies
 * - Requires pre-defined relationships between `menu_ingredients` and `inventory` to map items and their ingredients.
 *
 * @notes
 * - This query ensures data integrity by using CTEs and explicit joins for inventory updates.
 * - The `jsonb_array_elements` function processes JSON arrays for sale components.
 */

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