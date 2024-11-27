import React, { useState, useEffect } from "react";
import styles from "./rec_panel.module.css";
import { useGlobalState } from "@/app/context/GlobalStateContext";

const RecommendationPanel = () => {
  const { menu, cart, setCart, translations } = useGlobalState();
  const [randomItems, setRandomItems] = useState([]);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const getRandomItems = () => {
      const shuffled = [...menu].sort(() => 0.5 - Math.random());
      const selectedItems = shuffled.slice(0, 3);
      const initialQuantities = selectedItems.reduce((acc, item) => {
        acc[item.id] = 0;
        return acc;
      }, {});
      setQuantities(initialQuantities);
      console.log("Selected items:", selectedItems);
      return selectedItems;
    };
    setRandomItems(getRandomItems());
  }, [menu]);
  

  const handleIncrement = (id) => {
    console.log(`Incrementing ${id}`);
    setQuantities((prevQuantities) => {
      console.log(prevQuantities);
      return {
        ...prevQuantities,
        [id]: prevQuantities[id] + 1,
      };
    });
  };
  
  const handleDecrement = (id) => {
    console.log(`Decrementing ${id}`);
    setQuantities((prevQuantities) => {
      console.log(prevQuantities);
      return {
        ...prevQuantities,
        [id]: Math.max(1, prevQuantities[id] - 1),
      };
    });
  };
  

  // Add item to cart
  const handleAddItem = (item) => {
    const quantity = quantities[item.id] || 1; 
    const newItem = {
      id: Date.now(),
      name: item.name || "A LA CARTE",
      price: item.price || 5.0,
      details: item.name || "No details",
      quantity,
    };
    setCart((prevCart) => [...prevCart, newItem]); // Update the cart
  };

  return (
    <div className={styles.itemFrameContainer}>
      {randomItems.map((item) => {
        const uniqueId = item.id;

        return (
          <div key={uniqueId} className={styles.itemFrame}>
            <div className={styles.contentWrapper}>
              <img
                src={item.image}
                alt={item.name}
                className={styles.itemImage}
              />
              <div className={styles.textContent}>
                <h3 className={styles.name}>
                  {translations[item.name] || item.name}
                </h3>
                <p className={styles.calories}>
                  {item.calories} {translations["Calories"] || "Cal."}
                </p>

                {/* Counter for quantity selection */}
                <div className={styles.counterContainer}>
                  <button
                    className={styles.addSub}
                    onClick={() => handleDecrement(uniqueId)}
                  >
                    -
                  </button>
                  <span>{quantities[uniqueId] || 0}</span>
                  <button
                    className={styles.addSub}
                    onClick={() => handleIncrement(uniqueId)}
                  >
                    +
                  </button>
                </div>

                {/* Enter button to add item to cart */}
                <button
                  onClick={() => handleAddItem(item)}
                  className={styles.enterButton}
                >
                  {translations["Enter"] || "Enter"}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecommendationPanel;
