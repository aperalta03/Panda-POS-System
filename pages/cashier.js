import React, { useState } from "react";
import styles from "./cashier.module.css";

const ButtonGrid = ({
  setNetCost,
  priceMap,
  resetGrid,
  quantities,
  setQuantities,
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

  const sides = [
    "Super Greens",
    "Chow Mein",
    "White Steamed Rice",
    "Fried Rice",
  ];
  const plateSizes = ["Bowl", "Plate", "Bigger Plate", "A La Carte"];
  const foodItems = menuItems.filter((item) => !plateSizes.includes(item));

  const [disabledItems, setDisabledItems] = useState([]);
  const [enabledItems, setEnabledItems] = useState(plateSizes);
  const [plateQuantity, setPlateQuantity] = useState(0);
  const [currPlate, setCurrPlate] = useState("");
  const [associatedItems, setAssociatedItems] = useState([]);
  const [isEnterEnabled, setIsEnterEnabled] = useState(false);

  const updateQuantity = (item, amount) => {
    const incrementAmount = sides.includes(item) ? amount * 0.5 : amount;

    setQuantities((prev) => ({
      ...prev,
      [item]: Math.max(prev[item] + incrementAmount, 0),
    }));

    if (foodItems.includes(item)) {
      setPlateQuantity((prev) => {
        const newPlateQuantity = Math.max(prev + incrementAmount, 0);
        checkQuantity(newPlateQuantity, currPlate);
        return newPlateQuantity;
      });
      setAssociatedItems((prev) => [...prev, item]);
    }

    if (item === "A La Carte") {
      setCurrPlate("A La Carte");
      setIsEnterEnabled(true);
      setDisabledItems(["Bowl", "Plate", "Bigger Plate", "A La Carte"]);
    } else if (plateSizes.includes(item)) {
      setCurrPlate(item);
      setDisabledItems([
        "Bowl",
        "Plate",
        "Bigger Plate",
        "A La Carte",
        "Chicken Egg Roll",
        "Veggie Egg Roll",
        "Cream Cheese Rangoon",
        "Apple Pie Roll",
        "Fountain Drink",
        "Bottled Drink",
      ]);
    }
  };

  const handleMinusClick = (item) => updateQuantity(item, -1);

  const checkQuantity = (currentPlateQuantity, currentPlate) => {
    if (
      (currentPlateQuantity === 2 && currentPlate === "Bowl") ||
      (currentPlateQuantity === 3 && currentPlate === "Plate") ||
      (currentPlateQuantity === 4 && currentPlate === "Bigger Plate")
    ) {
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
      const aLaCarteCost = associatedItems.reduce(
        (total, item) => total + priceMap[item],
        0
      );
      setNetCost((prevNetCost) => prevNetCost + aLaCarteCost);

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
              onClick={() => handleMinusClick(item)}
              className={styles.minusButton}
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

const BottomPanel = ({ netCost, handlePayClick }) => (
  <div className={styles.bottomPanel}>
    <div className={styles.leftPanel}>
      <h2 className={styles.netLabel}>Net: ${netCost.toFixed(2)}</h2>
      <h2 className={styles.taxLabel}>Tax: ${(netCost * 0.0625).toFixed(2)}</h2>
      <h1 className={styles.totalLabel}>
        Total: ${(netCost + netCost * 0.0625).toFixed(2)}
      </h1>
    </div>
    <button onClick={handlePayClick} className={styles.payButton}>
      Pay
    </button>
    <div className={styles.rightPanel}>
      <button className={styles.addItem}>Add Menu Item</button>
      <button className={styles.closeButton}>Log Out</button>
    </div>
  </div>
);

const CashierPage = () => {
  const [netCost, setNetCost] = useState(0.0);
  const [quantities, setQuantities] = useState({
    Bowl: 0,
    Plate: 0,
    "Bigger Plate": 0,
    "A La Carte": 0,
    "Fountain Drink": 0,
    "Bottled Drink": 0,
    "Super Greens": 0,
    "Chow Mein": 0,
    "White Steamed Rice": 0,
    "Fried Rice": 0,
    "Chicken Egg Roll": 0,
    "Veggie Egg Roll": 0,
    "Cream Cheese Rangoon": 0,
    "Apple Pie Roll": 0,
    "Orange Chicken": 0,
    "Black Pepper Sirloin Steak": 0,
    "Honey Walnut Shrimp": 0,
    "Grilled Teriyaki Chicken": 0,
    "Broccoli Beef": 0,
    "Kung Pao Chicken": 0,
    "Honey Sesame Chicken": 0,
    "Beijing Beef": 0,
    "Mushroom Chicken": 0,
    "SweetFire Chicken": 0,
    "String Bean Chicken": 0,
    "Black Pepper Chicken": 0,
    "Seasonal Item": 0,
  });

  const priceMap = {
    Bowl: 8.3,
    Plate: 9.8,
    "Bigger Plate": 11.3,
    "A La Carte": 0.0,
    "Fountain Drink": 2.9,
    "Bottled Drink": 3.4,
    "Chicken Egg Roll": 2.5,
    "Veggie Egg Roll": 2.5,
    "Cream Cheese Rangoon": 2.5,
    "Apple Pie Roll": 2.5,
    "Orange Chicken": 6.5,
    "Honey Walnut Shrimp": 8.4,
    "Grilled Teriyaki Chicken": 6.5,
    "Broccoli Beef": 6.5,
    "Kung Pao Chicken": 6.5,
    "Honey Sesame Chicken": 6.5,
    "Beijing Beef": 6.5,
    "Mushroom Chicken": 6.5,
    "SweetFire Chicken": 6.5,
    "String Bean Chicken": 6.5,
    "Black Pepper Chicken": 8.4,
    "Black Pepper Sirloin Steak": 8.4,
    "Chow Mein": 5.5,
    "Fried Rice": 5.5,
    "White Steamed Rice": 5.5,
    "Super Greens": 5.5,
    "Seasonal Item": 0.0,
  };

  const handlePayClick = () => {
    setNetCost(0); // Reset net cost to zero
    setQuantities(
      Object.keys(quantities).reduce((acc, item) => ({ ...acc, [item]: 0 }), {})
    ); // Reset all quantities to zero
  };

  return (
    <div>
      <h1>Order Total:</h1>
      <div className={styles.layout}>
        <ButtonGrid
          setNetCost={setNetCost}
          priceMap={priceMap}
          quantities={quantities}
          setQuantities={setQuantities}
        />
      </div>
      <BottomPanel netCost={netCost} handlePayClick={handlePayClick} />
    </div>
  );
};

export default CashierPage;
