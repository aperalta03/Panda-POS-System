import React, { useState, useEffect } from "react";
import styles from "./cashier.module.css";

const ButtonGrid = ({ addOrderToPanel }) => {
  // Define initial state for each item quantity
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
    "Fried Rice"
  ];

  const plateSizes = [
    "Bowl",
    "Plate",
    "Bigger Plate",
    "A La Carte",
  ]

  const foodItems = [
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
  ]

  const [quantities, setQuantities] = useState(
    menuItems.reduce((acc, item) => ({ ...acc, [item]: 0 }), {})
  );

  const [disabledItems, setDisabledItems] = useState([]); //use state for disabling items
  const [enabledItems, setEnabledItems] = useState([]);  //use state for enabling itemd
  const [plateQuantity, setPlateQuantity] = useState(0); //use state for num of items in a plate order
  const [currPlate, setCurrPlate] = useState("");  //use state for current plate set
  const [initialItemCounts, setInitialItemCounts] = useState({}); //use state for initial item count after each order
  const [isEnterEnabled, setIsEnterEnabled] = useState(false); // New state for Enter button
  //const [orders, setOrders] = useState([]); // State to hold orders
  const [associatedItems, setAssociatedItems] = useState([]);

  // Function to handle quantity updates (+ and -)
  const updateQuantity = (item, amount) => {
    const incrementAmount = sides.includes(item) ? amount * 0.5 : amount;

    if (amount > 0 || (initialItemCounts[item] <= quantities[item])) {
      setQuantities((prev) => ({ //Setting quantity
        ...prev,
        [item]: Math.max(prev[item] + incrementAmount, 0), // Prevent negative quantities
      }));
      
      if (foodItems.includes(item)) { //setting item count for a plate order
        setPlateQuantity((prev) => {
          const newPlateQuantity = Math.max(prev + incrementAmount, 0);
          checkQuantity(newPlateQuantity, currPlate);
          return newPlateQuantity;
        });
        setAssociatedItems((prev) => [...prev, item]);
      }

      if(item === "A La Carte") { // A La Carte Handling
        setCurrPlate("A La Carte");
        setIsEnterEnabled(true);
        const itemsToDisable = ["Bowl", "Plate", "Bigger Plate", "A La Carte"];
        setDisabledItems(itemsToDisable);
      } 
      else if(plateSizes.includes(item)) { // All other plate items handling
        setCurrPlate(item);
        const itemsToDisable = ["Bowl", "Plate", "Bigger Plate", "A La Carte", "Chicken Egg Roll", "Veggie Egg Roll",
          "Cream Cheese Rangoon","Apple Pie Roll", "Fountain Drink", "Bottled Drink"];
        setDisabledItems(itemsToDisable);
      }
    } else {
      alert("This action cannot be performed on a previous order item"); //alert for decrementing a previous order item
    }
  };

  // handles minus button clicks
  const handleMinusClick = (item) => {
    updateQuantity(item, -1);
  };

  //checks if num of items meets requirements and resets as needed
  const checkQuantity =  (currentPlateQuantity, currentPlate)  => {
    if (currentPlateQuantity === 2 && currentPlate === "Bowl") {
      //console.log("Bowl order created, needs to be reset");
      addOrderToPanel(currentPlate, [...associatedItems]);
      const itemsToEnable = plateSizes;
      const itemsToDisable = foodItems;
      setDisabledItems(itemsToDisable);
      setEnabledItems(itemsToEnable);
      setCurrPlate("");
      setPlateQuantity(0);
      setAssociatedItems([]);
    }
    else if (currentPlateQuantity === 3 && currentPlate === "Plate") {
      //console.log("Plate order created, needs to be reset");
      addOrderToPanel(currentPlate, [...associatedItems]);
      const itemsToEnable = plateSizes;
      const itemsToDisable = foodItems;
      setDisabledItems(itemsToDisable);
      setEnabledItems(itemsToEnable);
      setCurrPlate("");
      setPlateQuantity(0);
      setAssociatedItems([]);
    }
    else if (currentPlateQuantity === 4 && currentPlate === "Bigger Plate") {
      console.log("Bigger Plate order created, needs to be reset");
      addOrderToPanel(currentPlate, [...associatedItems]);
      const itemsToEnable = plateSizes;
      const itemsToDisable = foodItems;
      setDisabledItems(itemsToDisable);
      setEnabledItems(itemsToEnable);
      setCurrPlate("");
      setPlateQuantity(0);
      setAssociatedItems([]);
    }
  };

  //handles Enter button clicks
  const handleEnterClick = () => {
    if (currPlate === "A La Carte") {
      console.log("Finalizing A La Carte order");
      addOrderToPanel(currPlate, [...associatedItems]);
      const itemsToEnable = plateSizes;
      const itemsToDisable = foodItems;
      setDisabledItems(itemsToDisable);
      setEnabledItems(itemsToEnable);
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


// Left Panel to display orders
const OrderPanel = ({ orders, onDelete }) => (
  <div className={styles.orderPanel}>
    {orders.map((order, index) => (
      <div key={index} className={`${styles.orderRow} ${index % 2 === 0 ? styles.evenRow : styles.oddRow}`}>
        <span>{order.plateSize} ({order.items.join(", ")})</span>
        <button onClick={() => onDelete(index)} className={styles.deleteButton}>Delete</button>
      </div>
    ))}
  </div>
);

//creating bottom panel for buttons, ordering, and cost labels
const BottomPanel = () => {
  return (
    <div className = {styles.bottomPanel}>
      <div className = {styles.leftPanel}>
        <h2 className = {styles.netLabel}>Net: $0.00</h2>
        <h2 className = {styles.taxLabel}>Total: $0.00</h2>
        <h1 className = {styles.totalLabel}>Total: $0.00</h1>
      </div>

      <button className = {styles.payButton}>Pay</button>

      <div className = {styles.rightPanel}>
        <button className = {styles.addItem}>Add Menu Item</button>
        <button className = {styles.closeButton}>Log Out</button>
      </div>

    </div>
  );
};

const priceMap = {
  "Bowl": 8.30,
  "Plate": 9.80,
  "Bigger Plate": 11.30,
  "A La Carte": 0.00,
  "Fountain Drink": 2.90,
  "Bottled Drink": 3.40,
  "Chicken Egg Roll": 2.50,
  "Veggie Egg Roll": 2.50,
  "Cream Cheese Rangoon": 2.50,
  "Apple Pie Roll": 2.50,
  "Orange Chicken": 6.50,
  "Honey Walnut Shrimp": 8.40,
  "Grilled Teriyaki Chicken": 6.50,
  "Broccoli Beef": 6.50,
  "Kung Pao Chicken": 6.50,
  "Honey Sesame Chicken": 6.50,
  "Beijing Beef": 6.50,
  "Mushroom Chicken": 6.50,
  "SweetFire Chicken": 6.50,
  "String Bean Chicken": 6.50,
  "Black Pepper Chicken": 8.40,
  "Black Pepper Sirloin Steak": 8.40,
  "Chow Mein": 5.50,
  "Fried Rice": 5.50,
  "White Steamed Rice": 5.50,
  "Super Greens": 5.50,
};



/*const calculateCosts = (plateSize) => {
  const price = priceMap[plateSize] || 0;
  const newNetCost = netCost + price;
  const newTaxCost = newNetCost * 0.0625;
  setNetCost(newNetCost);
  setTaxCost(newTaxCost);
  setTotalCost(newNetCost + newTaxCost);
};*/



const CashierPage = () => {
  //const [orders, setOrders] = useState([]); // Store orders here
  //const [associatedItems, setAssociatedItems] = useState([]); // Store associated items here
  const [orders, setOrders] = useState([]);

  const addOrderToPanel = (plateSize, items) => {
    setOrders(prev => [...prev, { plateSize, items }]);
  };

  const deleteOrder = (index) => {
    setOrders(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h1>Order Total:</h1>
      <div className={styles.layout}>
      <ButtonGrid addOrderToPanel={addOrderToPanel} />
      </div>
      <OrderPanel orders={orders} onDelete={deleteOrder} />
      <BottomPanel />
    </div>
  );
};

export default CashierPage;
