import random
from datetime import datetime, timedelta

###** MENU ITEMS **###
main_menu_items = {
    "Bowl": 8.30,           
    "Plate": 9.80,          
    "Bigger Plate": 11.30 
}
drink_price = 2.10
appetizer_price = 2.00

###** PARAMETERS **###
start_date = datetime.now() - timedelta(weeks=52)
end_date = datetime.now()
opening_time = 10
closing_time = 21
total_sales_target = 1_000_000
peak_day_sales_target = total_sales_target * 0.15 
remaining_sales_target = total_sales_target - (2 * peak_day_sales_target)
average_daily_sales = 200
peak_day_sales = 1000

file_path = "salesTable_populate.sql"

##### GENERATE SQL FILE #####
with open(file_path, "w") as f:
    sale_number = 1
    current_date = start_date
    ###** SQL COMMAND **### 
    f.write("INSERT INTO sales (sale_number, date_of_sale, employee_id, time_of_sale, price, franchise_id) VALUES\n")
    all_values = []

    while current_date <= end_date:
        is_peak_day = (current_date == (start_date + timedelta(weeks=4))) or (current_date == (start_date + timedelta(weeks=26)))
        num_sales = peak_day_sales if is_peak_day else random.randint(150, 250)
        for _ in range(num_sales):

            ###** TIME **###
            sale_hour = random.randint(opening_time, closing_time - 1)
            sale_minute = random.randint(0, 59)
            time_of_sale = f"{sale_hour:02d}:{sale_minute:02d}:00"
            
            ###** MAIN MENU ITEM **###
            main_item = random.choice(list(main_menu_items.keys()))
            price = main_menu_items[main_item]

            ###** ADD DRINK AND APPETIZERS RANDOMLY **###
            if random.random() < 0.8:
                price += drink_price
            if random.random() < 0.2:
                num_appetizers = random.randint(1, 2)
                price += num_appetizers * appetizer_price

            ###** EMPLOYEE ID **###
            employee_id = random.randint(1, 20)
            ###** FRANCHISE ID **###
            franchise_id = 1
            
            all_values.append(f"({sale_number}, '{current_date.strftime('%Y-%m-%d')}', {employee_id}, '{time_of_sale}', {price}, {franchise_id})")
            sale_number += 1
        
        current_date += timedelta(days=1)
    
    f.write(",\n".join(all_values) + ";\n")

#### STATUS #####
print("SQL file 'salesTable_populate.sql' has been generated successfully with a single INSERT statement for Panda Express sales.")