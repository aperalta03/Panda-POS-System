CREATE TABLE menu_inventory (
    menu_item_id int REFERENCES menu(menu_item_id),
    inventory_id int REFERENCES inventory(inventory_id)
);
