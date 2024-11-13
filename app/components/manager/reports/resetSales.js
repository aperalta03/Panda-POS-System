import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import styles from './resetSales.module.css';

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
          Are you sure you want to reset 'salesRecord' and 'saleItems' tables Current day Data?
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