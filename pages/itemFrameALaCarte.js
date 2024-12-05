import React, { useState, useEffect } from "react";
import { useGlobalState } from "../app/context/GlobalStateContext"; //import global state
import styles from "./itemFrameALaCarte.module.css";

/**
 * @author Uzair Khan
 * 
 * @description
 * Component representing a single menu item: handles incrementation and decrementation.
 * Renders an image, name, calories, and buttons to add/remove an item from the cart by making an item frame.
 *
 * @param {object} item - The menu item to render.
 * @param {boolean} isDone - Whether the entree selection is done.
 *
 * @returns {JSX.Element} The item frame for a menu item.
 *
 * @module itemFrameALaCarte
 */
const ItemFrame = ({ item, isDone }) => {
  const {
    menu,
    setMenu,
    numTrackedSides,
    setNumTrackedSides,
    numTrackedEntrees,
    setNumTrackedEntrees,
    setNumTrackedOthers,
    numTrackedOthers,
    priceMap,
    translations,
    cart,
    newItem,
    setNewItem,
    removeNewItem,
    setCart,
    addItemToCart,
    removeItemFromCart,
    clearCart,
  } = useGlobalState();

  const [showDescription, setShowDescription] = useState(false); //var to show description of an item

/**
 * Handles incrementing the quantity of an item in an order and adding it to the cart.
 * Updates the cart, menu, and item details based on the item type.
 * 
 * @author Uzair Khan
 * @throws Will throw an error if `menu` or `item` is undefined or null.
 * @throws Will throw an error if `addItemToCart` or `setMenu` is not a function.
 * @returns {void}
 */
  const handleIncrement = () => {
    if (isDone && item.type === 'entree') return;
    if (newItem === 0) {
      addItemToCart({
        id: Date.now(),
        type: "NEW ITEM",
        price: 0.0,
        details: [],
        quantity: 1,
        checkout: []
      });
    }
    const updatedMenu = menu.map((menuItem) => {
      if (menuItem.name === item.name) {
        const incrementAmount = item.type === "side" ? 0.5 : 1;
        const updatedItem = {
          ...menuItem,
          count: menuItem.count + incrementAmount,
        };

        if (item.type === "side") {
          setNumTrackedSides(numTrackedSides + 0.5);
          newItem.details = [...newItem.details, "0.5 " + item.name + " $" + item.price];
        } 
        else if (item.type === 'entree') {
          setNumTrackedEntrees(numTrackedEntrees + 1);
          newItem.details = [...newItem.details, "1 " + item.name + " $" + item.price];
        }
        else if (item.type === 'appetizer' || 'drink' || 'dessert') {
          setNumTrackedOthers(numTrackedOthers + 1);
          newItem.details = [...newItem.details, "1 " + item.name + " $" + item.price];

        }
        newItem.price += item.price;
        newItem.checkout.push(item.name);

        return updatedItem;
      }
      return menuItem;
    });
    setMenu(updatedMenu);
  };

/**
 * Handles decrementing the quantity of an item in an order and subtracting it from the cart.
 * Updates the cart, menu, and item details based on the item type.
 * 
 * @author Uzair Khan
 * @throws Will throw an error if `menu` or `item` is undefined or null.
 * @throws Will throw an error if `setMenu` is not a function.
 * @returns {void}
 */
  const handleDecrement = () => {
    const updatedMenu = menu.map((menuItem) => {
      if (menuItem.name === item.name && menuItem.count > 0) {
        const decrementAmount = item.type === "side" ? 0.5 : 1;
        const updatedItem = {
          ...menuItem,
          count: menuItem.count - decrementAmount,
        };

        if (item.type === "side" && numTrackedSides > 0) {
          setNumTrackedSides(numTrackedSides - 0.5);
        } else if (item.type === "entree" && numTrackedEntrees > 0) {
          setNumTrackedEntrees(numTrackedEntrees - 1);
        } else if (item.type ===  "appetizer" || "drink" || "dessert" && numTrackedOthers > 0) {
          setNumTrackedOthers(numTrackedOthers - 1);
        }

        //remove from cart
        newItem.details.pop();
        newItem.checkout.pop();
        newItem.price -= item.price;

        return updatedItem;
      }
      return menuItem;
    });
    setMenu(updatedMenu);
  };

/**
 * Toggles the description modal for an item.
 * Opens or closes the modal based on its current state.
 * 
 * @author Uzair Khan
 * @throws Will throw an error if `setShowDescription` is not a function.
 * @returns {void}
 */
  const toggleDescription = () => {
    setShowDescription(!showDescription);
  };

/**
 * Returns the corresponding Material-UI icon for a given designation.
 * 
 * @author Uzair Khan
 * @param {string} designation - The designation of the menu item.
 * @throws Will throw an error if `designation` is not a string.
 * @returns {JSX.Element|null} The corresponding icon or `null` if no match is found.
 */
  const getDesignationIcon = (designation) => {
    console.log(designation);
    switch (designation) {
      case "Premium":
        return "P";
      case "Spicy":
        return "S";
      case "Veggie":
        return "V";
      case "Seasonal":
        return "L";
      case "Default":
        return "D";
      default:
        return null;
    }
  };

  // Ensure item and designation are defined
  if (!item || !item.designation) {
    console.warn("Item or designation is undefined:", item);
    return null; // Or a default placeholder
  }

  const designationIcon = item.designation
    ? getDesignationIcon(item.designation)
    : null;
  const designationClass = item.designation
    ? `${styles[item.designation.toLowerCase() + "designation"]}`
    : "";

  const price = priceMap[item.name];

  return (
    <div className={`${styles.itemFrame}`}>
      <img src={item.image} alt={item.name} className={styles.itemImage} />
      <h3 className={styles.name}>{translations[item.name] || item.name}</h3>
      <p className={styles.calories}>
        {item.calories} {translations["Calories"] || "Cal."}
      </p>
      {price && <p className={styles.price}>${price.toFixed(2)}</p>}{" "}
      {/* Display the price with 2 decimal points */}
      <div className={styles.infoButtonContainer}>
        {designationIcon && (
          <div className={`${styles.designationIcon} ${designationClass}`}>
            {designationIcon}
          </div>
        )}
        <button onClick={toggleDescription} className={styles.infoButton}>
          i
        </button>
      </div>
      {showDescription && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <p>{translations[item.description] || item.description}</p>
            <p>
              <span className={styles.designationLabel}>
                {translations["Designation:"] || "Designation:"}
              </span>{" "}
              {item.designation
                ? translations[item.designation] || item.designation
                : translations["No specific designation"] ||
                  "No specific designation"}
            </p>
            <button onClick={toggleDescription} className={styles.closeButton}>
              {translations["Close"] || "Close"}
            </button>
          </div>
        </div>
      )}
      <div className={styles.counterContainer}>
        <button className={styles.addSub} onClick={handleDecrement}>
          -
        </button>
        <span>{item.count}</span>
        <button
          className={styles.addSub}
          onClick={handleIncrement}
          disabled={item.type === "entree" && isDone}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default ItemFrame;
