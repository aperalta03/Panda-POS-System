import React, { useState, useContext } from "react";
import styles from "./kiosk.module.css";
import {
  TranslationProvider,
  TranslationContext,
} from "@/app/context/translateContext";
import { useRouter } from "next/router";

const Welcome = ({ toItemPage }) => {
  const { translations, translateAllText } = useContext(TranslationContext);
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const handleTranslate = () => {
    translateAllText(
      ["We Wok for You", "Tap to Order Now", "accessibility"],
      selectedLanguage
    );
  };

  return (
    <div className={styles.body}>
      <h1 className={styles.welcomeHeader}>
        {translations["We Wok for You"] || "We Wok for You"}
      </h1>
      <h1 className={styles.orderHeader}>
        {translations["Tap to Order Now"] || "Tap to Order Now"}
      </h1>

      <div className={styles.bottomPanel}>
        <button className={styles.accessibility}>
          {translations["accessibility"] || "accessibility"}
        </button>
      </div>

      <select
        value={selectedLanguage}
        onChange={(e) => setSelectedLanguage(e.target.value)}
        className={styles.languageDropdown}
      >
        <option value="en">English</option>
        <option value="es">Spanish</option>
        <option value="fr">French</option>
        <option value="de">German</option>
        <option value="zh">Chinese (Simplified)</option>
        <option value="ja">Japanese</option>
        {/* Add more languages as needed */}
      </select>

      <button onClick={handleTranslate} className={styles.translateButton}>
        Translate
      </button>
    </div>
  );
};

const KioskPage = () => {
  const router = useRouter();

  const toItemPage = () => {
    router.push("/kiosk_item");
  };

  return (
    <TranslationProvider>
      <div>
        <Welcome toItemPage={toItemPage} />
      </div>
    </TranslationProvider>
  );
};

export default KioskPage;
