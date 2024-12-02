import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import styles from './resetSales.module.css';

/**
 * Reset Sales Data Modal Component
 * 
 * @author Alonso Peralta Espinoza
 *
 * @description
 * A modal that allows managers to reset daily sales data.
 * This clears the `salesRecord` and `saleItems` tables.
 *
 * @features
 * - Confirmation dialog to prevent accidental resets.
 * - API call to `/api/reset-salesRecord` for data reset.
 * - Displays success or error messages based on API response.
 *
 * @methods
 * - `handleResetSalesData`: Triggers the API call to reset sales data and provides feedback.
 *
 * @example
 * <ResetSalesDataModal isOpen={true} onClose={() => {}} />
 */

const ResetSalesDataModal = ({ isOpen, onClose }) => {
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
        <Typography variant="h6">
          Are you sure you want to reset &apos;salesRecord&apos; and &apos;saleItems&apos; tables for the current day data?
        </Typography>
        <Button onClick={handleResetSalesData} color="error" variant="contained" sx={{ mt: 2 }}>
          Yes, Reset Data
        </Button>
        <Button onClick={onClose} sx={{ mt: 1 }}>Cancel</Button>
      </Box>
    </Modal>
  );
};

export default ResetSalesDataModal;