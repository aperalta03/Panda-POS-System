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
    const {
        toggleTheme,
        currentTheme,
        toggleSize,
        isLargeText,
        translations,
    } = useGlobalState();
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [dropdownCoords, setDropdownCoords] = useState({ top: 0, left: 0 });
    const [isSpeaking, setIsSpeaking] = useState(false);
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

    // Handle Text to Speech
    const handleTextToSpeech = () => {
        if (!("speechSynthesis" in window)) {
            alert("Sorry, your browser does not support text-to-speech.");
            return;
        }

        if (isSpeaking) {
            // Stop speech
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        } else {
            // Clone the body
            const clonedBody = document.body.cloneNode(true);

            // Remove the AccessibilityButton element from the clone
            const accessibilityButton = clonedBody.querySelector(
                `.${styles.buttonContainer}`
            );
            if (accessibilityButton) {
                accessibilityButton.remove();
            }

            // Get the text content
            const textContent = clonedBody.innerText || clonedBody.textContent;

            if (textContent) {
                const utterance = new SpeechSynthesisUtterance(textContent);
                // Set language and other properties if needed
                utterance.lang = "en-US";

                utterance.onend = () => {
                    setIsSpeaking(false);
                };

                window.speechSynthesis.speak(utterance);
                setIsSpeaking(true);
            }
        }
    };

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
                        <button
                            onClick={handleTextToSpeech}
                            className={styles.dropdownButton}
                        >
                            {isSpeaking
                                ? translations["Stop Text to Speech"] || "Stop Text to Speech"
                                : translations["Text to Speech"] || "Text to Speech"}
                        </button>
                    </div>,
                    document.body
                )}
        </div>
    );
};

export default AccessibilityButton;