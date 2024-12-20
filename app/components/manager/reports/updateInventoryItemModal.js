import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Divider } from '@mui/material';
import styles from './updateInventoryItemModal.module.css';


/**
 * @description
 * A React modal component for managing inventory items. This component provides
 * functionality for creating new inventory items, updating existing ones, deleting
 * items, and re-syncing IDs between related database tables. Input fields dynamically
 * adjust based on whether the inventory ID is new or existing.
 * 
 * @author Anson Thai
 *
 * @param {object} props - The properties passed to the component.
 * @param {boolean} props.isOpen - Controls whether the modal is visible.
 * @param {function} props.onClose - Callback function to close the modal.
 *
 * @returns {React.ReactElement} The rendered UpdateInventoryItemModal component.
 *
 * @example
 * <UpdateInventoryItemModal isOpen={true} onClose={() => setModalOpen(false)} />
 *
 * @module updateInventoryItemModal
 */
const UpdateInventoryItemModal = ({ isOpen, onClose }) => {
    const [inventoryId, setInventoryId] = useState(""); // Inventory ID (unique IDs will add item, existing IDs will modify item)
    const [itemName, setItemName] = useState(""); // Item Name
    const [itemType, setItemType] = useState(""); // Item Type
    const [ingredients, setIngredients] = useState(""); // Ingredients (optional, comma-separated)
    const [currAmount, setCurrAmount] = useState(""); // Current Amount
    const [needed4week, setNeeded4week] = useState(""); // Needed for Week
    const [needed4gameweek, setNeeded4gameweek] = useState(""); // Needed for Game Week
    const [deleteId, setDeleteId] = useState(""); // Inventory ID for deletion

    /**
     * Handles submitting the form data to the API.
     * Validates input data and sends a POST request to `/api/update-inventory-item`.
     */
    const handleSubmit = async () => {
        if (
            isNaN(parseInt(inventoryId)) ||
            !itemName ||
            !itemType ||
            isNaN(parseInt(currAmount)) ||
            isNaN(parseInt(needed4week)) || // Validate lowercase
            isNaN(parseInt(needed4gameweek)) // Validate lowercase
        ) {
            alert("Please fill in all required fields correctly.");
            return;
        }

        const payload = {
            inventory_id: parseInt(inventoryId),
            item_name: itemName,
            item_type: itemType,
            ingredients: ingredients || null,
            curr_amount: parseInt(currAmount),
            needed4week: parseInt(needed4week), // Pass lowercase
            needed4gameweek: parseInt(needed4gameweek), // Pass lowercase
        };

        try {
            const response = await fetch("/api/update-inventory-item", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorDetails = await response.json();
                throw new Error(errorDetails.error || "Failed to update inventory item.");
            }

            alert("Item updated successfully!");
            onClose();
        } catch (error) {
            console.error("Error:", error);
            alert("Error updating inventory item.");
        }
    };

    /**
     * Handles deleting an inventory item.
     * Validates the input ID and sends a DELETE request to `/api/deleteItem`.
     */
    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/deleteItem`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: deleteId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to delete item.");
            }

            alert("Item deleted successfully!");
            onClose();
        } catch (error) {
            alert(error.message);
        }
    };

    /**
     * Handles re-syncing IDs between the `menu` and `inventory` tables.
     * Sends a POST request to `/api/resyncIds`.
     */
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
            alert(error.message);
        }
    };

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box className={styles.modalBox}>
                <h2>Update Inventory Item</h2>
                <TextField
                    label="Inventory ID (unique IDs will add item, existing IDs will modify item)"
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
                    value={needed4week} // Updated to lowercase
                    onChange={(e) => setNeeded4week(e.target.value)} // Updated to lowercase
                />
                <TextField
                    label="Needed for Game Week"
                    type="number"
                    fullWidth
                    margin="normal"
                    value={needed4gameweek} // Updated to lowercase
                    onChange={(e) => setNeeded4gameweek(e.target.value)} // Updated to lowercase
                />
                <Button onClick={handleSubmit} className={styles.modalSubmitButton}>
                    Submit
                </Button>

                {/* Delete Item */}
                <Divider sx={{ my: 2 }} />
                <h3>Delete Item</h3>
                <Box className={styles.modalDeleteBox}>
                    <TextField
                        placeholder="Enter Inventory ID"
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

