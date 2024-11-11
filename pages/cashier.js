import React, { useState, useEffect } from "react";
import styles from "./cashier.module.css";
import { Modal, Box, TextField, Button } from "@mui/material";

const ButtonGrid = ({
  setNetCost,
  priceMap,
  quantities,
  setQuantities,
  addOrderToPanel,
  seasonalItemName,
  seasonalItemActive,
  minQuantities,
  sides,
}) => {
  const menuItems = [
    "Bowl",
    "Plate",
    "Bigger Plate",
    "A La Carte",
    "Fountain Drink",
    "Bottled Drink",
    "Super Greens",
    "Chow Mein",
    "White Steamed Rice",
    "Fried Rice",
    "Chicken Egg Roll",
    "Veggie Egg Roll",
    "Cream Cheese Rangoon",
    "Apple Pie Roll",
    "Orange Chicken",
    "Black Pepper Sirloin Steak",
    "Honey Walnut Shrimp",
    "Grilled Teriyaki Chicken",
    "Broccoli Beef",
    "Kung Pao Chicken",
    "Honey Sesame Chicken",
    "Beijing Beef",
    "Mushroom Chicken",
    "SweetFire Chicken",
    "String Bean Chicken",
    "Black Pepper Chicken",
    "Seasonal Item",
  ];
  const entrees = [
    "Orange Chicken",
    "Black Pepper Sirloin Steak",
    "Honey Walnut Shrimp",
    "Grilled Teriyaki Chicken",
    "Broccoli Beef",
    "Kung Pao Chicken",
    "Honey Sesame Chicken",
    "Beijing Beef",
    "Mushroom Chicken",
    "SweetFire Chicken",
    "String Bean Chicken",
    "Black Pepper Chicken",
    "Seasonal Item",
  ];
  const plateSizes = ["Bowl", "Plate", "Bigger Plate", "A La Carte"];
  const foodItems = menuItems.filter((item) => !plateSizes.includes(item));

  const [disabledItems, setDisabledItems] = useState(foodItems);
  const [enabledItems, setEnabledItems] = useState(plateSizes);
  const [plateQuantity, setPlateQuantity] = useState(0);
  const [currPlate, setCurrPlate] = useState("");
  const [associatedItems, setAssociatedItems] = useState([]);
  const [isEnterEnabled, setIsEnterEnabled] = useState(false);

  const updateQuantity = (item, amount) => {
    const incrementAmount = sides.includes(item) ? amount * 0.5 : amount;

    setQuantities((prev) => {
      const currentQuantity = prev[item];
      const newQuantity = currentQuantity + incrementAmount;

      // Ensure the quantity doesn't go below the minimum
      const minQuantity = minQuantities[item] || 0;

      // Check if decrementing would result in a quantity below the minimum
      if (
        incrementAmount < 0 &&
        currentQuantity + incrementAmount < minQuantity
      ) {
        return prev; // Prevent decrement if it would drop below minQuantity
      }

      return {
        ...prev,
        [item]: Math.max(newQuantity, minQuantity),
      };
    });

    // Temporary variable to hold the updated associated items
    let updatedAssociatedItems = [...associatedItems];

    if (item === "A La Carte") {
      setCurrPlate("A La Carte");
      setIsEnterEnabled(true);
      setEnabledItems(foodItems);
      setDisabledItems(plateSizes);
      updatedAssociatedItems = [];
    } else if (plateSizes.includes(item)) {
      setCurrPlate(item);
      setEnabledItems(sides);
      setDisabledItems([...menuItems.filter((i) => !sides.includes(i))]);
      updatedAssociatedItems = [];
      setPlateQuantity(0);
    } else if (currPlate === "A La Carte") {
      // Modified handling for A La Carte items (sides and entrees)
      if (incrementAmount < 0) {
        // If decrementing, remove the item from associatedItems
        updatedAssociatedItems = updatedAssociatedItems.filter(
          (associatedItem, index) => {
            // Only remove one instance of the item
            if (associatedItem === item) {
              // Skip the first matching instance
              return index !== updatedAssociatedItems.indexOf(item);
            }
            return true;
          }
        );
      } else {
        // If incrementing, add the item to associatedItems
        updatedAssociatedItems.push(item);
      }
    } else if (sides.includes(item)) {
      // Keep the existing logic for sides
      const currentQuantity = quantities[item];
      const minQuantity = minQuantities[item] || 0;
      if (!(incrementAmount < 0 && currentQuantity <= minQuantity)) {
        setPlateQuantity((prev) => prev + incrementAmount);

        if (incrementAmount < 0) {
          updatedAssociatedItems = updatedAssociatedItems.filter(
            (i) => i !== item
          );
        } else {
          updatedAssociatedItems.push(item);
        }
      }

      if (plateQuantity + incrementAmount >= 1 && currPlate !== "A La Carte") {
        setEnabledItems(entrees);
        setDisabledItems([...menuItems.filter((i) => !entrees.includes(i))]);
      }
    } else if (entrees.includes(item)) {
      // Keep the existing logic for entrees
      const currentQuantity = quantities[item];
      const minQuantity = minQuantities[item] || 0;
      if (!(incrementAmount < 0 && currentQuantity <= minQuantity)) {
        setPlateQuantity((prev) => prev + incrementAmount);

        if (incrementAmount < 0) {
          updatedAssociatedItems = updatedAssociatedItems.filter(
            (i) => i !== item
          );
        } else {
          updatedAssociatedItems.push(item);
        }
        // Run the final check with the updated associated items
        checkQuantity(
          plateQuantity + incrementAmount,
          currPlate,
          updatedAssociatedItems
        );
      }
    }

    // Update the associated items state after modifications
    setAssociatedItems(updatedAssociatedItems);
  };

  const checkQuantity = (currentPlateQuantity, currentPlate, items) => {
    const requiredQuantities = {
      Bowl: 2,
      Plate: 3,
      "Bigger Plate": 4,
    };
    if (
      currentPlate !== "A La Carte" &&
      currentPlateQuantity >= requiredQuantities[currentPlate]
    ) {
      const updatedItems = items.map((item) =>
        item === "Seasonal Item" ? seasonalItemName : item
      );
      addOrderToPanel(currentPlate, updatedItems);
      setDisabledItems(foodItems);
      setEnabledItems(plateSizes);
      setCurrPlate("");
      setPlateQuantity(0);
      setAssociatedItems([]);
      setNetCost((prev) => prev + priceMap[currentPlate]);
    }
  };

  const handleEnterClick = () => {
    if (currPlate === "A La Carte") {
      const updatedItems = associatedItems.map((item) =>
        item === "Seasonal Item" ? seasonalItemName : item
      );
      const aLaCarteCost = associatedItems.reduce(
        (total, item) => total + priceMap[item],
        0
      );

      setNetCost((prevNetCost) => prevNetCost + aLaCarteCost);
      addOrderToPanel("A La Carte", associatedItems);

      setDisabledItems(foodItems);
      setEnabledItems(plateSizes);
      setCurrPlate("");
      setPlateQuantity(0);
      setIsEnterEnabled(false);
      setAssociatedItems([]);
    }
  };

  return (
    <div className={styles.buttonGrid}>
      {menuItems.map(
        (item) =>
          (item !== "Seasonal Item" || seasonalItemActive) && (
            <div key={item} className={styles.gridItem}>
              <button
                onClick={() => updateQuantity(item, 1)}
                className={`${styles.itemButton} ${
                  disabledItems.includes(item) ? styles.itemButtonDisabled : ""
                } ${
                  enabledItems.includes(item) ? styles.itemButtonEnabled : ""
                }`}
                disabled={disabledItems.includes(item)}
              >
                {item === "Seasonal Item" ? seasonalItemName : item}{" "}
              </button>
              <span className={styles.quantity}>{quantities[item]}</span>
              {!plateSizes.includes(item) && (
                <button
                  onClick={() => updateQuantity(item, -1)}
                  className={styles.minusButton}
                  disabled={disabledItems.includes(item)}
                >
                  –
                </button>
              )}
              {item === "A La Carte" && isEnterEnabled && (
                <button
                  onClick={handleEnterClick}
                  className={styles.enterButton}
                >
                  Enter
                </button>
              )}
            </div>
          )
      )}
    </div>
  );
};

const BottomPanel = ({
  netCost,
  handlePayClick,
  handleSeasonalAddDelete,
  seasonalItemActive,
  handleAdjust,
}) => (
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
      <button onClick={handleAdjust} className={styles.adjustButton}>
        ADJUST ITEM
      </button>
    </div>
  </div>
);

const OrderPanel = ({ orders, onDelete, seasonalItemName }) => {
  return (
    <div className={styles.orderPanel}>
      <h1>ORDER TOTAL</h1>
      {orders.map((order, index) => (
        <div
          key={index}
          className={`${styles.orderRow} ${
            index % 2 === 0 ? styles.evenRow : styles.oddRow
          }`}
        >
          <span>
            {order.plateSize} (
            {order.items
              .map((item) =>
                item === "Seasonal Item" ? seasonalItemName : item
              )
              .join(", ")}
            )
          </span>
          <button
            onClick={() => onDelete(index)}
            className={styles.deleteButton}
          >
            DELETE
          </button>
        </div>
      ))}
    </div>
  );
};

const CashierPage = () => {
  const plateSizes = ["Bowl", "Plate", "Bigger Plate", "A La Carte"]; // Define plateSizes here as passing as prop causes bugs
  const sides = [
    "Super Greens",
    "Chow Mein",
    "White Steamed Rice",
    "Fried Rice",
  ];

  const [netCost, setNetCost] = useState(0.0);
  const [quantities, setQuantities] = useState({
    Bowl: 0,
    Plate: 0,
    "Bigger Plate": 0,
    "A La Carte": 0,
    "Fountain Drink": 0,
    "Bottled Drink": 0,
    "Super Greens": 0,
    "Chow Mein": 0,
    "White Steamed Rice": 0,
    "Fried Rice": 0,
    "Chicken Egg Roll": 0,
    "Veggie Egg Roll": 0,
    "Cream Cheese Rangoon": 0,
    "Apple Pie Roll": 0,
    "Orange Chicken": 0,
    "Black Pepper Sirloin Steak": 0,
    "Honey Walnut Shrimp": 0,
    "Grilled Teriyaki Chicken": 0,
    "Broccoli Beef": 0,
    "Kung Pao Chicken": 0,
    "Honey Sesame Chicken": 0,
    "Beijing Beef": 0,
    "Mushroom Chicken": 0,
    "SweetFire Chicken": 0,
    "String Bean Chicken": 0,
    "Black Pepper Chicken": 0,
    "Seasonal Item": 0,
  });

  const [orders, setOrders] = useState([]);

  const [priceMap, setPriceMap] = useState({
    Bowl: 8.3,
    Plate: 9.8,
    "Bigger Plate": 11.3,
    "A La Carte": 0.0,
    "Fountain Drink": 2.9,
    "Bottled Drink": 3.4,
    "Chicken Egg Roll": 2.5,
    "Veggie Egg Roll": 2.5,
    "Cream Cheese Rangoon": 2.5,
    "Apple Pie Roll": 2.5,
    "Orange Chicken": 6.5,
    "Honey Walnut Shrimp": 8.4,
    "Grilled Teriyaki Chicken": 6.5,
    "Broccoli Beef": 6.5,
    "Kung Pao Chicken": 6.5,
    "Honey Sesame Chicken": 6.5,
    "Beijing Beef": 6.5,
    "Mushroom Chicken": 6.5,
    "SweetFire Chicken": 6.5,
    "String Bean Chicken": 6.5,
    "Black Pepper Chicken": 8.4,
    "Black Pepper Sirloin Steak": 8.4,
    "Chow Mein": 5.5,
    "Fried Rice": 5.5,
    "White Steamed Rice": 5.5,
    "Super Greens": 5.5,
    "Seasonal Item": 0.0,
  });

  const [itemIngredientsMap, setItemIngredientsMap] = useState({});
  const [seasonalItemName, setSeasonalItemName] = useState("Seasonal Item");
  const [seasonalItemPrice, setSeasonalItemPrice] = useState(0.0);
  const [seasonalItemIngredients, setSeasonalItemIngredients] = useState("");
  const [employeeID, setEmployeeID] = useState(null);
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

  // Retrieve employeeID from localStorage on component mount
  useEffect(() => {
    const storedEmployeeID = localStorage.getItem("employeeID");
    if (storedEmployeeID) {
      setEmployeeID(storedEmployeeID);
    }
  }, []);

  const handlePayClick = async () => {
    // Get current date and time
    const now = new Date();
    const saleDate = now.toISOString().split("T")[0]; // YYYY-MM-DD format
    const saleTime = now.toTimeString().split(" ")[0]; // HH:MM:SS format

    // Prepare the order details
    const orderDetails = {
      saleDate,
      saleTime,
      totalPrice: (netCost + netCost * 0.0625).toFixed(2),
      employeeID,
      items: orders,
      source: 'Cashier',
    };

    try {
      const response = await fetch(
        `${window.location.origin}/api/updateSalesRecord`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
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

    // Reset UI state after payment
    setNetCost(0);
    setQuantities(
      Object.keys(quantities).reduce((acc, item) => ({ ...acc, [item]: 0 }), {})
    );
    setOrders([]); // Clear all orders in the UI
  };

  const addOrderToPanel = (plateSize, items) => {
    setOrders((prevOrders) => [...prevOrders, { plateSize, items }]);

    // Ensure minQuantities is set correctly for plate sizes and items
    setMinQuantities((prevMin) => {
      const updatedMin = { ...prevMin };

      // Increment the minimum quantity for each item in the order
      items.forEach((item) => {
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
        ? orderToDelete.items.reduce((total, item) => total + priceMap[item], 0)
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
    orderToDelete.items.forEach((item) => {
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
