import React, { useState } from 'react';
import { Modal, Box, TextField, Button } from '@mui/material';
import styles from './addMenuModal.module.css';

const AddMenuModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState("Seasonal Item");
  const [price, setPrice] = useState(0.0);
  const [calories, setCalories] = useState(0);
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/updateSeasonalItem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          price,
          calories,
          description: description || null,
          ingredients,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add seasonal item");
      }

      onClose();
    } catch (error) {
      console.error(error);
      alert("Error adding seasonal item.");
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box className={styles.modalBox}>
        <h2>Add Menu Item</h2>
        <TextField label="Item Name" fullWidth margin="normal" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField label="Price" type="number" fullWidth margin="normal" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} />
        <TextField label="Calories" type="number" fullWidth margin="normal" value={calories} onChange={(e) => setCalories(parseInt(e.target.value, 10))} />
        <TextField label="Description" fullWidth margin="normal" value={description} onChange={(e) => setDescription(e.target.value)} />
        <TextField label="Ingredients (comma-separated)" fullWidth margin="normal" value={ingredients} onChange={(e) => setIngredients(e.target.value)} />
        <Button onClick={handleSubmit} className={styles.modalSubmitButton}>Submit</Button>
      </Box>
    </Modal>
  );
};

export default AddMenuModal;