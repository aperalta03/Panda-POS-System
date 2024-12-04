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
 * @description
 * Welcome component for the kiosk home page. Displays the current time, weather, and language selection.
 * @feature
 * - Displays the current time
 * - Displays the current weather condition and temperature
 * - Allows the user to select a language
 * - Displays a customer login button
 * - Displays a translate button
 * - Displays a handicap button
 * - Displays a bottom panel
 * @state
 * - `weather`: The current weather condition and temperature
 * - `time`: The current time
 * - `isLoginModalOpen`: A boolean indicating whether the customer login modal is open
 * @param {function} toItemPage - A function to navigate to the item page
 * @returns {JSX.Element} The Welcome component
 * @author Alonso Peralta Espinoza, Brandon Batac
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
 * @description
 * KioskPage component serves as the main entry point for the Panda Express kiosk application.
 * It sets up the page's metadata and layout, including the welcome component, which allows users to start an order.
 *
 * @component
 * - Utilizes the `Welcome` component to display the initial page content.
 * - Uses Next.js `Head` component to manage the document head metadata.
 *
 * @dependencies
 * - `useRouter`: For navigation to different pages.
 * - `Welcome`: Component for displaying welcome messages and options.
 *
 * @param {function} toItemPage - A function to navigate to the item selection page.
 *
 * @returns {JSX.Element} The rendered KioskPage component.
 *
 * @author Brandon Batac, Uzair Khan
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
