import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Divider } from '@mui/material';
import styles from './updateInventoryItemModal.module.css';

const UpdateInventoryItemModal = ({ isOpen, onClose }) => {
    const [inventoryId, setInventoryId] = useState("");
    const [itemName, setItemName] = useState("");
    const [itemType, setItemType] = useState("");
    const [ingredients, setIngredients] = useState("");
    const [currAmount, setCurrAmount] = useState("");
    const [needed4Week, setNeeded4Week] = useState("");
    const [needed4GameWeek, setNeeded4GameWeek] = useState("");
    const [deleteId, setDeleteId] = useState(""); // State for delete ID

    const handleSubmit = async () => {
        if (
            isNaN(parseInt(inventoryId)) ||
            !itemName ||
            !itemType ||
            isNaN(parseInt(currAmount)) ||
            isNaN(parseInt(needed4Week)) ||
            isNaN(parseInt(needed4GameWeek))
        ) {
            alert("Please fill in all required fields correctly.");
            return;
        }

        try {
            const payload = {
                inventory_id: parseInt(inventoryId),
                item_name: itemName,
                item_type: itemType,
                ingredients: ingredients ? ingredients.split(",").join(",") : null,
                curr_amount: parseInt(currAmount),
                needed4Week: parseInt(needed4Week),        // Match database column casing
                needed4GameWeek: parseInt(needed4GameWeek) // Match database column casing
            };

            const response = await fetch("/api/update-inventory-item", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("Failed to update inventory item");

            alert("Item updated successfully!");
            onClose();
        } catch (error) {
            console.error("Error:", error);
            alert("Error updating inventory item.");
        }
    };

    const handleDelete = async () => {
        if (!deleteId || isNaN(parseInt(deleteId))) {
            alert("Please enter a valid Inventory ID to delete.");
            return;
        }

        try {
            const response = await fetch(`/api/deleteItem`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: parseInt(deleteId) }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to delete item.");
            }

            alert("Item deleted successfully!");
            onClose();
        } catch (error) {
            console.error("Error:", error);
            alert("Error deleting item.");
        }
    };

    const handleResync = async () => {
        try {
            const response = await fetch(`/api/resyncIds`, {
                method: "POST",
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to re-sync IDs.");
            }

            alert("IDs re-synced successfully!");
        } catch (error) {
            console.error("Error:", error);
            alert("Error re-syncing IDs.");
        }
    };

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box className={styles.modalBox}>
                <h2>Update Inventory Item</h2>
                <TextField
                    label="Inventory ID (adds if ID does not exist, updates if ID exists)"
                    type="number"
                    fullWidth
                    margin="normal"
                    value={inventoryId}
                    onChange={(e) => setInventoryId(e.target.value)}
                />
                <TextField
                    label="Item Name"
                    fullWidth
                    margin="normal"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                />
                <TextField
                    label="Item Type"
                    fullWidth
                    margin="normal"
                    value={itemType}
                    onChange={(e) => setItemType(e.target.value)}
                />
                <TextField
                    label="Ingredients (optional, comma-separated)"
                    fullWidth
                    margin="normal"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                />
                <TextField
                    label="Current Amount"
                    type="number"
                    fullWidth
                    margin="normal"
                    value={currAmount}
                    onChange={(e) => setCurrAmount(e.target.value)}
                />
                <TextField
                    label="Needed for Week"
                    type="number"
                    fullWidth
                    margin="normal"
                    value={needed4Week}
                    onChange={(e) => setNeeded4Week(e.target.value)}
                />
                <TextField
                    label="Needed for Game Week"
                    type="number"
                    fullWidth
                    margin="normal"
                    value={needed4GameWeek}
                    onChange={(e) => setNeeded4GameWeek(e.target.value)}
                />
                <Button onClick={handleSubmit} className={styles.modalSubmitButton}>
                    Submit
                </Button>

                {/* Delete Item */}
                <Divider sx={{ my: 2 }} />
                <h3>Delete Item</h3>
                <Box className={styles.modalDeleteBox}>
                    <TextField
                        label="Enter Inventory ID"
                        type="number"
                        fullWidth
                        value={deleteId}
                        onChange={(e) => setDeleteId(e.target.value)}
                    />
                    <Button onClick={handleDelete} className={styles.modalDeleteButton}>
                        Delete
                    </Button>
                </Box>

                {/* Re-Sync IDs */}
                <Divider sx={{ my: 2 }} />
                <Button onClick={handleResync} className={styles.modalSubmitButton}>
                    Re-Sync IDs
                </Button>
            </Box>
        </Modal>
    );
};

export default UpdateInventoryItemModal;