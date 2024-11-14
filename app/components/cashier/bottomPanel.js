import React, { useState } from "react";
import { Modal, Box, TextField, Button } from "@mui/material";
import styles from "./cashier.module.css";

const BottomPanel = ({
  netCost,
  handlePayClick,
  priceMap,
  setPriceMap,
  setQuantities,
  seasonalItemActive,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [seasonalItemName, setSeasonalItemName] = useState("Seasonal Item");
  const [seasonalItemPrice, setSeasonalItemPrice] = useState(0.0);
  const [seasonalItemIngredients, setSeasonalItemIngredients] = useState("");
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [adjustItemName, setAdjustItemName] = useState("");
  const [adjustItemPrice, setAdjustItemPrice] = useState("");

  // Modal handlers for seasonal item
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

  const handleModalSubmit = async () => {
    try {
      const response = await fetch("/api/updateSeasonalItem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: seasonalItemName,
          price: seasonalItemPrice,
          ingredients: seasonalItemIngredients,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update seasonal item");
      }

      setPriceMap((prevPriceMap) => ({
        ...prevPriceMap,
        ["Seasonal Item"]: seasonalItemPrice,
      }));

      setModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Error updating seasonal item.");
    }
  };

  // Modal handlers for adjusting item price
  const handleAdjustOpen = () => setAdjustModalOpen(true);
  const handleAdjustClose = () => {
    setAdjustItemName("");
    setAdjustItemPrice("");
    setAdjustModalOpen(false);
  };

  const handleAdjustSubmit = async () => {
    if (!adjustItemName || isNaN(parseFloat(adjustItemPrice))) {
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
          name: adjustItemName,
          price: parseFloat(adjustItemPrice),
        }),
      });

      if (response.ok) {
        setPriceMap((prevPriceMap) => ({
          ...prevPriceMap,
          [adjustItemName]: parseFloat(adjustItemPrice),
        }));
        handleAdjustClose();
      } else {
        console.error("Failed to update price");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSeasonalAddDelete = () => {
    if (seasonalItemActive) {
      setSeasonalItemName("Seasonal Item");
      setPriceMap((prevPriceMap) => ({
        ...prevPriceMap,
        ["Seasonal Item"]: 0.0,
      }));
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        ["Seasonal Item"]: 0,
      }));
    } else {
      handleModalOpen();
    }
  };

  return (
    <div className={styles.bottomPanel}>
      <div className={styles.leftPanel}>
        <div className={styles.labels}>
          <h2 className={styles.netLabel}>Net: ${netCost.toFixed(2)}</h2>
          <h2 className={styles.taxLabel}>
            Tax: ${(netCost * 0.0625).toFixed(2)}
          </h2>
          <h1 className={styles.totalLabel}>
            TOTAL | ${(netCost + netCost * 0.0625).toFixed(2)}
          </h1>
        </div>
        <button onClick={handlePayClick} className={styles.payButton}>
          PAY
        </button>
      </div>

      <div className={styles.rightPanel}>
        <button onClick={handleSeasonalAddDelete} className={styles.addItem}>
          {seasonalItemActive ? "DELETE MENU ITEM" : "ADD MENU ITEM"}
        </button>
        <button onClick={handleAdjustOpen} className={styles.adjustButton}>
          ADJUST ITEM
        </button>
      </div>

      {/* Modal for Seasonal Item */}
      <Modal open={modalOpen} onClose={handleModalClose}>
        <Box className={styles.modalBox}>
          <h2>Add Seasonal Item</h2>
          <TextField
            label="Seasonal Item Name"
            fullWidth
            margin="normal"
            value={seasonalItemName}
            onChange={(e) => setSeasonalItemName(e.target.value)}
          />
          <TextField
            label="Price"
            type="number"
            fullWidth
            margin="normal"
            value={seasonalItemPrice}
            onChange={(e) => setSeasonalItemPrice(parseFloat(e.target.value))}
          />
          <TextField
            label="Ingredients (comma-separated)"
            fullWidth
            margin="normal"
            value={seasonalItemIngredients}
            onChange={(e) => setSeasonalItemIngredients(e.target.value)}
          />
          <Button
            onClick={handleModalSubmit}
            className={styles.modalSubmitButton}
          >
            Submit
          </Button>
        </Box>
      </Modal>

      {/* Modal for Adjusting Item Price */}
      <Modal open={adjustModalOpen} onClose={handleAdjustClose}>
        <Box className={styles.modalBox}>
          <h2>Adjust Item Price</h2>
          <TextField
            label="Item Name"
            fullWidth
            margin="normal"
            value={adjustItemName}
            onChange={(e) => setAdjustItemName(e.target.value)}
          />
          <TextField
            label="New Price"
            type="number"
            fullWidth
            margin="normal"
            value={adjustItemPrice}
            onChange={(e) => setAdjustItemPrice(e.target.value)}
          />
          <Button
            onClick={handleAdjustSubmit}
            className={styles.modalSubmitButton}
          >
            Submit
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default BottomPanel;