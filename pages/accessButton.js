import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { useGlobalState } from "../app/context/GlobalStateContext";
import styles from "./accessButton.module.css";

/**
 * AccessibilityButton is a component that displays an accessible icon and a dropdown menu containing three options:
 * 1. Switch Theme: Switches the theme of the site between a low-vision theme and a normal theme.
 * 2. Adjust Font Size: Adjusts the font size of the site between 100%, 110%, 120%, and 130%.
 * 3. Current Theme: Displays the current theme of the site.
 * 4. Current Size: Displays the current font size of the site.
 *
 * This component is designed to be used in conjunction with the GlobalStateContext and the useGlobalState hook.
 * @author Uzair Khan, Alonso Peralta Espinsosa
 * @returns {JSX.Element} The AccessibilityButton component.
 */
const AccessibilityButton = () => {
  const { toggleTheme, currentTheme, toggleSize, isLargeText, translations } =
    useGlobalState();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownCoords, setDropdownCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  // Prevent Parent Interference
  const handleButtonClick = (e) => {
    e.stopPropagation();
    setDropdownVisible((prev) => !prev);
  };

  //** Calculate Dropdown Position **//
  useLayoutEffect(() => {
    if (dropdownVisible && buttonRef.current && dropdownRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const dropdownRect = dropdownRef.current.getBoundingClientRect();

      let top;
      let left;

      // Vertical positioning
      if (buttonRect.bottom + dropdownRect.height + 10 <= window.innerHeight) {
        top = buttonRect.bottom + 10;
      } else if (buttonRect.top - dropdownRect.height - 10 >= 0) {
        top = buttonRect.top - dropdownRect.height - 10;
      } else {
        top = Math.max(window.innerHeight - dropdownRect.height - 10, 10);
      }

      // Horizontal positioning
      if (buttonRect.left + dropdownRect.width <= window.innerWidth) {
        left = buttonRect.left;
      } else if (buttonRect.right - dropdownRect.width >= 0) {
        left = buttonRect.right - dropdownRect.width;
      } else {
        left = Math.max(window.innerWidth - dropdownRect.width - 10, 10);
      }

      setDropdownCoords({ top, left });
    }
  }, [dropdownVisible]);

  useEffect(() => {
/**
 * Handles clicks outside the button and dropdown elements.
 * If the click event occurs outside both the button and the dropdown,
 * and the dropdown is currently visible, it sets the dropdown visibility to false.
 *
 * @param {Event} event - The click event object.
 * @author Uzair Khan
 */
    const handleClickOutside = (event) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target) &&
        dropdownVisible &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownVisible]);

  return (
    <div className={styles.buttonContainer}>
      {/* Main Accessibility Button */}
      <button
        className={styles.circleButton}
        onClick={handleButtonClick}
        ref={buttonRef}
      >
        <img
          src="/handicap_button.jpg"
          alt="Accessible Icon"
          className={styles.accessImage}
        />
      </button>

      {/* Dropdown Menu */}
      {dropdownVisible &&
        ReactDOM.createPortal(
          <div
            ref={dropdownRef}
            className={styles.dropdownMenu}
            style={{
              position: "fixed",
              top: dropdownCoords.top,
              left: dropdownCoords.left,
              zIndex: 10000,
            }}
          >
            <button onClick={toggleTheme} className={styles.dropdownButton}>
              {translations["Switch Theme"] || "Switch Theme"}
            </button>
            <p className={styles.dropdownText}>
              {translations["Current Theme:"] || "Current Theme:"}{" "}
              {currentTheme === "alternate"
                ? translations["Low Vision Theme"] || "Low Vision Theme"
                : currentTheme === "default"
                ? translations["Normal Theme"] || "Normal Theme"
                : currentTheme === "loyalty"
                ? translations["Loyalty Mode"] || "Loyalty Mode"
                : currentTheme}
            </p>
            <button onClick={toggleSize} className={styles.dropdownButton}>
              {translations["Adjust Font Size"] || "Adjust Font Size"}
            </button>
            <p className={styles.dropdownText}>
              {translations["Current Size:"] || "Current Size:"}{" "}
              {isLargeText === "original"
                ? "100%"
                : isLargeText === "ten"
                ? "110%"
                : isLargeText === "twenty"
                ? "120%"
                : isLargeText === "thirty"
                ? "130%"
                : isLargeText}
            </p>
          </div>,
          document.body
        )}
    </div>
  );
};

export default AccessibilityButton;
