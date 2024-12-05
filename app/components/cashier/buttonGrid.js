import React, { useState, useEffect, useMemo } from "react";
import styles from "./cashierComponents.module.css";

/**
 * @author Uzair Khan
 * 
 * @description
 * A React component that renders a grid of buttons for the cashier to select menu items 
 * and update their quantities. Supports managing plate sizes, quantities, and associated items 
 * for orders.
 * 
 * @param {object} props - The properties passed to the component.
 * @param {function} props.setNetCost - Function to update the net cost of the order.
 * @param {object} props.priceMap - A map of menu items to their respective prices.
 * @param {object} props.quantities - A map of menu items to their current quantities.
 * @param {function} props.setQuantities - Function to update the quantities map.
 * @param {function} props.addOrderToPanel - Function to add the completed order to the panel.
 * @param {object} props.minQuantities - A map of menu items to their minimum quantities.
 * @param {array} props.sides - An array of side menu items.
 * @param {array} props.menuItems - An array of menu items with their details.
 * 
 * @returns {JSX.Element} The ButtonGrid component.
 * 
 * @example
 * // Example usage:
 * <ButtonGrid 
 *   setNetCost={(newCost) => console.log(newCost)}
 *   priceMap={{ Bowl: 5.99, Plate: 7.99, "Bigger Plate": 9.99 }}
 *   quantities={{ Bowl: 1, Plate: 0, "Bigger Plate": 0 }}
 *   setQuantities={(updatedQuantities) => console.log(updatedQuantities)}
 *   addOrderToPanel={(plate, items) => console.log(plate, items)}
 *   minQuantities={{ Bowl: 1 }}
 *   sides={['Spring Roll', 'Dumpling']}
 *   menuItems={[
 *     { name: 'Bowl', type: 'plate' },
 *     { name: 'Spring Roll', type: 'side' },
 *   ]}
 * />
 * 
 * @since 1.0.0
 * 
 * @module buttonGrid
 */

const ButtonGrid = ({
  setNetCost,
  priceMap,
  quantities,
  setQuantities,
  addOrderToPanel,
  minQuantities,
  sides,
  menuItems,
}) => {
  const plateSizes = ["Bowl", "Plate", "Bigger Plate", "A La Carte"];
  
  // Memoize foodItems and entrees to avoid recalculating on every render
  const entrees = useMemo(
    () => menuItems.filter(({ type }) => type === "entree" || type === "seasonal").map(({ name }) => name),
    [menuItems]
  );
  
  const foodItems = useMemo(
    () => menuItems.filter(({ name }) => !plateSizes.includes(name)).map(({ name }) => name),
    [menuItems]
  );

  // Initial state
  const [disabledItems, setDisabledItems] = useState(foodItems);
  const [enabledItems, setEnabledItems] = useState(plateSizes);
  const [plateQuantity, setPlateQuantity] = useState(0);
  const [currPlate, setCurrPlate] = useState("");
  const [associatedItems, setAssociatedItems] = useState([]);
  const [isEnterEnabled, setIsEnterEnabled] = useState(false);

  // Run this effect once menuItems has loaded to set initial disabled items
  useEffect(() => {
    setDisabledItems(foodItems);
  }, [foodItems]);

  const updateQuantity = (item, amount) => {
    const incrementAmount = sides.includes(item) ? amount * 0.5 : amount;
  
    // Debug log to track updates
    console.log("Updating quantity for:", item, "by amount:", incrementAmount);
  
    setQuantities((prev) => {
      const currentQuantity = prev[item];
      const newQuantity = currentQuantity + incrementAmount;
  
      const minQuantity = minQuantities[item] || 0;
      if (incrementAmount < 0 && currentQuantity + incrementAmount < minQuantity) {
        console.log(`Preventing decrement below minimum for ${item}`);
        return prev; // Prevent decrement if it would drop below minQuantity
      }
  
      console.log(`Setting new quantity for ${item}:`, Math.max(newQuantity, minQuantity));
      return {
        ...prev,
        [item]: Math.max(newQuantity, minQuantity),
      };
    });
  
    let updatedAssociatedItems = [...associatedItems];
  
    // Handle specific logic for different types of items
    if (item === "A La Carte") {
      setCurrPlate("A La Carte");
      setIsEnterEnabled(true);
      setEnabledItems(foodItems);
      setDisabledItems(plateSizes);
      updatedAssociatedItems = [];
    } else if (plateSizes.includes(item)) {
      setCurrPlate(item);
      setEnabledItems(sides);
      setDisabledItems(menuItems.filter(({ name }) => !sides.includes(name)).map(({ name }) => name));
      updatedAssociatedItems = [];
      setPlateQuantity(0);
    } else if (currPlate === "A La Carte") {
      if (incrementAmount < 0) {
        updatedAssociatedItems = updatedAssociatedItems.filter(
          (associatedItem, index) => associatedItem !== item || index !== updatedAssociatedItems.indexOf(item)
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
        setDisabledItems(menuItems.filter(({ name }) => !entrees.includes(name)).map(({ name }) => name));
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
      {menuItems.map(({ name }) => (
        <div key={name} className={styles.gridItem}>
          <button
            onClick={() => updateQuantity(name, 1)}
            className={`${styles.itemButton} ${
              disabledItems.includes(name) ? styles.itemButtonDisabled : ""
            } ${enabledItems.includes(name) ? styles.itemButtonEnabled : ""}`}
            disabled={disabledItems.includes(name)}
          >
            {name}
          </button>
          <span className={styles.quantity}>{quantities[name]}</span>
          {!plateSizes.includes(name) && (
            <button
              onClick={() => updateQuantity(name, -1)}
              className={styles.minusButton}
              disabled={disabledItems.includes(name)}
            >
              –
            </button>
          )}
          {name === "A La Carte" && isEnterEnabled && (
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
