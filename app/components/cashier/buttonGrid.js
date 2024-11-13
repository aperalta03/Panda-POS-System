import React, { useState } from "react";
import styles from "./cashier.module.css";

const ButtonGrid = ({
  setNetCost,
  priceMap,
  quantities,
  setQuantities,
  addOrderToPanel,
  seasonalItemName,
  seasonalItemActive,
  minQuantities,
  sides,
}) => {
  const menuItems = [
    "Bowl",
    "Plate",
    "Bigger Plate",
    "A La Carte",
    "Fountain Drink",
    "Bottled Drink",
    "Super Greens",
    "Chow Mein",
    "White Steamed Rice",
    "Fried Rice",
    "Chicken Egg Roll",
    "Veggie Egg Roll",
    "Cream Cheese Rangoon",
    "Apple Pie Roll",
    "Orange Chicken",
    "Black Pepper Sirloin Steak",
    "Honey Walnut Shrimp",
    "Grilled Teriyaki Chicken",
    "Broccoli Beef",
    "Kung Pao Chicken",
    "Honey Sesame Chicken",
    "Beijing Beef",
    "Mushroom Chicken",
    "SweetFire Chicken",
    "String Bean Chicken",
    "Black Pepper Chicken",
    "Seasonal Item",
  ];

  const entrees = [
    "Orange Chicken",
    "Black Pepper Sirloin Steak",
    "Honey Walnut Shrimp",
    "Grilled Teriyaki Chicken",
    "Broccoli Beef",
    "Kung Pao Chicken",
    "Honey Sesame Chicken",
    "Beijing Beef",
    "Mushroom Chicken",
    "SweetFire Chicken",
    "String Bean Chicken",
    "Black Pepper Chicken",
    "Seasonal Item",
  ];

  const plateSizes = ["Bowl", "Plate", "Bigger Plate", "A La Carte"];
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
      if (
        incrementAmount < 0 &&
        currentQuantity + incrementAmount < minQuantity
      ) {
        return prev; // Prevent decrement if it would drop below minQuantity
      }

      return {
        ...prev,
        [item]: Math.max(newQuantity, minQuantity),
      };
    });

    // Temporary variable to hold the updated associated items
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
      // Modified handling for A La Carte items (sides and entrees)
      if (incrementAmount < 0) {
        // If decrementing, remove the item from associatedItems
        updatedAssociatedItems = updatedAssociatedItems.filter(
          (associatedItem, index) => {
            // Only remove one instance of the item
            if (associatedItem === item) {
              // Skip the first matching instance
              return index !== updatedAssociatedItems.indexOf(item);
            }
            return true;
          }
        );
      } else {
        // If incrementing, add the item to associatedItems
        updatedAssociatedItems.push(item);
      }
    } else if (sides.includes(item)) {
      // Keep the existing logic for sides
      const currentQuantity = quantities[item];
      const minQuantity = minQuantities[item] || 0;
      if (!(incrementAmount < 0 && currentQuantity <= minQuantity)) {
        setPlateQuantity((prev) => prev + incrementAmount);

        if (incrementAmount < 0) {
          updatedAssociatedItems = updatedAssociatedItems.filter(
            (i) => i !== item
          );
        } else {
          updatedAssociatedItems.push(item);
        }
      }

      if (plateQuantity + incrementAmount >= 1 && currPlate !== "A La Carte") {
        setEnabledItems(entrees);
        setDisabledItems([...menuItems.filter((i) => !entrees.includes(i))]);
      }
    } else if (entrees.includes(item)) {
      // Keep the existing logic for entrees
      const currentQuantity = quantities[item];
      const minQuantity = minQuantities[item] || 0;
      if (!(incrementAmount < 0 && currentQuantity <= minQuantity)) {
        setPlateQuantity((prev) => prev + incrementAmount);

        if (incrementAmount < 0) {
          updatedAssociatedItems = updatedAssociatedItems.filter(
            (i) => i !== item
          );
        } else {
          updatedAssociatedItems.push(item);
        }
        // Run the final check with the updated associated items
        checkQuantity(
          plateQuantity + incrementAmount,
          currPlate,
          updatedAssociatedItems
        );
      }
    }

    // Update the associated items state after modifications
    setAssociatedItems(updatedAssociatedItems);
  };

  const checkQuantity = (currentPlateQuantity, currentPlate, items) => {
    const requiredQuantities = {
      Bowl: 2,
      Plate: 3,
      "Bigger Plate": 4,
    };
    if (
      currentPlate !== "A La Carte" &&
      currentPlateQuantity >= requiredQuantities[currentPlate]
    ) {
      const updatedItems = items.map((item) =>
        item === "Seasonal Item" ? seasonalItemName : item
      );
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
      const updatedItems = associatedItems.map((item) =>
        item === "Seasonal Item" ? seasonalItemName : item
      );
      const aLaCarteCost = associatedItems.reduce(
        (total, item) => total + priceMap[item],
        0
      );

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
      {menuItems.map(
        (item) =>
          (item !== "Seasonal Item" || seasonalItemActive) && (
            <div key={item} className={styles.gridItem}>
              <button
                onClick={() => updateQuantity(item, 1)}
                className={`${styles.itemButton} ${
                  disabledItems.includes(item)
                    ? styles.itemButtonDisabled
                    : ""
                } ${
                  enabledItems.includes(item) ? styles.itemButtonEnabled : ""
                }`}
                disabled={disabledItems.includes(item)}
              >
                {item === "Seasonal Item" ? seasonalItemName : item}{" "}
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
                <button
                  onClick={handleEnterClick}
                  className={styles.enterButton}
                >
                  Enter
                </button>
              )}
            </div>
          )
      )}
    </div>
  );
};

export default ButtonGrid;