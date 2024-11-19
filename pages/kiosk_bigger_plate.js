import React, { useState, useEffect } from "react";
import styles from "./kiosk_bigger_plate.module.css";
import { useRouter } from "next/router";
import { useGlobalState } from "../app/context/GlobalStateContext"; //import global state
import ItemFrame from "./itemFrame";
import TranslateButton from "@/app/components/kiosk/translateButton";

//top bar containing panel info, tracker of items selected, etc.
const TopBar = ({ handleCartClick, numTrackedSides, numTrackedEntrees }) => {
  const router = useRouter();
  const { currentLanguage, changeLanguage, translations } = useGlobalState();

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    changeLanguage(newLanguage);
  };

  return (
    <div className={styles.KioskItemPanel}>
      <div className={styles.leftTopPanel}>
        <h1 className={styles.plateName}>
          {translations["Bigger Plate"] || "Bigger Plate"}
        </h1>
        <h3 className={styles.selectLabel}>
          {translations["Select:"] || "Select:"}
        </h3>
        <h3 className={styles.sideLabel}>
          {translations["1 Side"] || "1 Side"}
        </h3>
        <h3 className={styles.entreeLabel}>
          {translations["3 Entrees"] || "3 Entrees"}
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
        </div>
      </div>
    </div>
  );
};

const KioskBiggerPlatePage = () => {
  const router = useRouter();
  const {
    menu,
    priceMap,
    numTrackedSides,
    numTrackedEntrees,
    totalItemCount,
    resetTrackedSides,
    resetTrackedEntrees,
    isDone,
    setDone,
    translations,
  } = useGlobalState();
  const [currentStep, setCurrentStep] = useState("sides"); //step var to indicate whether selecting sides or entrees

  useEffect(() => {
    if (numTrackedSides === 1 && numTrackedEntrees === 3) {
      setDone(true); // Mark as done when both side and entree are selected
    } else {
      setDone(false);
    }
  }, [numTrackedSides, numTrackedEntrees, setDone]);

  //set currentStep based on the number of tracked sides and entrees
  useEffect(() => {
    if (numTrackedSides < 1) {
      setCurrentStep("sides");
    } else if (numTrackedSides >= 1 && numTrackedEntrees < 3) {
      setCurrentStep("entrees");
    }
  }, [numTrackedSides, numTrackedEntrees]);

  //checking if menu items are fetched correctly
  useEffect(() => {
    console.log("Menu items:", menu);
  }, [menu]);

  //resets counter variables and sets back to sides step
  const handleBackToSides = () => {
    resetTrackedSides();
    resetTrackedEntrees();
    setCurrentStep("sides");

    setTimeout(() => setCurrentStep("sides"), 0);
  };

  // done button to go back to item page
  const handleDone = () => {
    resetTrackedSides();
    resetTrackedEntrees();
    setCurrentStep("sides");

    setTimeout(() => setCurrentStep("sides"), 0);

    router.push("/kiosk_item");
  };

  //should go to CART FIXMEEEEE
  const handleCartClick = () => {
    resetTrackedSides();
    resetTrackedEntrees();
    setCurrentStep("sides");

    setTimeout(() => setCurrentStep("sides"), 0);
    router.push("/kiosk_cart");
  };

  const handleBackToMenu = () => {
    resetTrackedSides();
    resetTrackedEntrees();
    setCurrentStep("sides");

    setTimeout(() => setCurrentStep("sides"), 0);
    router.push("/kiosk_item");
  };

  let itemsToDisplay = []; //item frames to display depending on selection step
  let headerText = ""; //info text that changes based on selection step
  if (numTrackedSides < 1) {
    //side selection
    itemsToDisplay = menu.filter((item) => item.type === "side");
    headerText = translations["Select Sides"] || "Select Sides";
  } else {
    //entree selection
    itemsToDisplay = menu.filter((item) => item.type === "entree");
    headerText = translations["Select Entrees"] || "Select Entrees";
  }

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
        />
      </div>
      {headerText && <h2 className={styles.itemHeader}>{headerText}</h2>}
      <div className={styles.itemsContainer}>
        {itemsToDisplay.map((item) => (
          <ItemFrame key={item.name} item={item} isDone={isDone} />
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
            <button
              className={styles.doneButton}
              onClick={handleDone}
              disabled={numTrackedSides !== 1 || numTrackedEntrees !== 3}
            >
              {translations["Done"] || "Done"}
            </button>
          </>
        )}

        {/* For entrees step */}
        {currentStep === "entrees" && (
          <>
            <button className={styles.bottomButton} onClick={handleBackToSides}>
              <div className={styles.inlineText}>
                <span className={styles.x}>&gt; </span>
                <span className={styles.backSides}>
                  {translations["Back to Sides"] || "Back to Sides"}
                </span>
              </div>
            </button>
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
            <button
              className={styles.doneButton}
              onClick={handleDone}
              disabled={numTrackedSides !== 1 || numTrackedEntrees !== 3}
            >
              {translations["Done"] || "Done"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default KioskBiggerPlatePage;
