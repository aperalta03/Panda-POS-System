import React, { useState } from "react";
import styles from "./kiosk_cart.module.css";
import { useRouter } from "next/router";
import { useGlobalState } from "@/app/context/GlobalStateContext";
import TranslateButton from "@/app/components/kiosk/translateButton";

const CartPage = () => {
  const router = useRouter();
  const { currentLanguage, changeLanguage, translations } = useGlobalState();
  const [selectedSauces, setSelectedSauces] = useState([]);

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    changeLanguage(newLanguage);
  };

  const handleSauceToggle = (id) => {
    if (selectedSauces.includes(id)) {
      // If the sauce is already selected, deselect it
      setSelectedSauces(selectedSauces.filter((sauce) => sauce !== id));
    } else {
      // Otherwise, select it
      setSelectedSauces([...selectedSauces, id]);
    }
  };

  // Sample initial cart items
  const initialCart = [
    {
      id: 1,
      type: "BOWL",
      price: 9.5,
      details: ["0.5 Fried Rice", "0.5 Super Greens", "1 Orange Chicken"],
      quantity: 1,
    },
    {
      id: 2,
      type: "A LA CARTE",
      price: 8.0,
      details: ["1 Apple Pie Roll", "1 Honey Sesame Chicken"],
      quantity: 1,
    },
  ];

  const [cart, setCart] = useState(initialCart);

  // Calculate subtotal and tax
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.15;
  const total = subtotal + tax;

  const handleBackToMenu = () => {
    router.push("/kiosk_item");
  };

  const handleStartOver = () => {
    setCart([]); // Clear the cart
  };

  const handlePlaceOrder = () => {
    // Functionality to place the order, e.g., redirect or call API
    setSelectedSauces([]);
    alert("Order placed!");
  };

  // Remove an item from the cart
  const handleRemoveItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // Add an item to the cart (for demonstration, adds a hard-coded item)
  const handleAddItem = () => {
    const newItem = {
      id: Date.now(),
      type: "NEW ITEM",
      price: 5.0,
      details: ["Sample Detail 1", "Sample Detail 2"],
      quantity: 1,
    };
    setCart([...cart, newItem]);
  };

  return (
    <div className={styles.cartContainer}>
      <div className={styles.circle}></div>

      <div className={styles.topBar}>
        <button className={styles.backButton} onClick={handleBackToMenu}>
          <div className={styles.inlineText}>
            <span className={styles.x2}> &gt; </span>
            <span className={styles.backMenu}>
              {translations["Back to Menu"] || "Back to Menu"}
            </span>
          </div>
        </button>

        <button className={styles.startOverButton} onClick={handleStartOver}>
          <div className={styles.inlineText}>
            <span className={styles.x}>X</span>
            <span className={styles.startOver}>
              {translations["Start Over"] || "Start Over"}
            </span>
          </div>
        </button>

        <TranslateButton
          currentLanguage={currentLanguage}
          onLanguageChange={handleLanguageChange}
          customStyles={{ position: "fixed", right: "30px" }}
        />
      </div>

      {/* Scrollable order list container */}
      <div className={styles.scrollableOrderList}>
        {cart.map((item) => (
          <div key={item.id} className={styles.orderItem}>
            <div className={styles.itemHeader}>
              <h2 className={styles.itemType}>
                {item.type} | ${item.price.toFixed(2)}
              </h2>
              <button
                className={styles.removeButton}
                onClick={() => handleRemoveItem(item.id)}
              >
                -
              </button>
            </div>
            <div className={styles.itemDetails}>
              {item.details.map((detail, index) => (
                <p key={index}>
                  <span className={styles.boldX}>x </span>
                  {detail}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.extrasSection}>
        <h3 className={styles.extrasTitle}>
          {translations["Extras:"] || "Extras:"}
        </h3>
        <div className={styles.sauceGrid}>
          {[
            { id: "soy", name: "Soy Sauce", imgSrc: "/soy-sauce.png" },
            {
              id: "sweet_sour",
              name: "Sweet & Sour Sauce",
              imgSrc: "/sweet-sour-sauce.png",
            },
            {
              id: "chili",
              name: "Chili Sauce",
              imgSrc: "/chili-sauce.png",
            },
            {
              id: "teriyaki",
              name: "Teriyaki Sauce",
              imgSrc: "/teriyaki-sauce.png",
            },
            {
              id: "hot_mustard",
              name: "Hot Mustard",
              imgSrc: "/hot-mustard.png",
            },
          ].map((sauce) => (
            <label
              key={sauce.id}
              className={`${styles.sauceCard} ${
                selectedSauces.includes(sauce.id) ? styles.selected : ""
              }`}
            >
              <input
                type="checkbox"
                name="sauce"
                value={sauce.id}
                checked={selectedSauces.includes(sauce.id)}
                onChange={() => handleSauceToggle(sauce.id)} // Handle toggle on change
                className={styles.sauceInput}
              />
              <img
                src={sauce.imgSrc}
                alt={sauce.name}
                className={styles.sauceImage}
              />
              <span className={styles.sauceLabel}>
                {translations[sauce.name] || sauce.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.orderSummary}>
        <button className={styles.placeOrderButton} onClick={handlePlaceOrder}>
          {translations["Place Order"] || "Place Order"}
        </button>

        <div className={styles.priceSummary}>
          <div className={styles.priceDetailsContainer}>
            <div className={styles.priceDetail}>
              <span>{translations["Subtotal:"] || "Subtotal:"}</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className={styles.priceDetail}>
              <span>{translations["Tax:"] || "Tax:"}</span>
              <span>${tax.toFixed(2)}</span>
            </div>
          </div>

          <div className={styles.priceContainer}>
            <div className={styles.totalPrice}>
              <span>{translations["Total |"] || "Total |"} </span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Button to add item for demonstration purposes */}
      <button className={styles.addItemButton} onClick={handleAddItem}>
        {translations["+ Add Item"] || "+ Add Item"}
      </button>
    </div>
  );
};

export default CartPage;
