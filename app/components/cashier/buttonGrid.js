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
  menuItems,
}) => {
  const plateSizes = ["Bowl", "Plate", "Bigger Plate", "A La Carte"];
  const entrees = menuItems
    .filter(({ type }) => type === "entree" || type === "seasonal")
    .map(({ name }) => name);
  const foodItems = menuItems.filter(
    ({ name }) => !plateSizes.includes(name)
  ).map(({ name }) => name);

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

      const minQuantity = minQuantities[item] || 0;
      if (incrementAmount < 0 && currentQuantity + incrementAmount < minQuantity) {
        return prev;
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
      setDisabledItems([...menuItems.filter(({ name }) => !sides.includes(name)).map(({ name }) => name)]);
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