import React, { useState } from "react";
import styles from "./kiosk_cart.module.css";
import { useRouter } from "next/router";
import { useGlobalState } from "@/app/context/GlobalStateContext";
import TranslateButton from "@/app/components/kiosk/translateButton";
import AccessibilityButton from "./accessButton";
import RecommendationsPanel from "./rec_panel";

const CartPage = () => {
  const router = useRouter();
  const { currentLanguage, changeLanguage, translations } = useGlobalState();
  const [selectedSauces, setSelectedSauces] = useState([]);
  const { cart, setCart, setNumTotalItems, numTotalItems } = useGlobalState();
  const { toggleTheme, currentTheme, isPandaMember, toggleSize, isLargeText } =
    useGlobalState();

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    changeLanguage(newLanguage);
  };

  const handleSauceToggle = (id) => {
    if (selectedSauces.includes(id)) {
      setSelectedSauces(selectedSauces.filter((sauce) => sauce !== id));
    } else {
      setSelectedSauces([...selectedSauces, id]);
    }
  };

  // Calculate subtotal and tax
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.15;
  const total = subtotal + tax;

  console.log("Cart items:", cart);
  console.log("Subtotal:", subtotal);
  console.log("Tax:", tax);
  console.log("Total:", total);

  const handleBackToMenu = () => {
    router.push("/kiosk_item");
  };

  const handleStartOver = () => {
    setCart([]); // Clear the cart
    setNumTotalItems(0);
  };

  const handlePlaceOrder = () => {
    alert("Order placed!");
    router.push("/thank-you");
    setNumTotalItems(0);
    setCart([]);
  };

  const handleRemoveItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
    setNumTotalItems(numTotalItems - 1);
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

        <div className={styles.accessPosition}>
          <AccessibilityButton />
        </div>
      </div>

      {/* Scrollable order list container */}
      <div className={styles.scrollableOrderList}>
        {cart.map((item) => (
          <div key={item.id} className={styles.orderItem}>
            <div className={styles.itemHeader}>
              <h2 className={styles.itemType}>
                {translations[item.type]?.toUpperCase() || item.type} | $
                {item.price.toFixed(2)}
              </h2>
              <button
                className={styles.removeButton}
                onClick={() => removeItemFromCart(item.id)}
              >
                -
              </button>
            </div>
            <div className={styles.itemDetails}>
              {item.details.map((detail, index) => {
                const [quantity, ...rest] = detail.split(" ");
                const description = rest.join(" ");
                const translatedDescription =
                  translations[description] || description;
                return (
                  <p key={index}>
                    <span className={styles.boldX}>x </span>
                    {`${quantity} ${translatedDescription}`}
                  </p>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Extras Section */}
      <div className={styles.extrasSection}>
        <h3 className={styles.extrasTitle}>
          {translations["Don't Forget to add sauce"] ||
            "Don't Forget to add sauce"}
        </h3>
        <div className={styles.sauceGrid}>
          {[
            { id: "soy", name: "Soy Sauce", imgSrc: "/soy-sauce.png" },
            {
              id: "sweet_sour",
              name: "Sweet & Sour Sauce",
              imgSrc: "/sweet-sour-sauce.png",
            },
            { id: "chili", name: "Chili Sauce", imgSrc: "/chili-sauce.png" },
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
                onChange={() => handleSauceToggle(sauce.id)}
                className={styles.sauceInput}
              />
              <div className={styles.sauceContent}>
                <img
                  src={sauce.imgSrc}
                  alt={sauce.name}
                  className={styles.sauceImage}
                />
                <span className={styles.sauceLabel}>
                  {translations[sauce.name] || sauce.name}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Bottom Container */}
      <div className={styles.bottomContainer}>
        <div className={styles.recPanel}>
          <RecommendationsPanel />
        </div>
        <div className={styles.orderSummary}>
          <button
            className={styles.placeOrderButton}
            onClick={handlePlaceOrder}
          >
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
      </div>
    </div>
  );
};

export default CartPage;
