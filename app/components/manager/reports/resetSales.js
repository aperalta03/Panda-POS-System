import React, { useState } from 'react';
import { Modal, Box, Typography, Button, TextField, Divider } from '@mui/material';
import styles from './resetSales.module.css';

/**
 * Reset Sales Data Modal Component
 * 
 * @author Alonso Peralta Espinoza
 *
 * @description
 * A modal that allows managers to:
 * 1. Delete a specific sale entry by Sales ID.
 * 2. Reset daily sales data for `salesRecord` and `saleItems` tables.
 *
 * @features
 * - Allows input of a Sales ID to delete a specific sale entry.
 * - Confirmation dialog to reset daily sales data.
 * - API call to `/api/delete-sale-by-id` for deleting a sale by ID.
 * - API call to `/api/reset-salesRecord` for resetting daily sales data.
 * - Displays success or error messages based on API response.
 *
 * @methods
 * - `handleDeleteSaleById`: Sends an API request to delete a specific sale by ID.
 * - `handleResetSalesData`: Triggers the API call to reset all sales data.
 *
 * @example
 * <ResetSalesDataModal isOpen={true} onClose={() => {}} />
 */

const ResetSalesDataModal = ({ isOpen, onClose }) => {
  const [salesId, setSalesId] = useState('');

  // Delete a specific sale entry by Sales ID
  const handleDeleteSaleById = async () => {
    if (!salesId.trim()) {
      alert('Please enter a valid Sales ID');
      return;
    }
    try {
      const response = await fetch('/api/deleteSale', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ saleNumber: salesId.trim() }),
      });
      if (response.ok) {
        alert('Sale entry deleted successfully');
      } else {
        alert('Failed to delete sale entry');
      }
    } catch (error) {
      console.error('Error deleting sale entry:', error);
      alert('Error deleting sale entry');
    }
    setSalesId(''); // Clear the input field
  };

  // Reset all sales data
  const handleResetSalesData = async () => {
    try {
      const response = await fetch('/api/reset-salesRecord', { method: 'POST' });
      if (response.ok) {
        alert('Sales data reset successfully');
      } else {
        alert('Failed to reset sales data');
      }
    } catch (error) {
      console.error('Error resetting sales data:', error);
      alert('Error resetting sales data');
    }
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box className={styles.modalBox}>
        {/* Section 1: Delete Sale by ID */}
        <Typography variant="h6" gutterBottom>
          Delete a Specific Sale by ID
        </Typography>
        <TextField
          label="Sales ID"
          variant="outlined"
          fullWidth
          value={salesId}
          onChange={(e) => setSalesId(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          onClick={handleDeleteSaleById}
          color="error"
          variant="contained"
          fullWidth
        >
          Delete Sale
        </Button>

        <Divider sx={{ my: 3 }} />

        {/* Section 2: Reset All Sales Data */}
        <Typography variant="h6" gutterBottom>
          Reset Daily Sales Data
        </Typography>
        <Typography variant="body2" gutterBottom>
          This will clear the `salesRecord` and `saleItems` tables for the current day.
        </Typography>
        <Button
          onClick={handleResetSalesData}
          color="error"
          variant="contained"
          sx={{ mt: 2 }}
          fullWidth
        >
          Yes, Reset Data
        </Button>
        <Button onClick={onClose} sx={{ mt: 1 }} fullWidth>
          Cancel
        </Button>
      </Box>
    </Modal>
  );
};

export default ResetSalesDataModal;