import React from "react";
import styles from "./translateButton.module.css";

/**
 * @description
 * A button component that allows users to select a language from a dropdown list. 
 * It supports multiple languages and updates the selected language when the user 
 * changes it. The component can be customized with inline styles for unique positioning.
 * 
 * @param {object} props - The properties passed to the component.
 * @param {string} props.currentLanguage - The currently selected language.
 * @param {function} props.onLanguageChange - The function that handles the language change event.
 * @param {object} [props.customStyles] - Optional inline styles for customizing the button's appearance.
 * 
 * @returns {JSX.Element} The TranslateButton component.
 * 
 * @example
 * <TranslateButton 
 *   currentLanguage="en" 
 *   onLanguageChange={(e) => console.log(e.target.value)} 
 *   customStyles={{ position: 'absolute', top: '10px', right: '10px' }}
 * />
 * 
 * @since 1.0.0
 * 
 * @module translateButton
 */
const TranslateButton = ({
  currentLanguage,
  onLanguageChange,
  customStyles,
}) => {
  return (
    <select
      value={currentLanguage}
      onChange={onLanguageChange}
      className={`${styles.translateButton}`}
      style={customStyles} // Inline styles for unique positioning
    >
      <option value="en">English</option>
      <option value="es">Español</option>
      <option value="fr">Français</option>
      <option value="de">Deutsch</option>
      <option value="zh">中国人</option>
      <option value="ja">日本語</option>
    </select>
  );
};

export default TranslateButton;
