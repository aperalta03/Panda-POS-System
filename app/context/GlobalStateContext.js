import React, { createContext, useState, useContext, useEffect } from "react";
import { useTranslate } from "./translateContext";
import { textArray } from "./translateTextArray";

const GlobalStateContext = createContext();

//setting global vars
export const GlobalStateProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState("default");
  const [isPandaMember, setIsPandaMember] = useState(true); //flag for a user being in loyalty program, TRUE FOR NOW
  const [isLargeText, setIsLargeText] = useState("original");

  //variables for current customer
  const [customerPhoneNumber, setCustomerPhoneNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerTotalPoints, setCustomerTotalPoints] = useState(0);

  useEffect(() => {
    // Apply the theme to the body or a specific wrapper
    const body = document.body;
    body.classList.remove("default-theme", "alternate-theme", "loyalty-theme");

    if (currentTheme === "alternate") {
      body.classList.add("alternate-theme");
    } else if (currentTheme === "loyalty") {
      body.classList.add("loyalty-theme");
    } else {
      body.classList.add("default-theme");
    }
  }, [currentTheme]);

  const toggleTheme = () => {
    if (currentTheme === "default") {
      setCurrentTheme("alternate");
    } else if (currentTheme === "alternate") {
      setCurrentTheme("loyalty");
    } else {
      setCurrentTheme("default");
    }
  };


  useEffect(() => {
    const body = document.body;
    body.classList.remove("original-size-text", "plus-ten-text", "plus-twenty-text", "plus-thirty-text");

    if (isLargeText === "ten") {
      body.classList.add("plus-ten-text");
    }
    else if (isLargeText === "twenty") {
      body.classList.add("plus-twenty-text");
    }
    else if (isLargeText === "thirty") {
      body.classList.add("plus-thirty-text");
    } else {
      body.classList.add("original-size-text");
    }
  }, [isLargeText]);

  const toggleSize = () => {
    if (isLargeText === "original") {
      setIsLargeText("ten");
    } else if (isLargeText === "ten") {
      setIsLargeText("twenty");
    } else if (isLargeText === "twenty") {
      setIsLargeText("thirty");
    } else {
      setIsLargeText("original");
    };
  };



  const [numTotalItems, setNumTotalItems] = useState(0);
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
  const [cart, setCart] = useState([]);
  const [newItem, setNewItem] = useState({
    id: Date.now(),
    type: "NEW ITEM",
    price: 0.0,
    details: [],
    quantity: 1,
  });

  const addItemToCart = (item) => {
    setCart([...cart, item]);
    setNumTotalItems(numTotalItems + 1);
  };

  const removeNewItem = () => {
    setNewItem({
      id: Date.now(),
      type: "NEW ITEM",
      price: 0.0,
      details: [],
      quantity: 1,
    });
  }

  const removeItemFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
    setNumTotalItems(numTotalItems - 1);
  };

  const clearCart = () => {
    setCart([]);
    setNumTotalItems(0);
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
      menu.map((item) =>
        item.type === "appetizer" || "dessert" || "drink" ? { ...item, count: 0 } : item
      )
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
      const response = await fetch("/api/menu-get-items");
      const data = await response.json();

      if (response.ok && data.menuItems) {
        console.log("Fetched menu items:", data.menuItems);

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
        numTrackedOthers, 
        resetTrackedOthers,
        /* Cart Vars and Funcs */
        cart,
        newItem,
        setNewItem,
        removeNewItem,
        setCart,
        addItemToCart,
        removeItemFromCart,
        clearCart,
        numTotalItems,
        setNumTotalItems,
        /*styling toggles */
        currentTheme,
        toggleTheme,
        isPandaMember,
        setIsPandaMember,
        toggleSize,
        isLargeText,
        /*Custom Info*/
        customerPhoneNumber,
        setCustomerPhoneNumber,
        customerName,
        setCustomerName,
        customerTotalPoints,
        setCustomerTotalPoints
      }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

// Custom hook for easier access to the context
export const useGlobalState = () => useContext(GlobalStateContext);
