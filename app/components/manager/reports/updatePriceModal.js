import React, { useState } from 'react';
import { Modal, Box, TextField, Button } from '@mui/material';
import styles from './updatePriceModal.module.css';

const UpdatePriceModal = ({ isOpen, onClose }) => {
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");

  const handleSubmit = async () => {
    if (!itemName || isNaN(parseFloat(itemPrice))) {
      alert("Please enter a valid item name and price.");
      return;
    }

    try {
      const response = await fetch("/api/update-Price", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: itemName,
          price: parseFloat(itemPrice),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update price");
      }

      onClose();
    } catch (error) {
      console.error("Error:", error);
      alert("Error updating price.");
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box className={styles.modalBox}>
        <h2>Update Item Price</h2>
        <TextField label="Item Name" fullWidth margin="normal" value={itemName} onChange={(e) => setItemName(e.target.value)} />
        <TextField label="New Price" type="number" fullWidth margin="normal" value={itemPrice} onChange={(e) => setItemPrice(e.target.value)} />
        <Button onClick={handleSubmit} className={styles.modalSubmitButton}>Submit</Button>
      </Box>
    </Modal>
  );
};

export default UpdatePriceModal;