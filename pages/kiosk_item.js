import React, { useState, useEffect, useContext } from "react";
import styles from "./kiosk_item.module.css";
import { useRouter } from "next/router";
import { useGlobalState } from "../app/context/GlobalStateContext";
import TranslateButton from "@/app/components/kiosk/translateButton";
import { Margin } from "@mui/icons-material";

import AccessibilityButton from './accessButton';


const TopBar = ({ handleOptionsClick }) => {
  const router = useRouter();
  const { currentLanguage, changeLanguage, translations } = useGlobalState();
  const { cart, addItemToCart, removeItemFromCart, clearCart, newItem, removeNewItem, setCart, numTotalItems } = useGlobalState();

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const tax = subtotal * 0.15;
  const total = subtotal + tax;

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    changeLanguage(newLanguage);
  };


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

//Gets recommended item based on highest selling item of the month
const RecommendedItem = () => {
  const [topItem, setTopItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { menu } = useGlobalState();
  useEffect(() => {
    const fetchTopItem = async () => {
      try {
        const response = await fetch('/api/top-selling-item');
        if (!response.ok) {
          throw new Error('Failed to fetch top-selling item');
        }
        const data = await response.json();
        setTopItem(data.data);
      } catch (err) {
        console.error('Error fetching top-selling item:', err);
        setError('Failed to load recommended item.');
      } finally {
        setLoading(false);
      }
    };

    fetchTopItem();
  }, []);

  if (loading) return <p>Loading recommended item...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  // Match topItem fteched with global vars to get information
  const matchedItem = menu.find(item => item.name === topItem?.item_name);
  if (!matchedItem) {
    return <p>Item not found in the menu.</p>;
  }
  //Get item details
  const { name, calories, description, designation, image } = matchedItem;

  return (
    <div className={styles.recommendedItemPanel}>
      <div className={styles.recLeftPanel}>
        <h2 className={styles.recLabel}>This month&#39;s hot item</h2>
        <div className={styles.itemDetails}>
          <p className={styles.recItemName}>{name}</p>
          <p className={styles.recItemDescription}>{description}</p>
          <div className={styles.itemInfo}>
            <p className={styles.recItemCalories}>
              Calories: {calories || 'N/A'} | Designation: {designation || 'None'}
            </p>
          </div>
        </div>
      </div>

      <div className={styles.recRightPanel}>
        <img
          src= {matchedItem.image}
          alt= {matchedItem.name}
          className={styles.itemRecImg}
        />
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
  const { toggleTheme, currentTheme, isPandaMember, toggleSize, isLargeText } = useGlobalState();

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
