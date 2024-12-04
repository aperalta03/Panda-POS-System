import React, { useState, useEffect, useContext } from "react";
import styles from "./kiosk_item.module.css";
import { useRouter } from "next/router";
import { useGlobalState } from "../app/context/GlobalStateContext";
import TranslateButton from "@/app/components/kiosk/translateButton";
import { Margin } from "@mui/icons-material";

import AccessibilityButton from "./accessButton";
import Head from "next/head"; // Import Head for managing the document head

/**
 * TopBar component for the kiosk page.
 * Displays panel information, a tracker of selected items, and utility buttons such as translation and accessibility.
 *
 * @component
 * @author Uzair Khan
 *
 * @param {Object} props - Component properties.
 * @param {function} props.handleOptionsClick - Callback to handle navigation to the options page.
 * @returns {JSX.Element} The rendered TopBar component.
 */
const TopBar = ({ handleOptionsClick }) => {
  const router = useRouter();
  const { currentLanguage, changeLanguage, translations } = useGlobalState();
  const {
    cart,
    addItemToCart,
    removeItemFromCart,
    clearCart,
    newItem,
    removeNewItem,
    setCart,
    numTotalItems,
    customerName,
  } = useGlobalState();

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.15;
  const total = subtotal + tax;
  console.log(customerName);

  /**
   * Handles the language change event by updating the application's current language.
   * @param {Object} e - The event object containing the selected language value.
   * @property {string} e.target.value - The new language code to set.
   * @returns {void}
   * @author Brandon Batac
   */
  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    changeLanguage(newLanguage);
  };

  return (
    <div className={styles.KioskItemPanel}>
      <div className={styles.leftButtons}>
        <h1 className={styles.welcomeHeader}>
          {customerName === "Guest"
            ? currentLanguage === "en"
              ? "Welcome, Guest"
              : translations["Welcome, Guest"]
            : currentLanguage === "en"
            ? "Welcome, " + customerName
            : translations["Welcome, "] + customerName}
        </h1>
        <div className={styles.cartAndPriceContainer}>
          <button
            className={styles.circleButton}
            onClick={() => {
              router.push("/kiosk_cart");
            }}
          >
            <img
              src="/cart2_img.png"
              alt="Cart Icon"
              className={styles.cartImage}
            />
          </button>
          <div className={styles.cartItemCount}>{numTotalItems}</div>
          <h1 className={styles.priceLabel}>${total.toFixed(2)}</h1>
        </div>
        <div className={styles.gearButtonContainer}>
          <AccessibilityButton />
        </div>
        <TranslateButton
          currentLanguage={currentLanguage}
          onLanguageChange={handleLanguageChange}
          customStyles={{ margin: "10px" }}
        />
      </div>
      <div className={styles.leftPanel}>
        <div className={styles.rightButtons}>
          <button
            className={styles.checkOut}
            onClick={() => {
              router.push("/kiosk_cart");
            }}
          >
            {translations["Checkout"] || "Checkout"}
          </button>
          <button
            className={styles.genStartOver}
            onClick={() => {
              clearCart();
              router.push("/kiosk");
            }}
          >
            <div className={styles.inlineText}>
              <span className={styles.x}>X</span>
              <span className={styles.startOver}>
                {translations["Start Over"] || "Start Over"}
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * RecommendedItem Component
 *
 * Fetches the top-selling item of the month from the server, matches it with the global menu data,
 * and displays its details. Handles loading, error states, and supports multilingual translations.
 * @author Uzair Khan
 *
 * @function RecommendedItem
 * @returns {JSX.Element} JSX rendering the recommended item panel.
 *
 * @typedef {Object} MenuItem
 * @property {string} name - The name of the menu item.
 * @property {string} description - The description of the menu item.
 * @property {number} calories - The calorie count of the menu item.
 * @property {string} designation - The designation or category of the menu item.
 * @property {string} image - URL to the image of the menu item.
 *
 * @typedef {Object} TopItem
 * @property {string} item_name - The name of the top-selling item fetched from the server.
 *
 * @state {TopItem|null} topItem - Stores the name of the top-selling item.
 * @state {boolean} loading - Tracks the loading status of the API fetch operation.
 * @state {string|null} error - Stores any error messages from the fetch operation.
 *
 * @global {Object} useGlobalState - Provides access to global state variables like `menu`, `translations`, etc.
 * @global {Array<MenuItem>} menu - The global menu list containing all menu items and their details.
 */
const RecommendedItem = () => {
  const [topItem, setTopItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentLanguage, changeLanguage, translations } = useGlobalState();

  const { menu } = useGlobalState();
  useEffect(() => {
    /**
     * Fetches the top-selling item from the server and updates the component state.
     * @author Uzair Khan
     * @returns {Promise<void>}
     * @throws {Error} If the fetch fails or the response is not ok.
     */
    const fetchTopItem = async () => {
      try {
        const response = await fetch("/api/top-selling-item");
        if (!response.ok) {
          throw new Error("Failed to fetch top-selling item");
        }
        const data = await response.json();
        setTopItem(data.data);
      } catch (err) {
        console.error("Error fetching top-selling item:", err);
        setError("Failed to load recommended item.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopItem();
  }, []);

  if (loading)
    return (
      <p className={styles.recLabel}>
        {translations["Loading recommended item..."] ||
          "Loading recommended item..."}
      </p>
    );
  if (error) return <p className={styles.error}>{error}</p>;

  // Match topItem fetched with global vars to get information
  const matchedItem = menu.find((item) => item.name === topItem?.item_name);
  if (!matchedItem) {
    return (
      <p>
        {translations["Item not found in the menu."] ||
          "Item not found in the menu."}
      </p>
    );
  }
  //Get item details
  const { name, calories, description, designation, image } = matchedItem;

  return (
    <div className={styles.recommendedItemPanel}>
      <div className={styles.recLeftPanel}>
        <h2 className={styles.recLabel}>
          {translations["This month's hot item"] || "This month's hot item"}
        </h2>
        <div className={styles.itemDetails}>
          <p className={styles.recItemName}>{translations[name] || name}</p>
          <p className={styles.recItemDescription}>{description}</p>
          <div className={styles.itemInfo}>
            <p className={styles.recItemCalories}>
              {translations["Calories"] + ": " || "Calories: "}{" "}
              {calories || "N/A"} |
              {translations[" Designation: "] || " Designation: "}{" "}
              {translations[designation] || "None"}
            </p>
          </div>
        </div>
      </div>

      <div className={styles.recRightPanel}>
        <img
          src={matchedItem.image}
          alt={matchedItem.name}
          className={styles.itemRecImg}
        />
      </div>
    </div>
  );
};

/**
 * KioskItemPanel component for the kiosk page.
 * Displays a grid of panels representing the different menu items available to order.
 * Each panel displays the name, price, and details of the item, with a button to navigate to the item's order page.
 * @author Uzair Khan
 * @returns {JSX.Element} The rendered KioskItemPanel component.
 */
const KioskItemPanel = ({}) => {
  const router = useRouter();
  const { currentLanguage, changeLanguage, translations } = useGlobalState();
  return (
    <div className={styles.midPanel}>
      <div className={styles.itemButtons}>
        <RecommendedItem />

        <button
          onClick={() => {
            router.push("/kiosk_bowl");
          }}
        >
          <p className={styles.itemLeft}>
            {translations["Bowl | $9.50"] || "Bowl | $9.50"}
          </p>
          <div className={styles.itemRight}>
            <div className={styles.itemText}>
              <p>{translations["1 Side"] || "1 Side"}</p>
              <p>{translations["1 Entree"] || "1 Entree"}</p>
            </div>
            <img src="/bowl_img.png" alt="" className={styles.itemImg} />
          </div>
        </button>
        <button
          onClick={() => {
            router.push("/kiosk_plate");
          }}
        >
          <p className={styles.itemLeft}>
            {translations["Plate | $11.50"] || "Plate | $11.50"}
          </p>
          <div className={styles.itemRight}>
            <div className={styles.itemText}>
              <p>{translations["1 Side"] || "1 Side"}</p>
              <p>{translations["2 Entree"] || "2 Entree"}</p>
            </div>
            <img
              src="/plate_img.png"
              alt="Panda Express Plate"
              className={styles.itemImg}
            />
          </div>
        </button>
        <button
          onClick={() => {
            router.push("/kiosk_bigger_plate");
          }}
        >
          <p className={styles.itemLeft}>
            {translations["Bigger Plate | $13.50"] || "Bigger Plate | $13.50"}
          </p>
          <div className={styles.itemRight}>
            <div className={styles.itemText}>
              <p>{translations["1 Side"] || "1 Side"}</p>
              <p>{translations["3 Entree"] || "3 Entree"}</p>
            </div>
            <img
              src="/bigger_plate_img.png"
              alt="Panda Express Bigger Plate"
              className={styles.itemImg}
            />
          </div>
        </button>
        <button
          onClick={() => {
            router.push("/kiosk_a_la_carte");
          }}
        >
          <p className={styles.itemLeft}>
            {translations["A La Carte"] || "A La Carte"}
          </p>
          <div className={styles.itemRight}>
            <div className={styles.itemText}>
              <p>{translations["Any Food Item"] || "Any Food Item"}</p>
              <p>{translations["Any Drink"] || "Any Drink"}</p>
            </div>
            <img
              src="/a_la_carte_img.png"
              alt="Panda Express A La Carte"
              className={styles.itemImg}
            />
          </div>
        </button>
      </div>
    </div>
  );
};

/**
 * BottomBar component for the kiosk page.
 * Displays a reminder to choose a meal above.
 *
 * @component
 * @author Uzair Khan
 *
 * @returns {JSX.Element} The rendered BottomBar component.
 */
const BottomBar = () => {
  const { currentLanguage, changeLanguage, translations } = useGlobalState();
  return (
    <div className={styles.bottomPanel}>
      <h1 className={styles.bottomHeader}>
        {translations["Choose A Meal Above"] || "Choose A Meal Above"}
      </h1>
    </div>
  );
};

/**
 * KioskItemPage component serves as the main page for the kiosk application.
 * It displays a circle with the number 1, a top header with a translate button and an accessibility button, a middle panel with the item selection buttons, and a bottom panel with a reminder to choose a meal above.
 * It also handles the state for the options menu and toggles the options menu when the translate button is clicked.
 *
 * @component
 * @author Uzair Khan
 *
 * @returns {JSX.Element} The rendered kiosk page component.
 */
const KioskItemPage = () => {
  const router = useRouter();
  const [isOptionsOpens, setIsOptionsOpen] = useState(false);
  const { toggleTheme, currentTheme, isPandaMember, toggleSize, isLargeText } =
    useGlobalState();

  /**
   * Toggles the state of the options menu.
   * If the menu is currently open, it will be closed, and vice versa.
   * This function is used to handle the click event for opening or closing the options menu.
   * @author Uzair Khan
   * @returns {void}
   */
  const handleOptionsClick = () => {
    setIsOptionsOpen(!isOptionsOpen);
  };

  return (
    <>
      <Head>
        {/* Add or update the page title */}
        <title>Item Order Selection</title>
        {/* Add other metadata if needed */}
        <meta
          name="description"
          content="Start an Order by Selecting a Bigger Plate"
        />
      </Head>
      <div className={styles.layout}>
        <div className={styles.circle}>
          <p>1</p>
        </div>

        <div className={styles.topHeader}>
          <TopBar>handleOptionsClick = {handleOptionsClick}</TopBar>
        </div>
        <div className={styles.midPanel}>
          <KioskItemPanel />
        </div>
        <div className={styles.bottomPanel}>
          <BottomBar />
        </div>
      </div>
    </>
  );
};

export default KioskItemPage;
