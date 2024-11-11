import sqlite3
import random

# Connect to the SQLite database
connection = sqlite3.connect('inventory.db')
cursor = connection.cursor()
cursor.execute('DROP TABLE IF EXISTS inventory;')

# start IDs to generate inventory_id
menuItemID = 1
drinkID = 21
bottleID = 29
suppliesID = 34
ingredientID = 42

# type IDs for each item
menuType = 'food item'
drinkType = 'fountain drink'
bottleType = 'bottled drink'
suppliesType = 'supply item'
ingredientType = 'ingredient'


# menu item dict containing both menu items and mapping ingredients
# KEY REFERED AS ITEM_NAME
# VALUE REFERED AS INGREDIENT_LIST
menuItems = {
    'Chow Mein': ['Noodles', 'Stir-fry-veggies', 'oil', 'seasoning'],
    'Fried Rice': ['Rice', 'oil', 'seasoning', 'egg', 'rice-veggies'],
    'White Steamed Rice': ['Rice'],
    'Super Greens': ['assorted greens'],
    'Orange Chicken': ['Cut-Chicken', 'orange-sauce'],
    'Black Pepper Sirloin Steak': ['Sirloin Steak', 'black-pepper-sauce', 'black-pepper-veggies'],
    'Honey Walnut Shrimp': ['Shrimp', 'honey-walnut-veggies', 'honey-walnut-sauce'],
    'Grilled Teriyaki Chicken': ['Chicken Beast', 'teriyaki-sauce'],
    'Kung Pao Chicken': ['Cut-Chicken', 'kung-pao-sauce', 'kung-pao-veggies'],
    'Honey Sesame Chicken Breast': ['Chicken Beast', 'sesame-veggies', 'honey-sesame-sauce'],
    'Beijing Beef': ['Beef', 'beijing-veggies', 'beijing-sauce'],
    'Mushroom Chicken': ['Cut-Chicken', 'mushroom-veggies', 'mushroom-sauce'],
    'SweetFire Chicken Breast': ['Chicken Beast', 'sweetFire-veggies', 'sweetfire-sauce'],
    'String Bean Chicken Breast': ['Chicken Beast', 'string-bean-veggies', 'mushroom-sauce'],
    'Broccoli Beef': ['Beef', 'assorted greens', 'broccoli-sauce'],
    'Black Pepper Chicken': ['Cut-Chicken', 'black-pepper-veggies', 'black-pepper-sauce'],
    'Chicken Egg Roll': ['pastry-wrapper', 'oil', 'chicken-egg-filling'],
    'Veggie Spring Roll': ['pastry-wrapper', 'veggie-filling', 'oil'],
    'Cream Cheese Rangoon': ['pastry-wrapper', 'oil', 'cream-cheese-filling'],
    'Apple Pie Roll': ['pastry-wrapper', 'apple-pie-filling', 'oil']
}

# drink items array
drinkItems = [
    'Dr Pepper', 'Coca Cola', 'Diet Coke', 'Barq Root Beer',
    'Fanta Orange', 'Minute Maid Lemonade', 'Powerade Berry Blast', 'Sprite'
]

# bottled items array
bottledItems = [
    'Powerade Punch', 'Bottled Water',
    'Minute Maid Apple Juice', 'Coke Mexico', 'Bai Coco Fusion'
]

# supplies items array
supplies = [
    'Bowl-box', 'Plate-box', 'Bigger-Plate-box', 'A-La-Carte-carton',
    'Drink-Cups', 'utensil-packs', 'straws', 'bags'
]

# ingredient items array, items shared between menu items
ingredients = [
    'Noodles', 'Rice', 'Chicken Beast', 'Cut-Chicken', 'Beef', 'Sirloin Steak', 'Shrimp',
    'Stir-fry-veggies', 'rice-veggies', 'assorted greens', 'black-pepper-veggies', 'honey-walnut-veggies',
    'mushroom-veggies', 'sweetFire-veggies', 'string-bean-veggies', 'beijing-veggies', 'sesame-veggies',
    'kung-pao-veggies', 'pastry-wrapper', 'veggie-filling', 'chicken-egg-filling', 'cream-cheese-filling',
    'apple-pie-filling', 'orange-sauce', 'black-pepper-sauce', 'teriyaki-sauce', 'honey-walnut-sauce',
    'broccoli-sauce', 'beijing-sauce', 'honey-sesame-sauce', 'kung-pao-sauce', 'mushroom-sauce',
    'sweetfire-sauce', 'string-bean-sauce', 'oil', 'seasoning', 'egg'
]

# Initialize stock numbers for ingredients all to 0
ingredientNum = {ingredient: 0 for ingredient in ingredients}

# Insert statement array containing all insert statements to write to file
insertStatements = []

# Menu item inserts
for inventory_id, (item_name, ingredient_list) in enumerate(menuItems.items(), start=menuItemID):
    curr_amount = random.randint(0, 2000)  # Random initial amount of the menu item
    ingredients_str = ', '.join(ingredient_list)
    
    # Calculate required ingredient amt based on current stock of menu item (each item needs one unit per ingredient)
    for ingredient in ingredient_list:
        ingredientNum[ingredient] += curr_amount
    
    insertStatements.append(f"INSERT INTO inventory (inventory_id, item_name, item_type, ingredients, curr_amount, needed4Week, needed4GameWeek) "
                            f"VALUES ({inventory_id}, '{item_name}', '{menuType}', '{ingredients_str}', {curr_amount}, {random.randint(3000, 6000)}, {random.randint(4500, 9000)});")

# Drink items inserts
for inventory_id, item_name in enumerate(drinkItems, start=drinkID):
    curr_amount = random.randint(0, 4000)
    insertStatements.append(f"INSERT INTO inventory (inventory_id, item_name, item_type, ingredients, curr_amount, needed4Week, needed4GameWeek) "
                            f"VALUES ({inventory_id}, '{item_name}', '{drinkType}', NULL, {curr_amount}, {random.randint(3000, 6000)}, {random.randint(6000, 9000)});")

# Bottled items inserts
for inventory_id, item_name in enumerate(bottledItems, start=bottleID):
    curr_amount = random.randint(0, 500)
    insertStatements.append(f"INSERT INTO inventory (inventory_id, item_name, item_type, ingredients, curr_amount, needed4Week, needed4GameWeek) "
                            f"VALUES ({inventory_id}, '{item_name}', '{bottleType}', NULL, {curr_amount}, {random.randint(500, 1000)}, {random.randint(1000, 2000)});")

# Supplies items inserts
for inventory_id, item_name in enumerate(supplies, start=suppliesID):
    curr_amount = random.randint(0, 10000)
    insertStatements.append(f"INSERT INTO inventory (inventory_id, item_name, item_type, ingredients, curr_amount, needed4Week, needed4GameWeek) "
                            f"VALUES ({inventory_id}, '{item_name}', '{suppliesType}', NULL, {curr_amount}, {random.randint(8000, 10000)}, {random.randint(10000, 14000)});")

# Ingredients items inserts
for inventory_id, ingredient_name in enumerate(ingredients, start=ingredientID): 
    curr_amount = ingredientNum[ingredient_name]  # Set the current amount to calculation above
    insertStatements.append(f"INSERT INTO inventory (inventory_id, item_name, item_type, ingredients, curr_amount, needed4Week, needed4GameWeek) "
                            f"VALUES ({inventory_id}, '{ingredient_name}', '{ingredientType}', NULL, {curr_amount}, {random.randint(7000, 10000)}, {random.randint(12000, 15000)});")


# writing initialization of table then writing insert_statements
with open('inventory.sql', 'w') as f:
    f.write('''CREATE TABLE inventory (
        inventory_id INTEGER PRIMARY KEY,
        item_name TEXT NOT NULL,
        item_type TEXT NOT NULL,
        ingredients TEXT,
        curr_amount INTEGER NOT NULL,
        needed4Week INTEGER NOT NULL,
        needed4GameWeek INTEGER NOT NULL
    );\n\n''')
    
    for statement in insertStatements:
        f.write(statement + '\n')

# executing the written statements
with open('inventory.sql', 'r') as file:
    sqlCommands = file.read()
    cursor.executescript(sqlCommands)

# commiting chnages and closing the connection
connection.commit()
connection.close()
