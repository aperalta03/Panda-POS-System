import React, { useState, useEffect } from "react";
import { useGlobalState } from "../../context/GlobalStateContext";
import CustomerPointsModal from "./customerPointsModal";
import Modal from "@mui/material/Modal";
import styles from "./customerSignUpModal.module.css";

const CustomerSignUp = ({ isOpen, onClose }) => {
  const {
    setCustomerPhoneNumber,
    setCustomerName,
    setCustomerTotalPoints,
    translations,
    setIsPandaMember,
  } = useGlobalState();
  const [isPointsModalOpen, setPointsModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  // Reset the input fields whenever the modal is opened
  useEffect(() => {
    if (isOpen) {
      setPhoneNumber("");
      setName("");
      setDateOfBirth("");
    }
  }, [isOpen]);

  // Function to handle form submission
  const handleSubmit = async () => {
    const data = {
      phoneNumber,
      name,
      date_of_birth: dateOfBirth || null, // Optional date of birth
    };

    try {
      const response = await fetch("/api/customerSignUp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        alert("Customer added successfully");
        setCustomerName(name);
        setCustomerPhoneNumber(phoneNumber);
        setCustomerTotalPoints(0);
        setPointsModalOpen(true);
        setIsPandaMember(true);
        onClose(); // Close the modal
      } else {
        alert(result.error || "Failed to add customer");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className={styles.modal}>
        <h2>{translations["Customer Sign Up"] || "Customer Sign Up"}</h2>
        <div className={styles.form}>
          <div>
            <label>{translations["Phone Number:"] || "Phone Number:"}</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <label>{translations["Name:"] || "Name:"}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label>
              {translations["Date of Birth (optional):"] ||
                "Date of Birth (optional):"}
            </label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
          </div>
        </div>
        <div className={styles["button-container"]}>
          <button className={styles["submit-btn"]} onClick={handleSubmit}>
            {translations["Submit"] || "Submit"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CustomerSignUp;
