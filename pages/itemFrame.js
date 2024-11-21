import React, { useState, useEffect } from "react";
import { useGlobalState } from "../app/context/GlobalStateContext"; //import global state
import styles from "./itemFrame.module.css";

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

  //handles incrementation
  const handleIncrement = () => {
    if (isDone && item.type === 'entree') return;
    if (newItem === 0) {
      addItemToCart({
        id: Date.now(),
        type: "NEW ITEM",
        price: 0.0,
        details: [],
        quantity: 1,
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
          newItem.details = [...newItem.details, "0.5 " + item.name];
        } 
        else if (item.type === 'entree') {
          setNumTrackedEntrees(numTrackedEntrees + 1);
          newItem.details = [...newItem.details, "1 " + item.name];
          if (item.designation === 'Premium') {
            newItem.price += 2.50;
          }
        }
        else if (item.type === 'other') {
          setNumTrackedOthers(numTrackedOthers + 1);
          newItem.details = [...newItem.details, "1 " + item.name];
          newItem.price += item.price;
        }

        return updatedItem;
      }
      return menuItem;
    });
    setMenu(updatedMenu);
  };

  //handles decrement
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
          newItem.details.pop();
        } 
        else if (item.type === 'entree' && numTrackedEntrees > 0) {
          setNumTrackedEntrees(numTrackedEntrees - 1);
          newItem.details.pop();
          if (item.designation === 'Premium') {
            newItem.price -= 2.50;
          }
        }
        else if (item.type === 'other' && numTrackedOthers > 0) {
          setNumTrackedOthers(numTrackedOthers - 1);
          newItem.details.pop();
          newItem.price -= item.price;
        }

        return updatedItem;
      }
      return menuItem;
    });
    setMenu(updatedMenu);
  };

  //handles toggling description of an item
  const toggleDescription = () => {
    setShowDescription(!showDescription);
  };

  //depends on designation, setting a different icon
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

  //const designationIcon = getDesignationIcon(item.designation);
  //const designationClass = item.designation ? `${styles[item.designation.toLowerCase() + 'designation']}` : ''; //setting designation style class based on icon
  const designationIcon = item.designation
    ? getDesignationIcon(item.designation)
    : null;
  const designationClass = item.designation
    ? `${styles[item.designation.toLowerCase() + "designation"]}`
    : "";
  //console.log(designationClass);

  return (
    <div className={`${styles.itemFrame}`}>
      <img src={item.image} alt={item.name} className={styles.itemImage} />

      <h3 className={styles.name}>{translations[item.name] || item.name}</h3>
      <p className={styles.calories}>
        {item.calories} {translations["Calories"] || "Cal."}
      </p>

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
                : "No specific designation"}
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
