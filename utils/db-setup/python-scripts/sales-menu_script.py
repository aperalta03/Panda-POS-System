import random
import psycopg2
from dotenv import load_dotenv
import os

# Load environment variables from .env.local
load_dotenv('../../../.env.local')

def fetch_existing_sale_numbers():
    try:
        # Connect to PostgreSQL using environment variables
        conn = psycopg2.connect(
            host=os.getenv("PGHOST"),
            port=os.getenv("PGPORT"),
            database=os.getenv("PGDATABASE"),
            user=os.getenv("PGUSER"),
            password=os.getenv("PGPASSWORD")
        )
        cursor = conn.cursor()
        
        # Fetch existing sale numbers
        cursor.execute("SELECT sale_number FROM sales;")
        sale_numbers = {row[0] for row in cursor.fetchall()}
        
        cursor.close()
        conn.close()
        return sale_numbers

    except Exception as e:
        print("Error connecting to the database:", e)
        return set()

def generate_sales_menu_sql(sale_numbers, max_menu_items=27, min_items_per_sale=1, max_items_per_sale=3, output_file='populate_sales_menu.sql'):
    with open(output_file, 'w') as file:
        file.write("INSERT INTO sales_menu (sale_number, menu_item_id)\nVALUES\n")
        
        values = []
        
        for sale_number in sale_numbers:
            # Randomize the number of items for this sale
            num_items = random.randint(min_items_per_sale, max_items_per_sale)
            # Generate random menu_item_ids for this sale
            menu_items = random.sample(range(1, max_menu_items + 1), num_items)
            
            for menu_item_id in menu_items:
                values.append(f"({sale_number}, {menu_item_id})")
        
        # Join all values with commas and write to the file
        file.write(",\n".join(values) + ";\n")
    
    print(f"SQL script '{output_file}' generated successfully.")

# Fetch existing sale numbers from the database
existing_sale_numbers = fetch_existing_sale_numbers()

# Generate the SQL insert statements only for valid sale numbers
generate_sales_menu_sql(existing_sale_numbers)