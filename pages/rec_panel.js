import React, { useState, useEffect } from "react";
import styles from "./rec_panel.module.css";
import { useGlobalState } from "@/app/context/GlobalStateContext";

/**
 * @description
 * RecommendationPanel renders a panel with random items from the menu
 * and allows users to increment/decrement the quantity of each item and
 * add it to the cart.
 *
 * The panel shows the name, calories, and price of each item, as well as
 * a counter for the quantity selection. The user can decrement the quantity
 * by clicking on the "-" button, and increment it by clicking on the "+" button.
 * When the user clicks on the "Enter" button, the item is added to the cart
 * with the selected quantity.
 *
 * The panel also displays a header with the title "Last Minute Picks?".
 *
 * @param {object} props - The properties passed to the component.
 * @param {Array<Object>} props.menu - The menu items.
 * @param {Array<Object>} props.cart - The current cart items.
 * @param {function} props.setCart - A function to update the cart items.
 * @param {object} props.translations - The translations for the text.
 * @param {number} props.numTotalItems - The total number of items in the cart.
 * @param {function} props.setNumTotalItems - A function to update the total number of items in the cart.
 *
 * @returns {JSX.Element} The RecommendationPanel component.
 *
 * @example
 * <RecommendationPanel menu={menuItems} cart={cartItems} setCart={setCartFunction} translations={translations} numTotalItems={10} setNumTotalItems={setNumTotalItemsFunction} />
 *
 * @module rec_panel
 */
const RecommendationPanel = () => {
  const { menu, cart, setCart, translations, numTotalItems, setNumTotalItems } = useGlobalState();
  const [randomItems, setRandomItems] = useState([]);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const getRandomItems = () => {
      const filteredMenu = menu.filter(
        (item) => item.type === "appetizer" || item.type === "dessert"
      );
      
      const shuffled = [...filteredMenu].sort(() => 0.5 - Math.random());
      const selectedItems = shuffled.slice(0, 3);
      const initialQuantities = selectedItems.reduce((acc, item, index) => {
        const uniqueId = item.id || `fallback-${index}`;
        acc[uniqueId] = 0;
        return acc;
      }, {});
      setQuantities(initialQuantities);
      console.log("Selected items:", selectedItems);
      return selectedItems;
    };
    setRandomItems(getRandomItems());
  }, [menu]);

/**
 * @author: Uzair Khan
 * Increments the quantity of the specified item in the panel.
 *
 * @param {string} id - The unique identifier of the item to increment.
 */
  const handleIncrement = (id) => {
    console.log(`Incrementing ${id}`);
    setQuantities((prevQuantities) => {
      console.log(prevQuantities);
      return {
        ...prevQuantities,
        [id]: (prevQuantities[id] || 0) + 1,
      };
    });
  };


/**
 * @author: Uzair Khan
 * Decrements the quantity of the specified item in the panel.
 * If the quantity is already 0, it does nothing.
 *
 * @param {string} id - The unique identifier of the item to decrement.
 */
  const handleDecrement = (id) => {
    console.log(`Decrementing ${id}`);
    setQuantities((prevQuantities) => {
      console.log(prevQuantities);
      return {
        ...prevQuantities,
        [id]: Math.max(0, (prevQuantities[id] || 0) - 1),
      };
    });
  };

/**
 * @author: Uzair Khan
 * Adds item to the order panel
 *
 * @param {string} id - The unique identifier of the item as well as is the item itself
 * @param {object} item - The item itself
 */
  const handleAddItem = (item, id) => {
    const quantity = quantities[id] || 1;

    if (quantity === 0) {
      console.log('Quantity is zero, not adding to cart');
      return;
    }

    const newItem = {
        id: Date.now(),
        type: "A LA CARTE",
        price: item.price || 5.0,
        //details: [item.name || "No details"],
        details: [`${quantity} ${item.name || "No details"} $${item.price}`],
        quantity: quantity,
        checkout: [item.name]
    };
    setCart([...cart, newItem]);
    setNumTotalItems(numTotalItems + 1);
    
    setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [id]: 0,
    }));
  };

  return (
    <div className={styles.recPanel}>
    <h1 className={styles.recHeader}>
        Last Minute Picks?
    </h1>

    <div className={styles.itemFrameContainer}>
      {randomItems.map((item, index) => {
        const uniqueId = item.id || `fallback-${index}`;

        return (
          <div key={uniqueId} className={styles.itemFrame}>
            <div className={styles.contentWrapper}>
              <img
                src={item.image}
                alt={item.name}
                className={styles.itemImage}
              />
              <div className={styles.textContent}>
                <h3 className={styles.name}>
                  {translations[item.name] || item.name}
                </h3>
                <p className={styles.calories}>
                  {item.calories} {translations["Calories"] || "Cal."} | ${item.price}
                </p>

                {/* Counter for quantity selection */}
                <div className={styles.counterContainer}>
                  <button
                    className={styles.addSub}
                    onClick={() => handleDecrement(uniqueId)}
                  >
                    -
                  </button>
                  <span>{quantities[uniqueId] || 0}</span>
                  <button
                    className={styles.addSub}
                    onClick={() => handleIncrement(uniqueId)}
                  >
                    +
                  </button>
                </div>

                {/* Enter button to add item to cart */}
                <button
                  onClick={() => handleAddItem(item, uniqueId)}
                  className={styles.enterButton}
                  disabled={quantities[uniqueId] === 0} 
                >
                  {translations["Enter"] || "Enter"}
                </button>
              </div>
            </div>
            
          </div>
        );
      })}
    </div>
    </div>
  );
};

export default RecommendationPanel;