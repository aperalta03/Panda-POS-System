import React, { createContext, useState, useContext, useEffect } from 'react';

const GlobalStateContext = createContext();

//setting global vars
export const GlobalStateProvider = ({ children }) => {
  const [numTrackedSides, setNumTrackedSides] = useState(0);
  const [numTrackedEntrees, setNumTrackedEntrees] = useState(0);
  const [totalItemCount, setTotalItemCount] = useState(0);
  const [priceMap, setPriceMap] = useState({});
  const [menu, setMenu] = useState([]);

  const updateTotalItemCount = () => {
    setTotalItemCount(numTrackedSides + numTrackedEntrees);
  };

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('/api/menu-get-item-price');
      const data = await response.json();
      //console.log("Full API response:", data); // Log the entire response
      
      if (response.ok && data.menuItems) {
        console.log("Fetched menu items:", data.menuItems);

        const itemSpecifications = {
          0: { calories: 510, description: "Our signature dish. Crispy chicken wok-tossed in a sweet and spicy orange sauce.", designation: "Spicy" },
          1: { calories: 430, description: "Large tempura-battered shrimp, wok-tossed in a honey sauce and topped with glazed walnuts.", designation: "Premium" },
          2: { calories: 275, description: "Grilled chicken hand-sliced to order and served with teriyaki sauce.", designation: "None" },
          3: { calories: 150, description: "A classic favorite. Tender beef and fresh broccoli in a ginger soy sauce.", designation: "None" },
          4: { calories: 320, description: "A Sichuan-inspired dish with chicken, peanuts and vegetables, finished with chili peppers.", designation: "Spicy" },
          5: { calories: 180, description:  "Sirloin steak wok-seared with baby broccoli, onions, red bell peppers, and mushrooms in a savory black pepper sauce.", designation: "Premium" },
          6: { calories: 340, description: "Crispy strips of white-meat chicken with veggies in a mildly sweet sauce with organic honey.", designation: "None" },
          7: { calories: 480, description: "Crispy beef, bell peppers anf onions in a sweet-tangy sauce.", designation: "Spicy" },
          8: { calories: 220, description: "A delicate combination of chicken, mushrooms and zucchini wok-tossed with a light ginger soy sauce.", designation: "None" },
          9: { calories: 400, description: "Crispy boneless chicken bites and veggies wok-tossed in an extry spicy sauce.", designation: "Spicy" },
          10: { calories: 210, description: "Chicken breast, string beans and onions wok-tossed in a mild ginger soy sauce.", designation: "None" },
          11: { calories: 280, description: "Marinated chicken, celery and onions in a bold black pepper sauce.", designation: "None" },
          
          12: { calories: 130, description: "A healthful medley of broccoli, kale, and cabbage.", designation: "Veggie" },
          13: { calories: 600, description:  "Stir-fried wheat noodles with onions, celery, and cabbage.", designation: "Veggie" },
          14: { calories: 620, description: "Prepared steamed white rice with soy sauce, eggs, peas, carrots, and green onions.", designation: "Veggie" },
          15: { calories: 520, description: "Prepared steamed white rice.", designation: "Veggie" },

          16: { calories: 360, description: "A fresh Beverage of any choice (calories may vary).", designation: "None" },
          17: { calories: 0, description: "A bottle of water given any choice.", designation: "None" },
          18: { calories: 200, description:  "Cabbage, carrots, green onions and chicken in a crispy wonton wrapper.", designation: "None" },
          19: { calories: 240, description: "Cabbage, carrots, green onions and Chinese noodles in a crispy wonton wrapper.", designation: "Veggie" },
          20: { calories: 190, description: "Wonton wrappers filled with cream cheese and served with sweet and sour sauce.", designation: "Veggie" },
          21: { calories: 150, description: "Jucy apples and fall spices in a crispy rolled pastry, finished with cinnamon sugar.", designation: "Veggie" },
        };

        const items = data.menuItems.map((item, index) => {
          item.count = 0;
          
          if (index <= 11) {
            item.type = 'entree';
          } else if (index <= 15) {
            item.type = 'side';
          } else {
            item.type = 'other';
          }
  
          const specs = itemSpecifications[index];
          if (specs) {
            item.calories = specs.calories;
            item.description = specs.description;
            item.designation = specs.designation;
          }
  
          return item;
        });

        setMenu(items);

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

  useEffect(() => {
    fetchMenuItems();
  }, []);

  useEffect(() => {
    console.log("GlobalStateProvider - Menu state after fetch:", menu);
  }, [menu]);

  return (
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
      }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

// Custom hook for easier access to the context
export const useGlobalState = () => useContext(GlobalStateContext);
