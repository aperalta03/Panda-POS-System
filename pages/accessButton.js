import React, { useState, useEffect, useRef } from 'react';
import { useGlobalState } from '../app/context/GlobalStateContext';
import styles from './accessButton.module.css';

const AccessibilityButton = () => {
  const { toggleTheme, currentTheme, toggleSize, isLargeText } = useGlobalState();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState('below');
  const buttonRef = useRef(null);

  const handleButtonClick = () => {
    setDropdownVisible((prev) => !prev);
  };

  useEffect(() => {
    if (dropdownVisible && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const availableSpaceBelow = window.innerHeight - buttonRect.bottom;
      const availableSpaceAbove = buttonRect.top;

      if (availableSpaceBelow < 200 && availableSpaceAbove > 200) {
        // If there's not enough space below, open the dropdown to the side
        setDropdownPosition('side');
      } else {
        // Otherwise, open the dropdown below
        setDropdownPosition('below');
      }
    }
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
      {dropdownVisible && (
        <div
          className={`${styles.dropdownMenu} ${styles[dropdownPosition]}`}
        >
          <button onClick={toggleTheme} className={styles.dropdownButton}>
            Switch Theme
          </button>
          <p className={styles.dropdownText}>
            Current Theme: {currentTheme === 'alternate' ? 'Low Vision Theme' :
                            currentTheme === 'default' ? 'Normal Theme' : 
                            currentTheme === 'loyalty' ? 'Loyalty Mode' : currentTheme}
          </p>
          <button onClick={toggleSize} className={styles.dropdownButton}>
            Adjust Font Size
          </button>
          <p className={styles.dropdownText}>
            Current Size: {isLargeText === 'original' ? '100%' :
                            isLargeText === 'ten' ? '110%' :
                            isLargeText === 'twenty' ? '120%' :
                            isLargeText === 'thirty' ? '130%' : isLargeText}
          </p>
        </div>
      )}
    </div>
  );
};

export default AccessibilityButton;
