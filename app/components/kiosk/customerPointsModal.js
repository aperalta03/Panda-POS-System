import React, { useState, useEffect } from "react";
import { useGlobalState } from "../../context/GlobalStateContext";
import Modal from "@mui/material/Modal";
import styles from "./customerPointsModal.module.css";

/**
 * @author Conner Black, Brandon Batac
 * 
 * @description
 * A modal component that displays the customer's current points and offers 
 * an option to redeem points for a 10% discount once they have accumulated 1000 points. 
 * If the customer does not have enough points, the modal informs them of how many 
 * points are needed. The component interacts with an API to apply the discount.
 * 
 * @param {object} props - The properties passed to the component.
 * @param {boolean} props.isOpen - Boolean that determines if the modal is open.
 * @param {function} props.onClose - Function to close the modal.
 * 
 * @returns {JSX.Element} The CustomerPointsModal component.
 * 
 * @example
 * <CustomerPointsModal isOpen={true} onClose={() => {}} />
 * 
 * 
 * @module customerPointsModal
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
        `You are ${pointsNeeded} points away from earning 1000 points for a 10% discount.`
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
