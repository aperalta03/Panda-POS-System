import React, { useState, useEffect } from "react";
import { useGlobalState } from "../../context/GlobalStateContext";
import Modal from "@mui/material/Modal";
import styles from "./customerPointsModal.module.css";

/**
 * Customer Points Modal Component
 *
 * @author Conner Black
 *
 * @description
 * A modal component that displays the customer's current points and offers an option to redeem points
 * for a 10% discount once they have accumulated 1000 points. If the customer does not have enough points,
 * the modal informs them of how many points are needed. The component interacts with an API to apply the discount.
 *
 * @features
 * - Points Display: Shows the customer's total points and a message based on the points balance.
 * - Points Redemption: Allows customers to redeem 1000 points for a 10% discount.
 * - API Integration: Sends the updated points to the server when a discount is applied.
 * - Modal Interaction: Opens and closes the modal based on the `isOpen` prop.
 * - Dynamic Message: Displays a message indicating whether the customer is eligible for the discount or how many points are needed.
 *
 * @state
 * - `modalMessage`: A dynamic message that displays whether the customer can redeem points or how many more points they need.
 *
 * @methods
 * - `handleApplyDiscount`: Sends the request to the server to apply the discount after validating the customer's points.
 *
 * @dependencies
 * - React: For component structure and state management.
 * - Material-UI: For the modal component and styling.
 * - `GlobalStateContext`: For accessing and updating customer data such as total points and phone number.
 *
 * @example
 * <CustomerPointsModal isOpen={true} onClose={() => {}} />
 */

const CustomerPointsModal = ({ onClose, isOpen }) => {
  const {
    customerTotalPoints,
    customerPhoneNumber,
    setCustomer10PercentOff,
    currentLanguage,
    setCustomerName,
    translations,
  } = useGlobalState();
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    if (customerTotalPoints >= 1000) {
      console.log(customerTotalPoints);
      setModalMessage(
        currentLanguage === "en"
          ? `You have ${customerTotalPoints} points! Would you like to use 1000 points for a 10% discount?`
          : translations["You have"] +
              ` ${customerTotalPoints} ` +
              translations[
                "points! Would you like to use 1000 points for a 10% discount?"
              ]
      );
    } else {
      console.log(customerTotalPoints);
      const pointsNeeded = 1000 - customerTotalPoints;
      setModalMessage(
        `You are ${pointsNeeded} points away from earning a 10% discount.`
      );
    }
    setCustomer10PercentOff(customerTotalPoints > 1000);
  }, [customerTotalPoints]);

  const handleApplyDiscount = async () => {
    if (!customerPhoneNumber || !customerTotalPoints) {
      alert("Error: Customer data is missing.");
      return;
    }

    const response = await fetch("/api/updateCustomerPoints", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        points: customerTotalPoints - 1000,
        phoneNumber: customerPhoneNumber,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      alert("You've used 1000 points for a 10% discount!");
      setCustomer10PercentOff(customerTotalPoints > 1000);
      onClose(); // Close the modal after successful update
    } else {
      const data = await response.json();
      alert(data.error || "Failed to apply discount");
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="customer-points-modal"
      aria-describedby="customer-points-description"
    >
      <div className={styles.modalContent}>
        <h2>{translations["Customer Points"] || "Customer Points"}</h2>
        <p>{modalMessage}</p>

        {customerTotalPoints >= 1000 ? (
          <div>
            <button
              className={`${styles.button} ${styles.redButton}`}
              onClick={handleApplyDiscount} // Run the API call when clicked
            >
              {translations["Use 1000 points for 10% off"] ||
                "Use 1000 points for 10% off"}
            </button>
            <button className={styles.button} onClick={onClose}>
              {translations["Cancel"] || "Cancel"}
            </button>
          </div>
        ) : (
          <div>
            <button
              className={`${styles.button} ${styles.redButton}`}
              onClick={onClose}
            >
              {translations["Close"] || "Close"}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CustomerPointsModal;
