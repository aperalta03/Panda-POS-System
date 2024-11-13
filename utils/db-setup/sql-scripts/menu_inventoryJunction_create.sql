CREATE TABLE menu_inventory (
    menu_item_id INT REFERENCES menu(menu_item_id),
    inventory_id INT REFERENCES inventory(inventory_id),
    PRIMARY KEY (menu_item_id, inventory_id)
);