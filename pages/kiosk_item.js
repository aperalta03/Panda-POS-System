import React, { useState, useEffect } from "react";
import styles from "./kiosk_item.module.css";
import { useRouter } from "next/router";
import { useGlobalState } from "../app/context/GlobalStateContext";

const TopBar = ({ handleOptionsClick }) => {
  const router = useRouter();
  const { currentLanguage, changeLanguage, translations } = useGlobalState();
  return (
    <div className={styles.KioskItemPanel}>
      <div className={styles.leftButtons}>
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
          <h1 className={styles.priceLabel}>$11.20</h1>
        </div>
        <div className={styles.gearButtonContainer}>
          <button className={styles.circleButton} onClick={handleOptionsClick}>
            <img
              src="/handicap_button.jpg"
              alt="Accessible Icon"
              className={styles.accessImage}
            />
          </button>
        </div>
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

const KioskItemPanel = ({}) => {
  const router = useRouter();
  const { currentLanguage, changeLanguage, translations } = useGlobalState();
  return (
    <div className={styles.midPanel}>
      <div className={styles.itemButtons}>
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

const KioskItemPage = () => {
  const router = useRouter();
  const [isOptionsOpens, setIsOptionsOpen] = useState(false);

  const handleOptionsClick = () => {
    setIsOptionsOpen(!isOptionsOpen);
  };

  return (
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
  );
};

export default KioskItemPage;
