import React, { useState, useEffect } from "react";
import { useGlobalState } from "../../context/GlobalStateContext"; // Import the globalStateContext;
import Modal from "@mui/material/Modal";
import CustomerSignUp from "./customerSignUpModal"; // Import the sign-up modal
import CustomerPointsModal from "./customerPointsModal"; // Import the points modal
import styles from "./customerLoginModal.module.css";


/**
 * @author Conner Black, Brandon Batac
 * 
 * @description
 * A modal component for logging in a customer using their phone number. 
 * It provides a keypad for input, allows submission of the phone number, 
 * and supports showing error messages. Additionally, the component handles 
 * the opening of the sign-up modal and customer points modal.
 * 
 * @param {object} props - The properties passed to the component.
 * @param {function} props.onClose - Function to close the modal.
 * @param {boolean} props.isOpen - Boolean that determines if the modal is open.
 * 
 * @returns {JSX.Element} The CustomerLogIn component.
 * 
 * @example
 * <CustomerLogIn isOpen={true} onClose={() => {}} />
 * 
 * 
 * @module customerLogInModal
 */

const CustomerLogIn = ({ onClose, isOpen }) => {
  const {
    setCustomerPhoneNumber,
    setCustomerName,
    setCustomerTotalPoints,
    translations,
    setIsPandaMember,
  } = useGlobalState();
  const [isSignUpModalOpen, setSignUpModalOpen] = useState(false);
  const [isPointsModalOpen, setPointsModalOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setInput("");
      setError(null);
    }
  }, [isOpen]);

  // Handle numeric input from the numpad or keyboard
  const handleButtonClick = (value) => {
    setInput((prevInput) => prevInput + value);
  };

  // Handle backspace (remove the last character)
  const handleBackspace = () => {
    setInput((prevInput) => prevInput.slice(0, -1));
  };

  const handleSubmit = async () => {
    if (!input) {
      setError("Please enter a phone number");
      return;
    }
    setIsSubmitting(true); // Disable submit button while submitting
    setError(null); // Reset error message

    try {
      // Send a POST request with the phone number in the body
      const response = await fetch("/api/customerLogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber: input }), // Sending phoneNumber in the body
      });

      const data = await response.json();

      if (response.ok) {
        const { phoneNumber, name, totalPoints } = data.customer;
        alert(`Login successful: ${data.message}`);
        setCustomerName(name);
        setCustomerPhoneNumber(phoneNumber);
        setCustomerTotalPoints(totalPoints);
        setIsPandaMember(true);
        setPointsModalOpen(true); // Open the customer points modal
        onClose(); // Close the login modal on success
      } else {
        setError(data.error || "Login failed");
      }
    } catch (error) {
      setError("Error contacting the server");
      console.error("Error logging in:", error);
    } finally {
      setIsSubmitting(false); // Enable submit button after submitting
    }
  };

  const handleSignUp = () => {
    setSignUpModalOpen(true);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key >= "0" && e.key <= "9") {
      // Handle numeric key presses (0-9)
      handleButtonClick(e.key);
    } else if (e.key === "Backspace") {
      // Handle backspace key to remove the last character
      handleBackspace();
    } else if (e.key === "Enter") {
      // Submit the form when Enter is pressed
      handleSubmit();
    }
  };

  useEffect(() => {
    // Add event listener for keydown events when modal is open
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
    }

    // Cleanup event listener on unmount
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <Modal open={isOpen} onClose={onClose}>
        <div className={styles.modal}>
          <h2>{translations["Customer Login"] || "Customer Login"}</h2>
          <div className={styles.keypad}>
            <div className={styles["input-display"]}>{input}</div>
            <div className={styles["keypad-row"]}>
              <button
                className={styles.button}
                onClick={() => handleButtonClick("1")}
              >
                1
              </button>
              <button
                className={styles.button}
                onClick={() => handleButtonClick("2")}
              >
                2
              </button>
              <button
                className={styles.button}
                onClick={() => handleButtonClick("3")}
              >
                3
              </button>
            </div>
            <div className={styles["keypad-row"]}>
              <button
                className={styles.button}
                onClick={() => handleButtonClick("4")}
              >
                4
              </button>
              <button
                className={styles.button}
                onClick={() => handleButtonClick("5")}
              >
                5
              </button>
              <button
                className={styles.button}
                onClick={() => handleButtonClick("6")}
              >
                6
              </button>
            </div>
            <div className={styles["keypad-row"]}>
              <button
                className={styles.button}
                onClick={() => handleButtonClick("7")}
              >
                7
              </button>
              <button
                className={styles.button}
                onClick={() => handleButtonClick("8")}
              >
                8
              </button>
              <button
                className={styles.button}
                onClick={() => handleButtonClick("9")}
              >
                9
              </button>
            </div>
            <div className={styles["keypad-row"]}>
              <button
                className={styles.button}
                onClick={() => handleButtonClick("0")}
              >
                0
              </button>
              <button className={styles["back-btn"]} onClick={handleBackspace}>
                X
              </button>
            </div>
          </div>

          <div className={styles["button-container"]}>
            <button className={styles["signup-btn"]} onClick={handleSignUp}>
              {translations["Sign Up"] || "Sign Up"}
            </button>
            <button
              className={styles["submit-btn"]}
              onClick={handleSubmit}
              disabled={isSubmitting} // Disable button while submitting
            >
              {isSubmitting
                ? "Submitting..."
                : translations["Submit"] || "Submit"}
            </button>
          </div>

          {/* Display any error message */}
          {error && <div className={styles.error}>{error}</div>}
        </div>
      </Modal>

      {/* Sign Up Modal */}
      <CustomerSignUp
        isOpen={isSignUpModalOpen}
        onClose={() => setSignUpModalOpen(false)} // Close sign-up modal when done
      />

      {/* Customer Points Modal */}
      <CustomerPointsModal
        isOpen={isPointsModalOpen}
        onClose={() => setPointsModalOpen(false)} // Close points modal when done
      />
    </>
  );
};

export default CustomerLogIn;
