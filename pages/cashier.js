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

  const [disabledItems, setDisabledItems] = useState(foodItems);
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
        checkQuantity(newPlateQuantity, currPlate, [...associatedItems, item]);
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

  const checkQuantity = (currentPlateQuantity, currentPlate, items) => {
    if (
      (currentPlateQuantity === 2 && currentPlate === "Bowl") ||
      (currentPlateQuantity === 3 && currentPlate === "Plate") ||
      (currentPlateQuantity === 4 && currentPlate === "Bigger Plate")
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
      addOrderToPanel("A La Carte", updatedItems);

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
          (item !== "Seasonal Item" || seasonalItemActive) && (
        <div key={item} className={styles.gridItem}>
          <button
            onClick={() => updateQuantity(item, 1)}
            className={`${styles.itemButton} ${
              disabledItems.includes(item) ? styles.itemButtonDisabled : ""
            } ${enabledItems.includes(item) ? styles.itemButtonEnabled : ""}`}
            disabled={disabledItems.includes(item)}
          >
            {item === "Seasonal Item" ? seasonalItemName : item} {/* Use seasonal item name */}
          </button>
          <span className={styles.quantity}>{quantities[item]}</span>
          {!plateSizes.includes(item) && (
            <button
              onClick={() => updateQuantity(item, -1)}
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
        )
      ))}
    </div>
  );
};



const BottomPanel = ({ netCost, handlePayClick, handleSeasonalAddDelete, seasonalItemActive}) => (
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
      <button onClick={handleSeasonalAddDelete} className={styles.addItem}>
        {seasonalItemActive ? "Delete Menu Item" : "Add Menu Item"}
      </button>
      <button className={styles.closeButton}>Log Out</button>
    </div>
  </div>
);

const OrderPanel = ({ orders, onDelete, seasonalItemName }) => {
  return (
    <div className={styles.orderPanel}>
      {orders.map((order, index) => (
        <div key={index} className={styles.orderRow}>
          <span>
            {order.plateSize} ({order.items.map((item) => 
             item === "Seasonal Item" ? seasonalItemName : item
            ).join(", ")})
          </span>
          <button
            onClick={() => onDelete(index)}
            className={styles.deleteButton}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

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

  const [orders, setOrders] = useState([]);

  const [priceMap, setPriceMap] = useState ({
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
  });

  const [itemIngredientsMap, setItemIngredientsMap] = useState({});
  const [seasonalItemName, setSeasonalItemName] = useState("Seasonal Item");

  const handlePayClick = () => {
    setNetCost(0); // Reset net cost to zero
    setQuantities(
      Object.keys(quantities).reduce((acc, item) => ({ ...acc, [item]: 0 }), {})
    ); // Reset all quantities to zero
    setOrders([]); // Clear all orders
  };

  const addOrderToPanel = (plateSize, items) => {
    setOrders((prevOrders) => [...prevOrders, { plateSize, items }]);
  };

  const deleteOrder = (index) => {
    const orderToDelete = orders[index];
    const orderCost =
      orderToDelete.plateSize === "A La Carte"
        ? orderToDelete.items.reduce((total, item) => total + priceMap[item], 0)
        : priceMap[orderToDelete.plateSize];

    setNetCost((prev) => prev - orderCost);

    const updatedQuantities = { ...quantities };
    updatedQuantities[orderToDelete.plateSize] -= 1;
    orderToDelete.items.forEach((item) => {
      updatedQuantities[item] = Math.max((updatedQuantities[item] || 0) - 1, 0);
    });
    setQuantities(updatedQuantities);

    setOrders((prevOrders) => prevOrders.filter((_, i) => i !== index));
  };

  const [seasonalItemActive, setSeasonalItemActive] = useState(false);
  const handleSeasonalAddDelete = () => {
    if (seasonalItemActive) {
      setSeasonalItemName("Seasonal Item");
      setPriceMap((prevPriceMap) => ({
        ...prevPriceMap,
        ["Seasonal Item"]: 0.0,
      }));
      setItemIngredientsMap((prevItemIngredientsMap) => {
        const { ["Seasonal Item"]: _, ...newMap } = prevItemIngredientsMap;
        return newMap;
      });
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        ["Seasonal Item"]: 0,
      }));
      setSeasonalItemActive(false);
    }
    else {
      const itemName = prompt("Enter the seasonal item name:")
      const itemPrice = parseFloat(prompt("Enter the price of the seasonal item:"));
      if (isNaN(itemPrice)) {
        alert("Invalid price entered. Please try again.");
        return;
      }
      
      setSeasonalItemName(itemName); 
      const itemIngredients = prompt("Enter the seasonal item ingredients (seperated by commas):")

      setPriceMap((prevPriceMap) => ({
        ...prevPriceMap,
        ["Seasonal Item"]: itemPrice,
      }));

      setItemIngredientsMap((prevItemIngredientsMap) => ({
        ...prevItemIngredientsMap,
        [itemName]: itemIngredients.split(",").map((ingredient) => ingredient.trim()),
      }));

      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        ["Seasonal Item"]: 0,
      }));

      setSeasonalItemActive(true);
    }

  };

  return (
    <div>
      <h1>Order Total:</h1>
      <div className={styles.layout}>
        <OrderPanel orders={orders} onDelete={deleteOrder}  seasonalItemName={seasonalItemName} />
        <ButtonGrid
          setNetCost={setNetCost}
          priceMap={priceMap}
          quantities={quantities}
          setQuantities={setQuantities}
          addOrderToPanel={addOrderToPanel}
          seasonalItemName={seasonalItemName} 
          seasonalItemActive={seasonalItemActive}
        />
      </div>
      <BottomPanel 
        netCost={netCost} 
        handlePayClick={handlePayClick} 
        handleSeasonalAddDelete = {handleSeasonalAddDelete}
        seasonalItemActive= {seasonalItemActive} 
       />
    </div>
  );
};

export default CashierPage;
