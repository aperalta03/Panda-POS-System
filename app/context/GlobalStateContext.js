import React, { createContext, useState, useContext, useEffect } from "react";
import { useTranslate } from "./translateContext";
import { textArray } from "./translateTextArray";

const GlobalStateContext = createContext();

//setting global vars
export const GlobalStateProvider = ({ children }) => {
  const [numTrackedSides, setNumTrackedSides] = useState(0); //tracks sides in one item order
  const [numTrackedEntrees, setNumTrackedEntrees] = useState(0); //tracks entrees in one item order
  const [numTrackedOthers, setNumTrackedOthers] = useState(0); //tracks other items in one item order
  const [isDone, setDone] = useState(false);
  const {
    currentLanguage,
    setCurrentLanguage,
    translations,
    translateAllText,
  } = useTranslate();

  const changeLanguage = (language) => {
    setCurrentLanguage(language);
    translateAllText(textArray, language);
  };

  //resetting side associated counts
  const resetTrackedSides = () => {
    setNumTrackedSides(0);
    setMenu((menu) =>
      menu.map((item) => (item.type === "side" ? { ...item, count: 0 } : item))
    );
  };

  //resetting entree associated counts
  const resetTrackedEntrees = () => {
    setNumTrackedEntrees(0);
    setMenu((menu) =>
      menu.map((item) =>
        item.type === "entree" ? { ...item, count: 0 } : item
      )
    );
  };

  //resetting other associated counts
  const resetTrackedOthers = () => {
    setNumTrackedOthers(0);
    setMenu((menu) =>
      menu.map((item) => (item.type === "other" ? { ...item, count: 0 } : item))
    );
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
      const response = await fetch("/api/menu-get-item-price");
      const data = await response.json();

      if (response.ok && data.menuItems) {
        console.log("Fetched menu items:", data.menuItems);

        //IS ALREADY CONSTRUCTED IN DB, HERE TO VIEW, DO NOT UNCOMMENT
        /*const itemSpecifications = {
          'Orange Chicken': { type: 'entree', calories: 510, description: "Our signature dish. Crispy chicken wok-tossed in a sweet and spicy orange sauce.", designation: "Spicy", image: 'Chicken_OrangeChicken.png' },
          'Honey Walnut Shrimp': { type: 'entree', calories: 430, description: "Large tempura-battered shrimp, wok-tossed in a honey sauce and topped with glazed walnuts.", designation: "Premium", image: 'Seafood_HoneyWalnutShrimp.png' },
          'Grilled Teriyaki Chicken': { type: 'entree', calories: 275, description: "Grilled chicken hand-sliced to order and served with teriyaki sauce.", designation: "None", image: 'Chicken_GrilledTeriyakiChicken.png' },
          'Broccoli Beef': { type: 'entree', calories: 150, description: "A classic favorite. Tender beef and fresh broccoli in a ginger soy sauce.", designation: "None", image: 'Beef_BroccoliBeef.png' },
          'Kung Pao Chicken': { type: 'entree', calories: 320, description: "A Sichuan-inspired dish with chicken, peanuts and vegetables, finished with chili peppers.", designation: "Spicy", image: 'Chicken_KungPaoChicken.png' },
          'Black Pepper Sirloin Steak': { type: 'entree', calories: 180, description:  "Sirloin steak wok-seared with baby broccoli, onions, red bell peppers, and mushrooms in a savory black pepper sauce.", designation: "Premium", image: 'Beef_ShanghaiAngusSteak.png' },
          'Honey Sesame Chicken': { type: 'entree', calories: 340, description: "Crispy strips of white-meat chicken with veggies in a mildly sweet sauce with organic honey.", designation: "None", image: 'ChickenBreast_HoneySesameChickenBreast.png' },
          'Beijing Beef': { type: 'entree', calories: 480, description: "Crispy beef, bell peppers anf onions in a sweet-tangy sauce.", designation: "Spicy", image: 'Beef_BeijingBeef.png' },
          'Mushroom Chicken': { type: 'entree', calories: 220, description: "A delicate combination of chicken, mushrooms and zucchini wok-tossed with a light ginger soy sauce.", designation: "None", image: 'Chicken_MushroomChicken.png' },
          'SweetFire Chicken': { type: 'entree', calories: 400, description: "Crispy boneless chicken bites and veggies wok-tossed in an extry spicy sauce.", designation: "Spicy", image: 'Chicken_SweetFire.png' },
          'String Bean Chicken': { type: 'entree', calories: 210, description: "Chicken breast, string beans and onions wok-tossed in a mild ginger soy sauce.", designation: "None", image: 'ChickenBreast_StringBeanChickenBreast.png' },
          'Black Pepper Chicken': { type: 'entree', calories: 280, description: "Marinated chicken, celery and onions in a bold black pepper sauce.", designation: "None", image: 'Chicken_BlackPepperChicken.png' },
          
          'Super Greens': { type: 'side', calories: 130, description: "A healthful medley of broccoli, kale, and cabbage.", designation: "Veggie" , image: 'Vegetables_SuperGreens.png'},
          'Chow Mein': {  type: 'side', calories: 600, description:  "Stir-fried wheat noodles with onions, celery, and cabbage.", designation: "Veggie", image: 'Sides_ChowMein.png' },
          'Fried Rice': {  type: 'side', calories: 620, description: "Prepared steamed white rice with soy sauce, eggs, peas, carrots, and green onions.", designation: "Veggie", image : 'Sides_FriedRice.png' },
          'White Steamed Rice': {  type: 'side', calories: 520, description: "Prepared steamed white rice.", designation: "Veggie", image: 'Sides_WhiteSteamedRice.png' },

          'Fountain Drink': {  type: 'other', calories: 360, description: "A fresh Beverage of any choice (calories may vary).", designation: "None", image: 'Fountain_Drink.png' },
          'Bottle Drink': { type: 'other', calories: 0, description: "A bottle of water given any choice.", designation: "None", image: 'Bottled_Drink.png' },
          'Chicken Egg Roll': { type: 'other', calories: 200, description:  "Cabbage, carrots, green onions and chicken in a crispy wonton wrapper.", designation: "None", image: 'Chicken_EggRoll.png' },
          'Veggie Spring Roll': { type: 'other', calories: 240, description: "Cabbage, carrots, green onions and Chinese noodles in a crispy wonton wrapper.", designation: "Veggie", image: 'Veggie_SpringRoll.png' },
          'Cream Cheese Rangoon': { type: 'other', calories: 190, description: "Wonton wrappers filled with cream cheese and served with sweet and sour sauce.", designation: "Veggie", image: 'Cream_CheeseRangoon.png' },
          'Apple Pie Roll': { type: 'other', calories: 150, description: "Jucy apples and fall spices in a crispy rolled pastry, finished with cinnamon sugar.", designation: "Veggie", image: 'Apple_PieRoll.png' },
        };*/

        const items = data.menuItems.map((item) => {
          item.count = 0; //setting initial count for each item
          item.designation = item.designation || "default"; //set to "default" if null or undefined
          return item;
        });

        setMenu(items); //set menu items

        //setting price map data
        const priceMapData = items.reduce((map, item) => {
          map[item.name] = item.price;
          return map;
        }, {});

        setPriceMap(priceMapData);
      } else {
        console.error(
          "Error fetching menu items:",
          data.error || "No menuItems found"
        );
      }
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  useEffect(() => {
    //function call
    fetchMenuItems();
  }, []);

  useEffect(() => {
    //used to track in console
    console.log("GlobalStateProvider - Menu state after fetch:", menu);
  }, [menu]);

  return (
    //vars, funcs to be used globally
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
        isDone,
        setDone,
        setNumTrackedOthers,
        numTrackedOthers,
        resetTrackedOthers,
        currentLanguage,
        changeLanguage,
        translations,
        translateAllText,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

// Custom hook for easier access to the context
export const useGlobalState = () => useContext(GlobalStateContext);
