import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "./thank-you.module.css";
import JSConfetti from "js-confetti";
import { useGlobalState } from "@/app/context/GlobalStateContext";

import Head from "next/head"; // Import Head for managing the document head

/**
 * ThankYouPage Component
 *
 * @author Uzair Khan, Alonso Peralta Espinoza
 *
 * @description
 * Displays a thank-you page after an order, including a dynamic order number and fortune.
 *
 * @features
 * - Confetti animation with custom emojis.
 * - Displays order number and fortune fetched from an API.
 * - Redirects to the kiosk view upon user interaction.
 *
 * @api
 * - `/api/fortune-ai` (GET): Fetches a fortune message for the thank-you page.
 *
 * @returns {React.ReactElement} A React functional component.
 */

const ThankYouPage = () => {
  const router = useRouter();
  const {
    orderNumber,
    incOrderNumber,
    translations,
    customer10PercentOff,
    customerTotalPoints,
    setCustomerTotalPoints,
    setCustomerName,
    setCustomerPhoneNumber,
    setCustomer10PercentOff,
    totalSpent,
    customerName,
    currentLanguage,
  } = useGlobalState();
  const [fortune, setFortune] = useState("Fetching your fortune...");
  const pointsUsed = customer10PercentOff ? 1000 : 0;
  const pointsGained = Math.floor(totalSpent * 10);

  useEffect(() => {

    /**
     * Fetches a fortune message from the `/api/fortune-ai` API endpoint
     * and updates the component state with the response.
     * If the API call fails, it sets a default fortune message.
     * @author Alonso Peralta Espinoza
     * @async
     * @returns {Promise<void>}
     * @throws {Error} If the fetch fails or the response is not ok.
     */

    const fetchFortune = async () => {
      try {
        const response = await fetch(`/api/fortune-ai?currentLanguage=${currentLanguage}`);
        const data = await response.json();
        setFortune(data.fortune || "Your fortune could not be fetched.");
      } catch (error) {
        console.error("Error fetching fortune:", error);
        setFortune("Something went wrong, but great things are still coming!");
      }
    };
    fetchFortune();
    incOrderNumber();

    const jsConfetti = new JSConfetti();
    const confettiRainDuration = 1500; // Total duration of confetti
    const confettiInterval = 500; // Interval between confetti bursts

    const confettiTimer = setInterval(() => {
      jsConfetti.addConfetti({
        emojis: ["🥠"],
        confettiRadius: 1,
        confettiNumber: 10,
      });
    }, confettiInterval);

    setTimeout(() => {
      clearInterval(confettiTimer);
    }, confettiRainDuration);

    const handleClick = () => {
      setCustomerTotalPoints(0);
      setCustomerName("Guest");
      setCustomerPhoneNumber("");
      setCustomer10PercentOff(false);
      router.push("/kiosk");
    }
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [router, currentLanguage]);

  return (
    <>
      <Head>
        {/* Add or update the page title */}
        <title>Thank you Page</title>
        {/* Add other metadata if needed */}
        <meta name="description" content="Thank you for your order!" />
      </Head>
      <div className={styles.container}>
        {/* Logo and Order Number */}
        <div className={styles.topLeft}>
          <img
            src="/chickenmaxxing_logo.png"
            alt="Chicken Maxxing Logo"
            className={styles.chickenLogo}
          />
          <h2 className={styles.orderNumberLabel}>
            {translations["Order"] || "Order"}
          </h2>
          <h1 className={styles.orderNumber}>{orderNumber}</h1>
          {/* Insert ORDER NUMBER ABOVE */}
        </div>

        {/* Middle Container */}
        <div className={styles.middleContainer}>
          <div className={styles.circle}></div>
          {customerName !== "Guest" && (
            <>
              <h2 className={styles.pointInfo}>Points Used: {pointsUsed}</h2>
              <h2 className={styles.pointInfo}>
                Points Gained: {pointsGained}
              </h2>
              <h2 className={styles.pointInfo}>
                Your Total Points: {customerTotalPoints}
              </h2>
            </>
          )}
          <h1 className={styles.thankYouText}>
            {translations["Your order is"] || "Your order is"}
          </h1>
          <h1 className={styles.thankYouText}>
            {translations["on its way!"] || "on its way!"}
          </h1>
          <img
            src="/Panda_Rewards.png"
            alt="Panda Rewards Logo"
            className={styles.pandaLogo}
          />
          <div className={styles.fortunePaper}>
            <p>{fortune}</p>
          </div>
        </div>

        {/* Click Me Button */}
        <img
          src="/click.png"
          alt="Click Me to go Back to the Kiosk"
          className={styles.clickMeButton}
        />
      </div>
    </>
  );
};

export default ThankYouPage;
