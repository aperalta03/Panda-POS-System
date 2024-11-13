CREATE TABLE menu_ingredients (
    menu_item_id VARCHAR(255) NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    ingredients TEXT[] NOT NULL
);