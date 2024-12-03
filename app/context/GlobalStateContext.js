import React, { createContext, useState, useContext, useEffect } from "react";
import { useTranslate } from "./translateContext";
import { textArray } from "./translateTextArray";

/**
 * @file GlobalStateContext.js
 * @description Provides a global state management system for the application using React's Context API. 
 * Includes utility functions, global variables, and state for user preferences, cart management, 
 * menu operations, and more.
 *
 * @components
 * - **GlobalStateProvider**: Provides the global state and utility functions to all child components.
 * - **useGlobalState**: A custom hook for accessing the global state more easily.
 *
 * @usage
 * - Wrap your application in `<GlobalStateProvider>` to give all components access to the global state.
 * - Use the `useGlobalState` hook to access or modify global state variables and functions.
 *
 * @author Uzair Khan, Brandon Batac, Andrew Popovici
 */


const GlobalStateContext = createContext();

/**
 * Provides global state and utility functions to child components.
 * @param {Object} props - React props.
 * @param {JSX.Element} props.children - The child components wrapped by the provider.
 * @returns {JSX.Element} Global state provider with defined variables and functions.
 * @author Uzair Khan
 */
export const GlobalStateProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState("default");
  const [isPandaMember, setIsPandaMember] = useState(true); //flag for a user being in loyalty program, TRUE FOR NOW
  const [isLargeText, setIsLargeText] = useState("original");

  //variables for current customer
  const [customerPhoneNumber, setCustomerPhoneNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerTotalPoints, setCustomerTotalPoints] = useState(0);
  const [customer10PercentOff, setCustomer10PercentOff] = useState(false);

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

  /**
   * Toggle the theme between default, alternate, and loyalty themes.
   * The theme is stored in the global state and will persist across page reloads.
   * @author Uzair Khan
   */
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
    body.classList.remove(
      "original-size-text",
      "plus-ten-text",
      "plus-twenty-text",
      "plus-thirty-text"
    );

    if (isLargeText === "ten") {
      body.classList.add("plus-ten-text");
    } else if (isLargeText === "twenty") {
      body.classList.add("plus-twenty-text");
    } else if (isLargeText === "thirty") {
      body.classList.add("plus-thirty-text");
    } else {
      body.classList.add("original-size-text");
    }
  }, [isLargeText]);

  /**
   * Toggle the text size of the app between original, +10%, +20%, and +30% sizes.
   * The size is stored in the global state and will persist across page reloads.
   * @author Uzair Khan
   */
  const toggleSize = () => {
    if (isLargeText === "original") {
      setIsLargeText("ten");
    } else if (isLargeText === "ten") {
      setIsLargeText("twenty");
    } else if (isLargeText === "twenty") {
      setIsLargeText("thirty");
    } else {
      setIsLargeText("original");
    }
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

  /**
   * Updates the current language of the application and translates all text using the Google Translate API.
   * @param {string} language - The language code of the target language for translation (e.g., 'es' for Spanish).
   * @returns {void}
   *
   * @author Brandon Batac
   */
  const changeLanguage = (language) => {
    setCurrentLanguage(language);
    translateAllText(textArray, language);
  };

  const [orderNumber, setOrderNumber] = useState(0);
  const MAX_ORDER_NUMBER = 9999;

  /**
   * Increments the order number by one, unless the current order number is equal to or greater than MAX_ORDER_NUMBER,
   * in which case it resets the order number to the starting value of 0.
   * @returns {void}
   *
   * @author Andrew Popovici
   */
  const incOrderNumber = () => {
    const currentOrderNumber = orderNumber;
    if (currentOrderNumber >= MAX_ORDER_NUMBER) {
      setOrderNumber(0); // Reset to the starting value
    } else {
      setOrderNumber((prevOrderNumber) => prevOrderNumber + 1);
    }
  };

  const [cart, setCart] = useState([]);
  const [newItem, setNewItem] = useState({
    id: Date.now(),
    type: "NEW ITEM",
    price: 0.0,
    details: [],
    quantity: 1,
    checkout: [],
  });

  /**
   * Adds a new item to the cart and increments the total number of items in the cart by 1.
   * @param {Object} item - The item to add to the cart. The item should have the following properties:
   *   id: {number} - A unique identifier for the item.
   *   type: {string} - The type of the item (e.g., "NEW ITEM", "SALAD", "BOWL", etc.).
   *   price: {number} - The price of the item.
   *   details: {array} - An array of strings describing the item (e.g., ingredients, toppings, etc.).
   *   quantity: {number} - The number of items to add to the cart.
   *   checkout: {array} - An array of strings containing the item name and price to display on the checkout page.
   * @returns {void}
   *
   * @author Andrew Popovici
   */
  const addItemToCart = (item) => {
    setCart([...cart, item]);
    setNumTotalItems(numTotalItems + 1);
  };

  /**
   * Resets the newItem object to its initial state. This is called when the user navigates away from the current item selection step.
   * @returns {void}
   *
   * @author Andrew Popovici
   */
  const removeNewItem = () => {
    setNewItem({
      id: Date.now(),
      type: "NEW ITEM",
      price: 0.0,
      details: [],
      quantity: 1,
      checkout: [],
    });
  };

  /**
   * Removes an item from the cart and decrements the total number of items in the cart by 1.
   * @param {number} id - The id of the item to remove.
   * @returns {void}
   *
   * @author Andrew Popovici
   */
  const removeItemFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
    setNumTotalItems(numTotalItems - 1);
  };

/**
 * Clears all items from the cart and resets the total number of items to zero.
 * This function is used to empty the cart, typically after a purchase is completed or the cart is reset.
 * 
 * @returns {void}
 * 
 * @author Andrew Popovici
 */
  const clearCart = () => {
    setCart([]);
    setNumTotalItems(0);
  };

// Function to reset the count of tracked sides to zero
/**
 * Resets the count of tracked side items to zero and updates the menu state to reflect this change.
 * It sets the count of side items in the menu to 0.
 * This is useful when clearing the sides of an order.
 * 
 * @returns {void}
 * @author Uzair Khan
 */
  const resetTrackedSides = () => {
    setNumTrackedSides(0);
    setMenu((menu) =>
      menu.map((item) => (item.type === "side" ? { ...item, count: 0 } : item))
    );
  };

// Function to reset the count of tracked entrees to zero
/**
 * Resets the count of tracked entree items to zero and updates the menu state to reflect this change.
 * It sets the count of entree items in the menu to 0.
 * This is useful when clearing the entrees of an order.
 * 
 * @returns {void}
 * @author Uzair Khan
 */
  const resetTrackedEntrees = () => {
    setNumTrackedEntrees(0);
    setMenu((menu) =>
      menu.map((item) =>
        item.type === "entree" ? { ...item, count: 0 } : item
      )
    );
  };


// Function to reset the count of other tracked items to zero
/**
 * Resets the count of other items (appetizers, desserts, drinks) to zero and updates the menu state.
 * It sets the count for appetizer, dessert, and drink items to 0.
 * This is useful when clearing non-entree items of an order.
 * 
 * @returns {void}
 * @author Uzair Khan
 */
  const resetTrackedOthers = () => {
    setNumTrackedOthers(0);
    setMenu((menu) =>
      menu.map((item) =>
        item.type === "appetizer" || "dessert" || "drink"
          ? { ...item, count: 0 }
          : item
      )
    );
  };

  const [totalItemCount, setTotalItemCount] = useState(0); //tracks total items in an entire order
  const [priceMap, setPriceMap] = useState({}); //stores item prices
  const [menu, setMenu] = useState([]); //stores menu item data

// Function to update the total item count
/**
 * Updates the total item count by summing the tracked sides and entrees.
 * This count may be used to track the total number of items in an order.
 * 
 * @returns {void}
 * @author Uzair Khan
 */
  const updateTotalItemCount = () => {
    setTotalItemCount(numTrackedSides + numTrackedEntrees);
  };

// Function to fetch menu items from an API
/**
 * Fetches menu items from the API and updates the menu state with the retrieved data.
 * This function retrieves the items, assigns an initial count of 0 to each item, and creates a price map.
 * It also sets the designation of each item to "default" if not specified.
 * 
 * @returns {Promise<void>} - A promise that resolves when the menu items are successfully fetched and the state is updated.
 * @author Uzair Khan
 */
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
        /* Cart Vars and Funcs */
        orderNumber,
        incOrderNumber,
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
        setCustomerTotalPoints,
        customer10PercentOff,
        setCustomer10PercentOff
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

// Custom hook for easier access to the context
export const useGlobalState = () => useContext(GlobalStateContext);
