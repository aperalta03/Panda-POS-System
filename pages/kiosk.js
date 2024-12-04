import React, { useState, useContext, useEffect } from "react";
import styles from "./kiosk.module.css";
import { useGlobalState } from "@/app/context/GlobalStateContext";
import { useRouter } from "next/router";
import AirIcon from "@mui/icons-material/Air";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import CloudIcon from "@mui/icons-material/Cloud";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import TranslateButton from "@/app/components/kiosk/translateButton";
import CustomerLogInModal from "@/app/components/kiosk/customerLogInModal";

import AccessibilityButton from "./accessButton";
import Head from "next/head"; // Import Head for managing the document head

/**
 * The Welcome component is the first page shown to users when they enter the kiosk.
 * It displays the current time, the current weather, the Panda Express logo, and a
 * button to start ordering. The text is translated based on the current language.
 * The component also includes a button to change the language.
 *
 * Props:
 * - toItemPage: a function to navigate to the item selection page
 *
 * State:
 * - weather: an object containing the current temperature and condition
 * - time: the current time
 *
 * Effects:
 * - fetches the current weather on mount
 * - updates the time every minute
 *
 * @author Brandon Batac
 * @author Alonso Peralta Espinoza
 *
 * @param {{ toItemPage: () => void }} props
 * @returns {JSX.Element}
 */
const Welcome = ({ toItemPage }) => {
  const { currentLanguage, changeLanguage, customerName, translations } =
    useGlobalState();
  const [weather, setWeather] = useState({ temp: null, condition: null });
  const [time, setTime] = useState("");
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  console.log(customerName);

  /**
   * Handles a change in the language dropdown by calling changeLanguage with the selected language value.
   * @param {React.ChangeEvent<HTMLSelectElement>} e - The change event from the language dropdown
   * @returns {void}
   *
   * @author Brandon Batac
   */
  
  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    changeLanguage(newLanguage);
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          "https://wttr.in/College+Station?format=%t+%C"
        );
        const data = await response.text();

        const match = data.match(/([+-]?\d+°[CF])\s+(.+)/);

        if (match) {
          const temp = match[1].replace("+", "");
          const condition = match[2];
          setWeather({ temp, condition });
        } else {
          console.error("Unexpected weather data format:", data);
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };
    fetchWeather();
  }, []);

  /**
   * Given a weather condition, returns the corresponding MaterialUI icon.
   *
   * @author Alonso Peralta Espinoza
   *
   * @param {string} condition
   * @returns {JSX.Element|null}
   */

  const getWeatherIcon = (condition) => {
    if (condition.includes("Sunny") || condition.includes("Clear"))
      return <WbSunnyIcon />;
    if (condition.includes("Partly cloudy")) return <CloudIcon />;
    if (condition.includes("Cloudy") || condition.includes("Overcast"))
      return <CloudIcon />;
    if (
      condition.includes("Rain") ||
      condition.includes("Showers") ||
      condition.includes("rain")
    )
      return <ThunderstormIcon />;
    if (condition.includes("Thunderstorm") || condition.includes("Thunder"))
      return <ThunderstormIcon />;
    if (condition.includes("Snow")) return <AcUnitIcon />;
    if (condition.includes("Windy") || condition.includes("Breezy"))
      return <AirIcon />;
    if (
      condition.includes("Fog") ||
      condition.includes("Mist") ||
      condition.includes("Haze")
    )
      return <CloudIcon />;
    return null;
  };

  return (
    <div className={styles.layout}>
      <div className={styles.clockLogoContainer}>
        {weather.temp && weather.condition && (
          <div className={styles.weatherBox}>
            <div className={styles.weatherIcon}>
              {getWeatherIcon(weather.condition)}
            </div>
            <div className={styles.weatherTemp}>{weather.temp}</div>
          </div>
        )}
        <div className={styles.timestamp}>{time}</div>
      </div>
      <img
        src="/panda_express.png"
        alt="Panda Express Logo"
        className={styles.logo}
      />
      <h1 className={styles.welcomeHeader}>
        {translations["We Wok For You"] || "We Wok For You"}
      </h1>
      <div onClick={toItemPage} className={styles.orderHeader}>
        <h1>
          {customerName === "Guest"
            ? currentLanguage === "en"
              ? "Tap to Order Now as Guest"
              : translations["Tap to Order Now as Guest"]
            : currentLanguage === "en"
            ? "Tap to Order Now as " + customerName
            : translations["Tap to Order Now as "] + customerName}
        </h1>
      </div>
      <div className={styles.customerLoginWrapper}>
        <button
          onClick={() => setLoginModalOpen(true)}
          className={styles.openModalButton}
        >
          {translations["Customer Login"] || "Customer Login"}
        </button>
      </div>
      {/* Render Customer Log In Modal */}
      <CustomerLogInModal
        isOpen={isLoginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
      <div className={styles.translateButton}>
        <TranslateButton
          currentLanguage={currentLanguage}
          onLanguageChange={handleLanguageChange}
        />
      </div>
      <div className={styles.handicapWrapper}>
        <AccessibilityButton />
      </div>
      <div className={styles.circle}></div>
      <div className={styles.bottomPanel}></div>
    </div>
  );
};

/**
 * KioskPage component serves as the main page for the kiosk application.
 * It includes the Welcome component and handles navigation to the item selection page.
 *
 * Effects:
 * - Navigates to the item selection page when the Welcome component triggers the `toItemPage` function.
 *
 * Returns a JSX element that fills the viewport height and prevents scrolling.
 *
 * @author Brandon Batac
 */
const KioskPage = () => {
  const router = useRouter();

  const toItemPage = () => {
    router.push("/kiosk_item");
  };

  return (
    <>
      <Head>
        {/* Add or update the page title */}
        <title>Welcome to Panda Express Kiosk</title>
        {/* Add other metadata if needed */}
        <meta
          name="description"
          content="Order from Panda Express using our interactive kiosk."
        />
      </Head>
      <div
        style={{
          height: "100vh", // Full height of the viewport
          overflow: "hidden", // Prevent scrolling
        }}
      >
        <Welcome toItemPage={toItemPage} />
      </div>
    </>
  );
};

export default KioskPage;
