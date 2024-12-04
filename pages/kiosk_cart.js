import React, { useState } from "react";
import styles from "./kiosk_cart.module.css";
import { useRouter } from "next/router";
import { useGlobalState } from "@/app/context/GlobalStateContext";
import TranslateButton from "@/app/components/kiosk/translateButton";
import AccessibilityButton from "./accessButton";
import RecommendationsPanel from "./rec_panel";

import Head from "next/head"; // Import Head for managing the document head

/**
 * The CartPage component renders the checkout page with the customer's current
 * order. It displays the items in the cart, allows the customer to remove items
 * and start over, and provides a button to place the order. Additionally, it
 * displays a panel with recommended items and a summary of the order costs.
 *
 * @author Andrew Popovici
 * @returns {JSX.Element} The rendered CartPage component.
 */
const CartPage = () => {
  const router = useRouter();
  const {
    currentLanguage,
    changeLanguage,
    customerName,
    translations,
    customer10PercentOff,
  } = useGlobalState();
  const [selectedSauces, setSelectedSauces] = useState([]);
  const {
    cart,
    setCart,
    setNumTotalItems,
    numTotalItems,
    removeItemFromCart,
    clearCart,
  } = useGlobalState();
  const { toggleTheme, currentTheme, isPandaMember, toggleSize, isLargeText } =
    useGlobalState();

  /**
   * Handles the language change event by updating the application's current language.
   * @author Brandon Batac
   * @param {Object} e - The event object containing the selected language value.
   * @property {string} e.target.value - The new language code to set.
   * @returns {void}
   */
  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    changeLanguage(newLanguage);
  };

  /**
   * Toggles the inclusion of a sauce in the current order.
   * @author Brandon Batac
   * @param {number} id - The ID of the sauce to toggle.
   * @returns {void}
   */
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
  const discount = customer10PercentOff ? subtotal * 0.1 : 0; // Calculate 10% discount
  const discountedSubtotal = subtotal - discount;
  const tax = discountedSubtotal * 0.0625;
  const total = discountedSubtotal + tax;

  console.log("Cart items:", cart);
  console.log("Subtotal:", subtotal);
  console.log("Tax:", tax);
  console.log("Total:", total);

  const handleBackToMenu = () => {
    router.push("/kiosk_item");
  };

  /**
   * Resets the cart and the number of total items to 0.
   * This is used when the user selects the "Start Over" button.
   * @author Andrew Popovici
   * @returns {void}
   */
  const handleStartOver = () => {
    setCart([]); // Clear the cart
    setNumTotalItems(0);
  };

  /**
   * Handles the payment process by creating an orderDetails object with the
   * current sale information and sending it to the server to update the sales record.
   * If the order is successfully saved, it resets the net cost, item quantities, and orders.
   *
   * @async
   * @function
   * @returns {void} Shows an alert if order details are incomplete or if there is an error during the fetch.
   *
   * @throws {Error} Logs an error if the order fails to save or if there is an error during the fetch.
   *
   * @author Andrew Popovici
   */
  const handlePlaceOrder = async () => {
    const employeeID = 1;
    var orders = [];
    cart.forEach((item) => {
      orders = orders.concat({
        plateSize: item.type,
        components: item.checkout,
      });
    });
    const now = new Date();
    const saleDate = now.toLocaleDateString("en-CA"); //need this for the correct time zone
    const saleTime = now.toTimeString().split(" ")[0];
    console.log(saleDate);
    const orderDetails = {
      saleDate,
      saleTime,
      totalPrice: total.toFixed(2),
      employeeID: employeeID, //defaulting kiosk employee id to 1, potentially subject to change
      orders: orders,
      source: "Kiosk",
    };

    if (!saleDate || !saleTime || !employeeID || !orderDetails.orders.length) {
      console.error("Missing critical order details:", {
        saleDate,
        saleTime,
        employeeID,
        orders: orderDetails.orders,
      });
      alert("Order details are incomplete. Please try again.");
      return;
    }

    try {
      const response = await fetch(
        `${window.location.origin}/api/updateSalesRecord`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderDetails),
        }
      );

      if (response.ok) {
        console.log("Order saved successfully");
      } else {
        const errorData = await response.json();
        console.error("Failed to save order", errorData);
      }
    } catch (error) {
      console.error("Error:", error);
    }
    router.push("/thank-you");
    setNumTotalItems(0);
    clearCart();
  };

  /**
   * Removes an item from the cart and decrements the total number of items
   * in the cart by 1.
   * @param {number} id - The id of the item to remove.
   * @author Andrew Popovici
   */
  const handleRemoveItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
    setNumTotalItems(numTotalItems - 1);
  };

  return (
    <>
      <Head>
        {/* Add or update the page title */}
        <title>Cart Page</title>
        {/* Add other metadata if needed */}
        <meta
          name="description"
          content="Finalize and View selections to Chechkout"
        />
      </Head>
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
                  const price = rest.pop();
                  const description = rest.join(" ");
                  const translatedDescription =
                    translations[description] || description;
                  return (
                    <p key={index}>
                      <span className={styles.boldX}>x </span>
                      {`${quantity} ${translatedDescription} ${price}`}
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
                    {currentLanguage === "en"
                      ? sauce.name
                      : translations[sauce.name]}
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
            <h1 className={styles.welcomeHeader}>
              {customerName === "Guest"
                ? currentLanguage === "en"
                  ? "Welcome, Guest"
                  : translations["Welcome, Guest"]
                : currentLanguage === "en"
                ? "Welcome, " + customerName
                : translations["Welcome, "] + customerName}
            </h1>
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
                {customer10PercentOff && (
                  <div className={styles.priceDetail}>
                    <span>
                      {translations["Discount (10%):"] || "Discount (10%):"}
                    </span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
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
    </>
  );
};

export default CartPage;
