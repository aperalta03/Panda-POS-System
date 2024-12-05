import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { useGlobalState } from "../app/context/GlobalStateContext";
import styles from "./accessButton.module.css";

/**
 * @description
 * This component provides accessibility options for the site, including:
 * - Switching between themes (e.g., low-vision theme, normal theme).
 * - Adjusting the font size.
 * - A text-to-speech feature to summarize and read out page content.
 * 
 * @author Uzair Khan, Alonso Peralta Espinosas, Anson Thai
 *
 * @returns {JSX.Element} The AccessibilityButton component.
 * 
 * @example
 * // Usage example
 * <AccessibilityButton />
 * 
 * @module accessButton
 */

/**
 * @description
 * Handles theme toggling, font resizing, and text-to-speech functionality via a dropdown menu.
 * 
 * @authon Uzair Khan, Alonso Peralta Espinosas
 *
 * @returns {JSX.Element} The accessibility button with dropdown functionality.
 * 
 * @function AccessibilityButton
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
    const [loading, setLoading] = useState(false); // New state to manage loading
    const buttonRef = useRef(null);
    const dropdownRef = useRef(null);


    /**
     * Handles the button click event by toggling the visibility of the dropdown menu.
     * Prevents the event from propagating up the DOM tree.
     * @param {Event} e - The event object containing information about the button click.
     * @returns {void}
     * @author Uzair Khan
     * @function handleButtonClick
     */
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
     * @description
     * Handles the logic for closing the dropdown menu when
     * the user clicks outside of it.
     * 
     * @author Uzair Khan
     * 
     * @param {MouseEvent} event The event object from the mousedown event.
     * @function handleClickOutside
     * @private
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




    /**
      * Handles text-to-speech functionality by summarizing page content and reading it aloud.
      *
      * - Sends the page content to the AI API for summarization.
      * - Plays the AI response using the Web Speech API.
      * @author Anson Thai
      * @async s
      * @function handleTextToSpeech
      * @throws Will alert the user if text-to-speech is not supported.
      */
    const handleTextToSpeech = async () => {
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
            console.log(textContent);

            // Send the text content to the OpenAI API
            if (textContent) {
                setLoading(true); // Set loading state
                try {
                    const response = await fetch("/api/ai-brain", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            chatContext: [],
                            userMessage: `
                                            Make an independent summary of the following content for use in text-to-speech. 
                                            Focus only on information relevant to a customer ordering at a kiosk. 
                                            Exclude any unnecessary details or interface text, and provide clear and concise descriptions. 
                                            Include the names, descriptions, and prices of menu items, but avoid emojis or extraneous formatting.
                                        ` + textContent,
                        }),
                    });

                    if (!response.ok) {
                        throw new Error("Failed to fetch AI response.");
                    }

                    const data = await response.json();
                    const aiResponse = data.response?.trim();
                    console.log(aiResponse);

                    if (aiResponse) {
                        const utterance = new SpeechSynthesisUtterance(aiResponse);
                        utterance.lang = "en-US";

                        utterance.onend = () => {
                            setIsSpeaking(false);
                        };

                        window.speechSynthesis.speak(utterance);
                        setIsSpeaking(true);
                    } else {
                        alert("No response from AI.");
                    }
                } catch (error) {
                    console.error("Error:", error);
                    alert("An error occurred while fetching AI response.");
                } finally {
                    setLoading(false); // Reset loading state
                }
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