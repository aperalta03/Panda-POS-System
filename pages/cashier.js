import React, { useState } from "react";
import ButtonGrid from "../app/components/cashier/buttonGrid";
import OrderPanel from "../app/components/cashier/orderPanel";
import BottomPanel from "../app/components/cashier/bottomPanel";
import styles from "./cashier.module.css";
import { useUser } from "../app/context/userProvider";
import { Modal, Box, TextField, Button } from "@mui/material";

const CashierPage = () => {
  const { employeeID } = useUser();

  const plateSizes = ["Bowl", "Plate", "Bigger Plate", "A La Carte"];
  const sides = ["Super Greens", "Chow Mein", "White Steamed Rice", "Fried Rice"];

  const [netCost, setNetCost] = useState(0.0);
  const [quantities, setQuantities] = useState({
    "Bowl": 0,
    "Plate": 0,
    "Bigger Plate": 0,
    "A La Carte": 0,
    "Bottle Drink": 0,
    "Fountain Drink": 0,
    "Dumplings": 0,
    "Orange Chicken": 0,
    "Honey Walnut Shrimp": 0,
    "Grilled Teriyaki Chicken": 0,
    "Broccoli Beef": 0,
    "Kung Pao Chicken": 0,
    "Black Pepper Sirloin Steak": 0,
    "Honey Sesame Chicken": 0,
    "Beijing Beef": 0,
    "Mushroom Chicken": 0,
    "SweetFire Chicken": 0,
    "String Bean Chicken": 0,
    "Black Pepper Chicken": 0,
    "Super Greens": 0,
    "Chow Mein": 0,
    "Fried Rice": 0,
    "White Steamed Rice": 0,
    "Chicken Egg Roll": 0,
    "Veggie Spring Roll": 0,
    "Cream Cheese Rangoon": 0,
    "Apple Pie Roll": 0,
    "Seasonal Item": 0,
  });

  const [priceMap, setPriceMap] = useState({
    "Bowl": 8.3,
    "Plate": 9.8,
    "Bigger Plate": 11.5,
    "A La Carte": 0.0,
    "Bottle Drink": 2.3,
    "Fountain Drink": 2.3,
    "Dumplings": 1.99,
    "Orange Chicken": 8.5,
    "Honey Walnut Shrimp": 8.5,
    "Grilled Teriyaki Chicken": 8.5,
    "Broccoli Beef": 8.5,
    "Kung Pao Chicken": 8.5,
    "Black Pepper Sirloin Steak": 8.5,
    "Honey Sesame Chicken": 8.5,
    "Beijing Beef": 8.5,
    "Mushroom Chicken": 8.5,
    "SweetFire Chicken": 8.5,
    "String Bean Chicken": 8.5,
    "Black Pepper Chicken": 8.5,
    "Super Greens": 4.4,
    "Chow Mein": 4.4,
    "Fried Rice": 4.4,
    "White Steamed Rice": 4.4,
    "Chicken Egg Roll": 2,
    "Veggie Spring Roll": 2,
    "Cream Cheese Rangoon": 2,
    "Apple Pie Roll": 2.99,
    "Seasonal Item": 0.0,
  });

  const [orders, setOrders] = useState([]);
  const [seasonalItemName, setSeasonalItemName] = useState("Seasonal Item");
  const [seasonalItemPrice, setSeasonalItemPrice] = useState(0.0);
  const [seasonalItemIngredients, setSeasonalItemIngredients] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [seasonalItemActive, setSeasonalItemActive] = useState(false);

  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [adjustItemName, setAdjustItemName] = useState("");
  const [adjustItemPrice, setAdjustItemPrice] = useState("");

  const handleAdjustOpen = () => setAdjustModalOpen(true);
  const handleAdjustClose = () => {
    setAdjustItemName("");
    setAdjustItemPrice("");
    setAdjustModalOpen(false);
  };
  const [minQuantities, setMinQuantities] = useState({});

  const handlePayClick = async () => {
    const now = new Date();
    const saleDate = now.toISOString().split("T")[0];
    const saleTime = now.toTimeString().split(" ")[0];
    const orderDetails = {
      saleDate,
      saleTime,
      totalPrice: (netCost + netCost * 0.0625).toFixed(2),
      employeeID,
      orders: orders,
      source: "Cashier",
    };

    if (!saleDate || !saleTime || !employeeID || !orderDetails.orders.length) {
      console.error("Missing critical order details:", {
        saleDate,
        saleTime,
        employeeID,
        orders: orderDetails.orders,
      });
      alert("Order details are incomplete. Please try again.");
      return;
    }

    try {
      const response = await fetch(
        `${window.location.origin}/api/updateSalesRecord`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderDetails),
        }
      );

      if (response.ok) {
        console.log("Order saved successfully");
      } else {
        const errorData = await response.json();
        console.error("Failed to save order", errorData);
      }
    } catch (error) {
      console.error("Error:", error);
    }

    setNetCost(0);
    setQuantities(
      Object.keys(quantities).reduce((acc, item) => ({ ...acc, [item]: 0 }), {})
    );
    setOrders([]);
  };

  const addOrderToPanel = (plateSize, components) => {
    setOrders((prevOrders) => [...prevOrders, { plateSize, components }]);

    // Ensure minQuantities is set correctly for plate sizes and items
    setMinQuantities((prevMin) => {
      const updatedMin = { ...prevMin };

      // Increment the minimum quantity for each item in the order
      components.forEach((item) => {
        if (sides.includes(item)) {
          // Increment by 0.5 for sides
          updatedMin[item] = (updatedMin[item] || 0) + 0.5;
        } else {
          // Increment by 1 for non-side items
          updatedMin[item] = (updatedMin[item] || 0) + 1;
        }
      });

      return updatedMin;
    });
  };

  const deleteOrder = (index) => {
    const orderToDelete = orders[index];
    const orderCost =
      orderToDelete.plateSize === "A La Carte"
        ? orderToDelete.components.reduce(
            (total, item) => total + priceMap[item],
            0
          )
        : priceMap[orderToDelete.plateSize];

    setNetCost((prev) => prev - orderCost);

    // Create copies of the current quantities and minQuantities
    const updatedQuantities = { ...quantities };
    const updatedMinQuantities = { ...minQuantities };

    // Decrease the quantity of the plate size by 1 if it is a plate size
    if (plateSizes.includes(orderToDelete.plateSize)) {
      updatedQuantities[orderToDelete.plateSize] = Math.max(
        (updatedQuantities[orderToDelete.plateSize] || 0) - 1,
        0
      );
    }

    // Decrease the quantity of each item in the order
    orderToDelete.components.forEach((item) => {
      if (sides.includes(item)) {
        // Decrement by 0.5 for side items
        updatedQuantities[item] = Math.max(
          (updatedQuantities[item] || 0) - 0.5,
          0
        );
        updatedMinQuantities[item] = Math.max(
          (updatedMinQuantities[item] || 0) - 0.5,
          0
        );
      } else {
        // Decrement by 1 for non-side items
        updatedQuantities[item] = Math.max(
          (updatedQuantities[item] || 0) - 1,
          0
        );
        updatedMinQuantities[item] = Math.max(
          (updatedMinQuantities[item] || 0) - 1,
          0
        );
      }
    });

    // Update state with the modified quantities and minQuantities
    setQuantities(updatedQuantities);
    setMinQuantities(updatedMinQuantities);
    setOrders((prevOrders) => prevOrders.filter((_, i) => i !== index));
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
      setItemIngredientsMap((prevItemIngredientsMap) => ({
        ...prevItemIngredientsMap,
        ["Seasonal Item"]: seasonalItemIngredients
          .split(",")
          .map((ingredient) => ingredient.trim()),
      }));
      setSeasonalItemActive(true);
      handleModalClose();
    } catch (error) {
      console.error(error);
      alert("Error updating seasonal item.");
    }
  };

  const handleSeasonalAddDelete = () => {
    if (seasonalItemActive) {
      setSeasonalItemName("Seasonal Item");
      setPriceMap((prevPriceMap) => ({
        ...prevPriceMap,
        ["Seasonal Item"]: 0.0,
      }));
      setItemIngredientsMap((prevItemIngredientsMap) => {
        const { ["Seasonal Item"]: _, ...newMap } = prevItemIngredientsMap;
        return newMap;
      });
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        ["Seasonal Item"]: 0,
      }));
      setSeasonalItemActive(false);
    } else {
      handleModalOpen();
    }
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.layout}>
        <OrderPanel
          orders={orders}
          onDelete={deleteOrder}
          seasonalItemName={seasonalItemName}
        />
        <ButtonGrid
          setNetCost={setNetCost}
          priceMap={priceMap}
          quantities={quantities}
          setQuantities={setQuantities}
          addOrderToPanel={addOrderToPanel}
          seasonalItemName={seasonalItemName}
          seasonalItemActive={seasonalItemActive}
          minQuantities={minQuantities}
          sides={sides}
        />
      </div>
      <BottomPanel
        netCost={netCost}
        handlePayClick={handlePayClick}
        handleSeasonalAddDelete={handleSeasonalAddDelete}
        seasonalItemActive={seasonalItemActive}
        handleAdjust={handleAdjustOpen}
      />

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

export default CashierPage;