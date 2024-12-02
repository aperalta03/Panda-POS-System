import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "./thank-you.module.css";
import JSConfetti from "js-confetti";
import { useGlobalState } from "@/app/context/GlobalStateContext";


/**
 * ThankYouPage Component
 * 
 * @author Alonso Peralta Espinoza
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
  const { orderNumber, incOrderNumber, translations } = useGlobalState();
  const [fortune, setFortune] = useState("Fetching your fortune...");

  useEffect(() => {
    const fetchFortune = async () => {
      try {
        const response = await fetch("/api/fortune-ai");
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

    const handleClick = () => router.push("/kiosk");
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [router]);

  return (
    <div className={styles.container}>
      {/* Logo and Order Number */}
      <div className={styles.topLeft}>
        <img
          src="/chickenmaxxing_logo.png"
          alt="Chicken Maxxing Logo"
          className={styles.chickenLogo}
        />
        <h2 className={styles.orderNumberLabel}>
          {translations["Order Number"] || "Order Number"}
        </h2>
        <h1 className={styles.orderNumber}>{orderNumber}</h1>
        {/* Insert ORDER NUMBER ABOVE */}
      </div>

      {/* Middle Container */}
      <div className={styles.middleContainer}>
        <div className={styles.circle}></div>
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
  );
};

export default ThankYouPage;
