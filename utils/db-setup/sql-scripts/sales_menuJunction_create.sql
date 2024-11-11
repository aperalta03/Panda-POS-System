CREATE TABLE sales_menu (
    sale_number int REFERENCES sales(sale_number),
    menu_item_id int REFERENCES menu(menu_item_id)
);