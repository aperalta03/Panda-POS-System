import React, { createContext, useState, useContext, useEffect } from 'react';

const GlobalStateContext = createContext();

//setting global vars
export const GlobalStateProvider = ({ children }) => {  
  const [numTrackedSides, setNumTrackedSides] = useState(0); //tracks sides in one item order
  const [numTrackedEntrees, setNumTrackedEntrees] = useState(0); //tracks entrees in one item order

  //resetting side associated counts
  const resetTrackedSides = () => {
    setNumTrackedSides(0);
    const updatedMenu = menu.map(item => {
      if (item.type === 'side') {
          return { ...item, count: 0 };
      }
      return item;
    });
    setMenu([...updatedMenu]);
  };

  //resetting entree associated counts
  const resetTrackedEntrees = () => {
      setNumTrackedEntrees(0); 
      const updatedMenu = menu.map(item => {
        if (item.type === 'entree') {
            return { ...item, count: 0 };
        }
        return item;
      });
      setMenu([...updatedMenu]);
  };

  const [totalItemCount, setTotalItemCount] = useState(0); //tracks total items in an entire order
  const [priceMap, setPriceMap] = useState({}); //stores item prices
  const [menu, setMenu] = useState([]); //stores menu item data

  //updating total item count (NOT USED CAN BE CHANGED)
  const updateTotalItemCount = () => {
    setTotalItemCount(numTrackedSides + numTrackedEntrees);
  };

  //fetching menu items
  const fetchMenuItems = async () => {
    try {
      const response = await fetch('/api/menu-get-item-price');
      const data = await response.json();
      
      if (response.ok && data.menuItems) {
        console.log("Fetched menu items:", data.menuItems);

        //constructs data to tack onto a menu item, includes: CALORIE, DESCRIPTION, COUNT (in one item order), DESGINATION, IMAGE 
        const itemSpecifications = {
          0: { calories: 510, description: "Our signature dish. Crispy chicken wok-tossed in a sweet and spicy orange sauce.", designation: "Spicy", image: 'Chicken_OrangeChicken.png' },
          1: { calories: 430, description: "Large tempura-battered shrimp, wok-tossed in a honey sauce and topped with glazed walnuts.", designation: "Premium", image: 'Seafood_HoneyWalnutShrimp.png' },
          2: { calories: 275, description: "Grilled chicken hand-sliced to order and served with teriyaki sauce.", designation: "None", image: 'Chicken_GrilledTeriyakiChicken.png' },
          3: { calories: 150, description: "A classic favorite. Tender beef and fresh broccoli in a ginger soy sauce.", designation: "None", image: 'Beef_BroccoliBeef.png' },
          4: { calories: 320, description: "A Sichuan-inspired dish with chicken, peanuts and vegetables, finished with chili peppers.", designation: "Spicy", image: 'Chicken_KungPaoChicken.png' },
          5: { calories: 180, description:  "Sirloin steak wok-seared with baby broccoli, onions, red bell peppers, and mushrooms in a savory black pepper sauce.", designation: "Premium", image: 'Beef_ShanghaiAngusSteak.png' },
          6: { calories: 340, description: "Crispy strips of white-meat chicken with veggies in a mildly sweet sauce with organic honey.", designation: "None", image: 'ChickenBreast_HoneySesameChickenBreast.png' },
          7: { calories: 480, description: "Crispy beef, bell peppers anf onions in a sweet-tangy sauce.", designation: "Spicy", image: 'Beef_BeijingBeef.png' },
          8: { calories: 220, description: "A delicate combination of chicken, mushrooms and zucchini wok-tossed with a light ginger soy sauce.", designation: "None", image: 'Chicken_MushroomChicken.png' },
          9: { calories: 400, description: "Crispy boneless chicken bites and veggies wok-tossed in an extry spicy sauce.", designation: "Spicy", image: 'Chicken_SweetFire.png' },
          10: { calories: 210, description: "Chicken breast, string beans and onions wok-tossed in a mild ginger soy sauce.", designation: "None", image: 'ChickenBreast_StringBeanChickenBreast.png' },
          11: { calories: 280, description: "Marinated chicken, celery and onions in a bold black pepper sauce.", designation: "None", image: 'Chicken_BlackPepperChicken.png' },
          
          12: { calories: 130, description: "A healthful medley of broccoli, kale, and cabbage.", designation: "Veggie" , image: 'Vegetables_SuperGreens.png'},
          13: { calories: 600, description:  "Stir-fried wheat noodles with onions, celery, and cabbage.", designation: "Veggie", image: 'Sides_ChowMein.png' },
          14: { calories: 620, description: "Prepared steamed white rice with soy sauce, eggs, peas, carrots, and green onions.", designation: "Veggie", image : 'Sides_FriedRice.png' },
          15: { calories: 520, description: "Prepared steamed white rice.", designation: "Veggie", image: 'Sides_WhiteSteamedRice.png' },

          //NEEDS IMAGES
          16: { calories: 360, description: "A fresh Beverage of any choice (calories may vary).", designation: "None" },
          17: { calories: 0, description: "A bottle of water given any choice.", designation: "None" },
          18: { calories: 200, description:  "Cabbage, carrots, green onions and chicken in a crispy wonton wrapper.", designation: "None" },
          19: { calories: 240, description: "Cabbage, carrots, green onions and Chinese noodles in a crispy wonton wrapper.", designation: "Veggie" },
          20: { calories: 190, description: "Wonton wrappers filled with cream cheese and served with sweet and sour sauce.", designation: "Veggie" },
          21: { calories: 150, description: "Jucy apples and fall spices in a crispy rolled pastry, finished with cinnamon sugar.", designation: "Veggie" },
        };

        const items = data.menuItems.map((item, index) => {
          item.count = 0; //setting initial count for each item
          
          //specifies item type
          if (index <= 11) {
            item.type = 'entree';
          } else if (index <= 15) {
            item.type = 'side';
          } else {
            item.type = 'other'; //meant for A La Carte
          }
  
          const specs = itemSpecifications[index];
          if (specs) {
            item.calories = specs.calories;
            item.description = specs.description;
            item.designation = specs.designation;
            item.image = specs.image;
          }
          return item;
        });

        setMenu(items); //set menu items

        //setting price map data
        const priceMapData = items.reduce((map, item) => {
          map[item.name] = item.price;
          return map;
        }, {});

        setPriceMap(priceMapData);
      }
      else {
        console.error('Error fetching menu items:', data.error || 'No menuItems found');
      }
    }
    catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  useEffect(() => { //function call
    fetchMenuItems();
  }, []);

  useEffect(() => { //used to track in console
    console.log("GlobalStateProvider - Menu state after fetch:", menu);
  }, [menu]);

  return ( //vars, funcs to be used globally
    <GlobalStateContext.Provider
      value={{ 
        numTrackedSides, 
        setNumTrackedSides, 
        numTrackedEntrees, 
        setNumTrackedEntrees, 
        totalItemCount, 
        setTotalItemCount,
        updateTotalItemCount,
        priceMap,
        menu,
        setPriceMap,
        setMenu,
        resetTrackedSides,
        resetTrackedEntrees, 
      }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

// Custom hook for easier access to the context
export const useGlobalState = () => useContext(GlobalStateContext);
