import React, { useState, useEffect } from "react";
import styles from "./cashier.module.css";

const ButtonGrid = () => {
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

  const [quantities, setQuantities] = useState(
    menuItems.reduce((acc, item) => ({ ...acc, [item]: 0 }), {})
  );

  // Function to handle quantity updates
  const updateQuantity = (item, amount) => {
    setQuantities((prev) => ({
      ...prev,
      [item]: Math.max(prev[item] + amount, 0), // Prevent negative quantities
    }));
  };

  return (
    <div className={styles.buttonGrid}>
      {menuItems.map((item) => (
        <div key={item} className={styles.gridItem}>
          <button
            onClick={() => updateQuantity(item, 1)}
            className={styles.itemButton}
          >
            {item}
          </button>
          <span className={styles.quantity}>{quantities[item]}</span>
          <button
            onClick={() => updateQuantity(item, -1)}
            className={styles.minusButton}
          >
            –
          </button>
        </div>
      ))}
    </div>
  );
};

// Checkout Block
const CheckoutSession = () => {
  return (
    <div></div>
  )
}

const CashierPage = () => {
  return (
    <div>
      <h1>Order Total:</h1>
      <ButtonGrid />
    </div>
  );
};

export default CashierPage;
