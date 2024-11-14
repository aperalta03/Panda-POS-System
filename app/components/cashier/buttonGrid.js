import React, { useState } from "react";
import styles from "./cashier.module.css";

const ButtonGrid = ({
  setNetCost,
  priceMap,
  quantities,
  setQuantities,
  addOrderToPanel,
  minQuantities,
  sides,
}) => {
  const menuItems = [
    // Plate sizes
    "Bowl",
    "Plate",
    "Bigger Plate",
    "A La Carte",

    // Drinks
    "Bottle Drink",
    "Fountain Drink",

    // Appetizers
    "Chicken Egg Roll",
    "Veggie Spring Roll",
    "Cream Cheese Rangoon",

    // Dessert
    "Apple Pie Roll",

    // Sides
    "Super Greens",
    "Chow Mein",
    "Fried Rice",
    "White Steamed Rice",

    // Entrees
    "Orange Chicken",
    "Honey Walnut Shrimp",
    "Grilled Teriyaki Chicken",
    "Broccoli Beef",
    "Kung Pao Chicken",
    "Black Pepper Sirloin Steak",
    "Honey Sesame Chicken",
    "Beijing Beef",
    "Mushroom Chicken",
    "SweetFire Chicken",
    "String Bean Chicken",
    "Black Pepper Chicken",

    // Seasonal item
    "Dumplings",
  ];

  const plateSizes = ["Bowl", "Plate", "Bigger Plate", "A La Carte"];
  const entrees = [
    "Orange Chicken",
    "Honey Walnut Shrimp",
    "Grilled Teriyaki Chicken",
    "Broccoli Beef",
    "Kung Pao Chicken",
    "Black Pepper Sirloin Steak",
    "Honey Sesame Chicken",
    "Beijing Beef",
    "Mushroom Chicken",
    "SweetFire Chicken",
    "String Bean Chicken",
    "Black Pepper Chicken",
    "Dumplings", // Seasonal item at the end
  ];

  const foodItems = menuItems.filter((item) => !plateSizes.includes(item));

  const [disabledItems, setDisabledItems] = useState(foodItems);
  const [enabledItems, setEnabledItems] = useState(plateSizes);
  const [plateQuantity, setPlateQuantity] = useState(0);
  const [currPlate, setCurrPlate] = useState("");
  const [associatedItems, setAssociatedItems] = useState([]);
  const [isEnterEnabled, setIsEnterEnabled] = useState(false);

  const updateQuantity = (item, amount) => {
    const incrementAmount = sides.includes(item) ? amount * 0.5 : amount;

    setQuantities((prev) => {
      const currentQuantity = prev[item];
      const newQuantity = currentQuantity + incrementAmount;

      // Ensure the quantity doesn't go below the minimum
      const minQuantity = minQuantities[item] || 0;

      // Check if decrementing would result in a quantity below the minimum
      if (incrementAmount < 0 && currentQuantity + incrementAmount < minQuantity) {
        return prev; // Prevent decrement if it would drop below minQuantity
      }

      return {
        ...prev,
        [item]: Math.max(newQuantity, minQuantity),
      };
    });

    let updatedAssociatedItems = [...associatedItems];

    if (item === "A La Carte") {
      setCurrPlate("A La Carte");
      setIsEnterEnabled(true);
      setEnabledItems(foodItems);
      setDisabledItems(plateSizes);
      updatedAssociatedItems = [];
    } else if (plateSizes.includes(item)) {
      setCurrPlate(item);
      setEnabledItems(sides);
      setDisabledItems([...menuItems.filter((i) => !sides.includes(i))]);
      updatedAssociatedItems = [];
      setPlateQuantity(0);
    } else if (currPlate === "A La Carte") {
      if (incrementAmount < 0) {
        updatedAssociatedItems = updatedAssociatedItems.filter(
          (associatedItem, index) => {
            if (associatedItem === item) {
              return index !== updatedAssociatedItems.indexOf(item);
            }
            return true;
          }
        );
      } else {
        updatedAssociatedItems.push(item);
      }
    } else if (sides.includes(item)) {
      const currentQuantity = quantities[item];
      const minQuantity = minQuantities[item] || 0;
      if (!(incrementAmount < 0 && currentQuantity <= minQuantity)) {
        setPlateQuantity((prev) => prev + incrementAmount);

        if (incrementAmount < 0) {
          updatedAssociatedItems = updatedAssociatedItems.filter((i) => i !== item);
        } else {
          updatedAssociatedItems.push(item);
        }
      }

      if (plateQuantity + incrementAmount >= 1 && currPlate !== "A La Carte") {
        setEnabledItems(entrees);
        setDisabledItems([...menuItems.filter((i) => !entrees.includes(i))]);
      }
    } else if (entrees.includes(item)) {
      const currentQuantity = quantities[item];
      const minQuantity = minQuantities[item] || 0;
      if (!(incrementAmount < 0 && currentQuantity <= minQuantity)) {
        setPlateQuantity((prev) => prev + incrementAmount);

        if (incrementAmount < 0) {
          updatedAssociatedItems = updatedAssociatedItems.filter((i) => i !== item);
        } else {
          updatedAssociatedItems.push(item);
        }
        checkQuantity(plateQuantity + incrementAmount, currPlate, updatedAssociatedItems);
      }
    }

    setAssociatedItems(updatedAssociatedItems);
  };

  const checkQuantity = (currentPlateQuantity, currentPlate, items) => {
    const requiredQuantities = {
      Bowl: 2,
      Plate: 3,
      "Bigger Plate": 4,
    };
    if (currentPlate !== "A La Carte" && currentPlateQuantity >= requiredQuantities[currentPlate]) {
      const updatedItems = items.map((item) => item);
      addOrderToPanel(currentPlate, updatedItems);
      setDisabledItems(foodItems);
      setEnabledItems(plateSizes);
      setCurrPlate("");
      setPlateQuantity(0);
      setAssociatedItems([]);
      setNetCost((prev) => prev + priceMap[currentPlate]);
    }
  };

  const handleEnterClick = () => {
    if (currPlate === "A La Carte") {
      const updatedItems = associatedItems.map((item) => item);
      const aLaCarteCost = associatedItems.reduce((total, item) => total + priceMap[item], 0);

      setNetCost((prevNetCost) => prevNetCost + aLaCarteCost);
      addOrderToPanel("A La Carte", associatedItems);

      setDisabledItems(foodItems);
      setEnabledItems(plateSizes);
      setCurrPlate("");
      setPlateQuantity(0);
      setIsEnterEnabled(false);
      setAssociatedItems([]);
    }
  };

  return (
    <div className={styles.buttonGrid}>
      {menuItems.map((item) => (
        <div key={item} className={styles.gridItem}>
          <button
            onClick={() => updateQuantity(item, 1)}
            className={`${styles.itemButton} ${
              disabledItems.includes(item) ? styles.itemButtonDisabled : ""
            } ${enabledItems.includes(item) ? styles.itemButtonEnabled : ""}`}
            disabled={disabledItems.includes(item)}
          >
            {item}
          </button>
          <span className={styles.quantity}>{quantities[item]}</span>
          {!plateSizes.includes(item) && (
            <button
              onClick={() => updateQuantity(item, -1)}
              className={styles.minusButton}
              disabled={disabledItems.includes(item)}
            >
              –
            </button>
          )}
          {item === "A La Carte" && isEnterEnabled && (
            <button onClick={handleEnterClick} className={styles.enterButton}>
              Enter
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ButtonGrid;