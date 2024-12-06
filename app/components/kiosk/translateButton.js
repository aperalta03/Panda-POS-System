import React from "react";
import styles from "./translateButton.module.css";

/**
 * @description
 * TranslateButton component for language selection.
 * The component renders a <select> element with options for different languages.
 * The component also accepts a customStyles prop for inline CSS styling.
 * @author Brandon Batac
 * @param {string} currentLanguage - The current language selected
 * @param {function} onLanguageChange - The function to call when the language is changed
 * @param {object} customStyles - The custom styles to apply to the component
 * @returns {JSX.Element} The rendered component
 */
const TranslateButton = ({
  currentLanguage,
  onLanguageChange,
  customStyles,
}) => {
  return (
    <div>
      <select
        id="language-select"
        value={currentLanguage}
        onChange={onLanguageChange}
        className={`${styles.translateButton}`}
        style={customStyles} // Inline styles for unique positioning
        aria-label="Select Language"
      >
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="fr">Français</option>
        <option value="de">Deutsch</option>
        <option value="zh">中国人</option>
        <option value="ja">日本語</option>
      </select>
    </div>
  );
};

export default TranslateButton;
