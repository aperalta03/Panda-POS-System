import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "./thank-you.module.css";
import JSConfetti from "js-confetti";
import { useGlobalState } from "@/app/context/GlobalStateContext";

const ThankYouPage = () => {
  const router = useRouter();
  const [fortune, setFortune] = useState("Fetching your fortune...");
  const { currentLanguage, changeLanguage, translations } = useGlobalState();

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
    <div className={styles.Container}>
      <div className={styles.circle}>
        <p></p>
      </div>
      <img
        src="/chickenmaxxing_logo.png"
        alt="Chicken Maxxing Logo"
        className={`${styles.Logo} ${styles.Left}`}
      />

      <div className={styles.middleContainer}>
        <img
          src="Panda_Rewards.png"
          alt="Panda Express Logo"
          className={`${styles.Logo} ${styles.Right}`}
        />
        <h1 className={styles.ThankYouText}>
          {translations["Your order is on its way!"] ||
            "Your order is on its way!"}
        </h1>
        <h2 clssName={styles.orderNumber}>
          {translations["Your order number is:"] || "Your order number is:"}
        </h2>
        <div className={styles.FortunePaper}>
          <p>{fortune}</p>
        </div>
        <img
          src="/click.png"
          alt="CLick Me to go Back to the Kiosk"
          className={styles.click}
        />
      </div>
    </div>
  );
};

export default ThankYouPage;
