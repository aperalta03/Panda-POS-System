import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import styles from './restockReport.module.css';

const RestockReportModal = ({ isOpen, onClose }) => {
  const [reportData, setReportData] = useState([]);

  const fetchRestockData = async () => {
    try {
      const response = await fetch('/api/restock-Report-inventory');
      if (!response.ok) throw new Error('Failed to fetch restock data');
      
      const data = await response.json();

      const sanitizedData = data.map(item => ({
        ...item,
        neededForWeek: Math.max(0, item.neededForWeek),
        neededForGameWeek: Math.max(0, item.neededForGameWeek),
        currentStock: Math.max(0, item.currentStock) // Ensure currentStock has no negative values
      }));

      // Sort so low stock items appear at the top, maintaining alphabetical order within each group
      const sortedData = sanitizedData.sort((a, b) => {
        if (a.currentStock < 100 && b.currentStock >= 100) return -1;
        if (a.currentStock >= 100 && b.currentStock < 100) return 1;
        return a.itemName.localeCompare(b.itemName);
      });

      setReportData(sortedData || []);
    } catch (error) {
      console.error("Error fetching restock data:", error);
      setReportData([]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchRestockData();
    }
  }, [isOpen]);

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box className={styles.modalBox}>
        <h2 className={styles.modalTitle}>Restock Report</h2>
        <div className={styles.scrollableContent}>
          <table className={styles.reportTable}>
            <thead>
              <tr>
                <th>Item</th>
                <th>Current Stock</th>
                <th>Needed for Week</th>
                <th>Needed for Game Week</th>
              </tr>
            </thead>
            <tbody>
              {reportData.length === 0 ? (
                <tr>
                  <td colSpan="4">No data available</td>
                </tr>
              ) : (
                reportData.map((item, index) => (
                  <tr
                    key={index}
                    className={
                      item.currentStock < 100 ? styles.lowStock : ''
                    }
                  >
                    <td>{item.itemName}</td>
                    <td>{item.currentStock}</td>
                    <td>{item.neededForWeek}</td>
                    <td>{item.neededForGameWeek}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Button onClick={onClose} className={styles.closeButton}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default RestockReportModal;
