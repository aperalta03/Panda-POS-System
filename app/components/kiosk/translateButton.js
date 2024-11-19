import React from "react";
import styles from "./translateButton.module.css";

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
