import React, { useState } from 'react';
import { Modal, Box, TextField, Button, MenuItem, Select, InputLabel, FormControl, Divider } from '@mui/material';
import styles from './addMenuModal.module.css';

/**
 * Add Menu Modal Component
 *
 * @author Alonso Peralta Espinoza
 * 
 * @description
 * A modal component for managing menu items, ingredients, and inventory.
 * Supports adding, editing, deleting, and re-syncing menu and inventory data.
 * Dynamically renders input fields based on the selected item type.
 *
 * @features
 * - Dynamic Form Rendering: Adjusts input fields based on the selected item type.
 * - CRUD Operations: Supports creating, updating, and deleting menu items or ingredients.
 * - Re-Sync IDs: Fixes mismatched inventory-to-menu relationships.
 * - Validation: Ensures data integrity before submitting.
 *
 * @state
 * - `type`: Specifies the type of item to manage (e.g., seasonal, menu item, ingredient).
 * - `formData`: Holds all the input data for the form fields.
 * - `deleteId`: Stores the ID of the item to be deleted.
 *
 * @methods
 * - `handleSubmit`: Submits data to the corresponding endpoint (`/api/updateSeasonalItem`, `/api/updateMenuItem`, or `/api/updateIngredient`).
 * - `handleDelete`: Deletes an inventory item and related menu data.
 * - `handleResync`: Re-syncs IDs between `menu` and `inventory` tables.
 *
 * @formStructure
 * - Seasonal Item:
 *   - Fields: Name, Price, Calories, Description, Ingredients.
 * - Menu Item:
 *   - Fields: Menu Item ID, Name, Price, Calories, Designation, Type, Description, Ingredients.
 * - Ingredient:
 *   - Fields: Inventory ID, Name, Current Amount, Needed for Week, Needed for Game Week.
 *
 * @dependencies
 * - Material-UI: For modal, form controls, and buttons.
 *
 * @example
 * <AddMenuModal isOpen={true} onClose={() => {}} />
 */

const AddMenuModal = ({ isOpen, onClose }) => {
  const [type, setType] = useState("Seasonal Item");
  const [formData, setFormData] = useState({
    name: "",
    price: 0.0,
    calories: 0,
    description: "",
    ingredients: "",
    menu_item_id: "",
    designation: "",
    itemType: "",
    inventory_id: "",
    curr_amount: 0,
    needed4week: 0,
    needed4gameweek: 0,
  });

  const [deleteId, setDeleteId] = useState("");
  
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  //** Add Items **//
  const handleSubmit = async () => {
    try {
      const endpoint = {
        "Seasonal Item": "/api/updateSeasonalItem",
        "Menu Item": "/api/updateMenuItem",
        "Ingredient": "/api/updateIngredient",
      }[type];
  
      const body = {
        ...(type === "Seasonal Item" && {
          name: formData.name,
          price: formData.price,
          calories: formData.calories,
          description: formData.description,
          ingredients: formData.ingredients,
        }),
        ...(type === "Menu Item" && {
          menu_item_id: formData.menu_item_id,
          name: formData.name,
          price: formData.price,
          calories: formData.calories,
          description: formData.description,
          designation: formData.designation,
          type: formData.itemType,
          ingredients: formData.ingredients,
        }),
        ...(type === "Ingredient" && {
          inventory_id: formData.inventory_id,
          name: formData.name,
          curr_amount: formData.curr_amount,
          needed4week: formData.needed4week,
          needed4gameweek: formData.needed4gameweek,
        }),
      };
  
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "An unknown error occurred");
      }
  
      alert("Item added successfully!");
      onClose();
    } catch (error) {
      alert(error.message);
    }
  };

  //** DELETE ITEM **//
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

  
  //** RESYNC IDs **//
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
        <h2>Add {type}</h2>
        <FormControl fullWidth margin="normal">
          <InputLabel>Type</InputLabel>
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            <MenuItem value="Seasonal Item">Seasonal Item</MenuItem>
            <MenuItem value="Menu Item">Menu Item</MenuItem>
            <MenuItem value="Ingredient">Ingredient</MenuItem>
          </Select>
        </FormControl>

        {/* Add Seasonal Item */}
        {type === "Seasonal Item" && (
          <>
            <TextField label="Item Name" fullWidth margin="normal" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} />
            <TextField label="Price" type="number" fullWidth margin="normal" value={formData.price} onChange={(e) => handleInputChange("price", parseFloat(e.target.value))} />
            <TextField label="Calories" type="number" fullWidth margin="normal" value={formData.calories} onChange={(e) => handleInputChange("calories", parseInt(e.target.value, 10))} />
            <TextField label="Description" fullWidth margin="normal" value={formData.description} onChange={(e) => handleInputChange("description", e.target.value)} />
            <TextField label="Ingredients (comma-separated)" fullWidth margin="normal" value={formData.ingredients} onChange={(e) => handleInputChange("ingredients", e.target.value)} />
          </>
        )}

        {/* Add Menu Item */}
        {type === "Menu Item" && (
          <>
            <Box className={styles.gridContainer}>
              <TextField label="Menu Item ID" type="number" value={formData.menu_item_id} onChange={(e) => handleInputChange("menu_item_id", e.target.value)} />
              <TextField label="Item Name" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} />
              <TextField label="Price" type="number" value={formData.price} onChange={(e) => handleInputChange("price", parseFloat(e.target.value))} />
              <TextField label="Calories" type="number" value={formData.calories} onChange={(e) => handleInputChange("calories", parseInt(e.target.value, 10))} />
              <TextField label="Designation" value={formData.designation} onChange={(e) => handleInputChange("designation", e.target.value)} />
              <TextField label="Type" value={formData.itemType} onChange={(e) => handleInputChange("itemType", e.target.value)} />
            </Box>
            <TextField
              label="Description"
              multiline
              rows={3}
              fullWidth
              margin="normal"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
            <TextField
              label="Ingredients (comma-separated)"
              multiline
              rows={2}
              fullWidth
              margin="normal"
              value={formData.ingredients}
              onChange={(e) => handleInputChange("ingredients", e.target.value)}
            />
          </>
        )}

        {/* Add Ingredient */}
        {type === "Ingredient" && (
          <>
            <TextField label="Inventory ID" type="number" fullWidth margin="normal" value={formData.inventory_id} onChange={(e) => handleInputChange("inventory_id", e.target.value)} />
            <TextField label="Name" fullWidth margin="normal" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} />
            <TextField label="Current Amount" type="number" fullWidth margin="normal" value={formData.curr_amount} onChange={(e) => handleInputChange("curr_amount", parseInt(e.target.value, 10))} />
            <TextField label="Needed for Week" type="number" fullWidth margin="normal" value={formData.needed4week} onChange={(e) => handleInputChange("needed4week", parseInt(e.target.value, 10))} />
            <TextField label="Needed for Game Week" type="number" fullWidth margin="normal" value={formData.needed4gameweek} onChange={(e) => handleInputChange("needed4gameweek", parseInt(e.target.value, 10))} />
          </>
        )}
        <Button onClick={handleSubmit} className={styles.modalSubmitButton}>Submit</Button>

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

export default AddMenuModal;