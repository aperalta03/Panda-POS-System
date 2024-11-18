import React, { useState, useEffect, useContext } from "react";
import styles from "./kiosk_a_la_carte.module.css";
import { useRouter } from "next/router";
import { useGlobalState } from "../app/context/GlobalStateContext"; //import global state
import ItemFrame from "./itemFrameALaCarte";

//top bar containing panel info, tracker of items selected, etc.
const TopBar = ({
  handleCartClick,
  numTrackedSides,
  numTrackedEntrees,
  numTrackedOthers,
}) => {
  const router = useRouter();
  const { currentLanguage, changeLanguage, translations } = useGlobalState();
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
        <button className={styles.checkOut} onClick={handleCartClick}>
          <img src="/cart2_img.png" alt="Cart" className={styles.cartImage} />
        </button>
        <div className={styles.quantContainer}>
          <div className={styles.sideContainer}>
            <h2 className={styles.sideQuant}>{numTrackedSides}</h2>
            <h2 className={styles.sideQuantLabel}>
              {translations["Sides"] || "Sides"}
            </h2>
          </div>
          <div className={styles.entreeContainer}>
            <h2 className={styles.entreeQuant}>{numTrackedEntrees}</h2>
            <h2 className={styles.entreeQuantLabel}>
              {translations["Entrees"] || "Entrees"}
            </h2>
          </div>
          <div className={styles.otherContainer}>
            <h2 className={styles.otherQuant}>{numTrackedOthers}</h2>
            <h2 className={styles.otherQuantLabel}>
              {translations["Extras"] || "Extras"}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

const KioskALaCartePage = () => {
  const router = useRouter();
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
  } = useGlobalState();
  const [currentStep, setCurrentStep] = useState("sides"); //step var to indicate whether selecting sides or entrees

  //checking if menu items are fetched correctly
  useEffect(() => {
    console.log("Menu items:", menu);
  }, [menu]);

  // done button to go back to item page
  const handleDone = () => {
    resetTrackedSides();
    resetTrackedEntrees();
    setCurrentStep("sides");
    resetTrackedOthers();
    setTimeout(() => setCurrentStep("sides"), 0);

    router.push("/kiosk_item");
  };

  //should go to CART FIXMEEEEE
  const handleCartClick = () => {
    resetTrackedSides();
    resetTrackedEntrees();
    resetTrackedOthers();
    setCurrentStep("sides");

    setTimeout(() => setCurrentStep("sides"), 0);
    router.push("/kiosk_cart");
  };

  const handleBackToMenu = () => {
    resetTrackedSides();
    resetTrackedEntrees();
    resetTrackedOthers();
    setCurrentStep("sides");

    setTimeout(() => setCurrentStep("sides"), 0);
    router.push("/kiosk_item");
  };

  //let itemsToDisplay = menu; //item frames to display depending on selection step
  let itemsToDisplay = menu;
  let headerText = translations["Select Items"] || "SELECT ITEMS"; //info text that changes based on selection step\

  return (
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
  );
};

export default KioskALaCartePage;
