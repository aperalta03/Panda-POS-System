import React, { useState, useEffect, useContext } from "react";
import styles from "./kiosk_a_la_carte.module.css";
import { useRouter } from "next/router";
import { useGlobalState } from "../app/context/GlobalStateContext"; //import global state
import ItemFrame from "./itemFrameALaCarte";
import TranslateButton from "@/app/components/kiosk/translateButton";
import AccessibilityButton from './accessButton';

import Head from "next/head"; // Import Head for managing the document head

/**
 * TopBar component for the kiosk page.
 * Displays panel information, a tracker of selected items, and utility buttons such as translation and accessibility.
 * 
 * @component
 * @author Uzair Khan
 * 
 * @param {Object} props - Component properties.
 * @param {function} props.handleCartClick - Callback to handle navigation to the cart.
 * @param {number} props.numTrackedSides - Number of tracked side items.
 * @param {number} props.numTrackedEntrees - Number of tracked entree items.
 * @param {number} props.numTrackedOthers - Number of tracked other items.
 * @returns {JSX.Element} The rendered TopBar component.
 */
const TopBar = ({
  handleCartClick,
  numTrackedSides,
  numTrackedEntrees,
  numTrackedOthers,
}) => {
  const router = useRouter();
  const { currentLanguage, changeLanguage, translations, numTotalItems } = useGlobalState();

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

  return (
    <div className={styles.KioskItemPanel}>
      <div className={styles.leftTopPanel}>
        <h1 className={styles.plateName}>
          {translations["A La Carte"] || "A La Carte"}
        </h1>
        <h3 className={styles.selectLabel}>
          {translations["Select:"] || "Select:"}
        </h3>
        <h3 className={styles.sideLabel}>
          {translations["Any Item"] || "Any Item"}
        </h3>
        <h3 className={styles.entreeLabel}>
          {translations["Any Drink"] || "Any Drink"}
        </h3>
      </div>
      <div className={styles.rightTopPanel}>
        <div className={styles.rightTopRow}>
          <TranslateButton
            currentLanguage={currentLanguage}
            onLanguageChange={handleLanguageChange}
            customStyles={{}}
          />
          <button className={styles.checkOut} onClick={handleCartClick}>
            <img src="/cart2_img.png" alt="Cart" className={styles.cartImage} />
          </button>
          <div className={styles.cartItemCount}>{numTotalItems}</div>
          <AccessibilityButton />
        </div>
        <div className={styles.quantContainer}>
          <div className={styles.sideContainer}>
            <h2 className={styles.sideQuant}>{numTrackedSides}</h2>
            <h2 className={styles.sideQuantLabel}>
              {translations["Side"] || "Side"}
            </h2>
          </div>
          <div className={styles.entreeContainer}>
            <h2 className={styles.entreeQuant}>{numTrackedEntrees}</h2>
            <h2 className={styles.entreeQuantLabel}>
              {translations["Entree"] || "Entree"}
            </h2>
          </div>
          <div className={styles.otherContainer}>
            <h2 className={styles.otherQuant}>{numTrackedOthers}</h2>
            <h2 className={styles.otherQuantLabel}>
              {translations["Other"] || "Other"}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * This component serves as the main page for the kiosk application, allowing users to select items from the menu.
 * It renders a sticky top bar with a cart icon and a sticky bottom bar with a back to menu button and a done button.
 * Based on the `currentStep` state, it renders a different set of item frames in the main content area.
 * It also handles the logic for the buttons in the bottom bar, including going back to the menu and going to the cart.
 * 
 * Effects:
 * - Navigates to the menu page when the back to menu button is clicked.
 * - Navigates to the cart page when the done button is clicked.
 * - Resets the tracked items and returns to the sides step when the done button is clicked.
 * - Fetches menu items and logs them to the console.
 * 
 * @component
 * @author Uzair Khan
 * 
 * @returns {JSX.Element} The rendered kiosk page component.
 */
const KioskALaCartePage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState("sides");
  const {
    menu,
    priceMap,
    numTrackedSides,
    numTrackedEntrees,
    numTrackedOthers,
    totalItemCount,
    resetTrackedSides,
    resetTrackedEntrees,
    resetTrackedOthers,
    translations,
    toggleTheme, 
    currentTheme, 
    isPandaMember,
    toggleSize,
    isLargeText
  } = useGlobalState();
  const { cart, addItemToCart, removeItemFromCart, clearCart, newItem, removeNewItem } = useGlobalState();

    /**
   * Effect to log menu items for debugging purposes.
   * @author Brandon Batac
   * @throws Logs to the console if the menu is not properly populated.
   */
  useEffect(() => {
    console.log("Menu items:", menu);
  }, [menu]);

  /**
   * Handles completing the current step and adding the new item to the cart.
   * Resets tracked item counters and navigates to the item selection page.
   * @author Uzair Khan, Andrew Popovici
   * @throws Will throw an error if `newItem` fails to add to the cart.
   */
  const handleDone = () => {
    resetTrackedSides();
    resetTrackedEntrees();
    resetTrackedOthers();
    setCurrentStep("sides");
    newItem.type = "A LA CARTE";
    addItemToCart(newItem);
    removeNewItem();
    router.push("/kiosk_item");
  };

  /**
   * Handles navigation to the cart page.
   * @author Uzair Khan
   * @throws Will throw an error if router navigation fails.
   */
  const handleCartClick = () => {
    resetTrackedSides();
    resetTrackedEntrees();
    resetTrackedOthers();
    setCurrentStep("sides");
    removeNewItem();
    router.push("/kiosk_cart");
  };

  /**
   * Handles navigation back to the menu page.
   * @author Uzair Khan
   * @throws Will throw an error if router navigation fails.
   */
  const handleBackToMenu = () => {
    resetTrackedSides();
    resetTrackedEntrees();
    resetTrackedOthers();
    setCurrentStep("sides");
    removeNewItem();
    router.push("/kiosk_item");
  };

  let itemsToDisplay = menu;
  let headerText = translations["Select Items"] || "SELECT ITEMS"; //info text that changes based on selection step\


  return (
    <>
    <Head>
      {/* Add or update the page title */}
      <title>A La Carte Order Selection</title>
      {/* Add other metadata if needed */}
      <meta name="description" content="Order any items straight from the A La Carte Menu" />
    </Head>
    <div className={styles.layout}>
      <div className={styles.circle}>
        <p>1</p>
      </div>

      <div className={styles.topHeader}>

        <TopBar
          handleCartClick={handleCartClick}
          numTrackedSides={numTrackedSides}
          numTrackedEntrees={numTrackedEntrees}
          numTrackedOthers={numTrackedOthers}
        />
      </div>
      {headerText && <h2 className={styles.itemHeader}>{headerText}</h2>}
      <div className={styles.itemsContainer}>
        {itemsToDisplay.map((item) => (
          <ItemFrame key={item.name} item={item} />
        ))}
      </div>

      {/* Creates and renders a sticky bottom bar */}
      <div className={styles.bottomBar}>
        {/* For sides step */}
        {currentStep === "sides" && (
          <>
            <button
              className={styles.backToMenuButton}
              onClick={handleBackToMenu}
            >
              <div className={styles.inlineText}>
                <span className={styles.x}>&gt; </span>
                <span className={styles.backMenu}>
                  {translations["Back to Menu"] || "Back to Menu"}
                </span>
              </div>
            </button>
            <button className={styles.doneButton} onClick={handleDone}>
              {translations["Done"] || "Done"}
            </button>
          </>
        )}
      </div>
    </div>
    </>
  );
};

export default KioskALaCartePage;
