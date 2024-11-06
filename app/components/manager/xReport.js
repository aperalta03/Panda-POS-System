import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import styles from './xReport.module.css';

const XReportModal = ({ isOpen, onClose }) => {
  const [reportData, setReportData] = useState([]);
  const [totalSales, setTotalSales] = useState(0);

  const halfItems = ["Super Greens", "Chow Mein", "White Steamed Rice", "Fried Rice"];

  const fetchSalesData = async () => {
    try {
      const response = await fetch('/api/salesRecord');
      if (!response.ok) {
        throw new Error('Failed to fetch sales data');
      }
      const salesData = await response.json();

      const aggregatedData = {};
      let totalPrice = 0;

      salesData.forEach(sale => {
        sale.items.forEach(itemCategory => {
          itemCategory.items.forEach(item => {
            const itemPrice = parseFloat(sale.totalPrice) / itemCategory.items.length;
            const isHalfItem = halfItems.includes(item);
            const itemCount = isHalfItem ? 0.5 : 1;

            if (aggregatedData[item]) {
              aggregatedData[item].count += itemCount;
              aggregatedData[item].totalPrice += itemPrice;
            } else {
              aggregatedData[item] = {
                count: itemCount,
                totalPrice: itemPrice,
              };
            }
          });
        });
      });

      const report = Object.entries(aggregatedData).map(([itemName, { count, totalPrice }]) => ({
        itemName,
        count: count.toFixed(1),
        totalPrice: totalPrice.toFixed(2),
      }));

      const total = report.reduce((acc, item) => acc + parseFloat(item.totalPrice), 0).toFixed(2);
      setReportData(report);
      setTotalSales(total);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSalesData();
    }
  }, [isOpen]);

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className={styles.modalBox}>
        {/* Use className for h2 instead of global selector */}
        <h2 className={styles.modalTitle}>X Report</h2>

        {/* Scrollable content area for the table */}
        <div className={styles.scrollableContent}>
          <table className={styles.reportTable}>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity Sold</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {reportData.length === 0 ? (
                <tr>
                  <td colSpan="3">No data available</td>
                </tr>
              ) : (
                reportData.map((data, index) => (
                  <tr key={index}>
                    <td>{data.itemName}</td>
                    <td>{data.count}</td>
                    <td>${data.totalPrice}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Total sales and close button are fixed at the bottom */}
        <div className={styles.bottomContainer}>
          <div className={styles.totalContainer}>
            <strong>Total Sales: ${totalSales}</strong>
          </div>
          <button onClick={onClose} className={styles.closeButton}>Close</button>
        </div>
      </div>
    </Modal>
  );
};

export default XReportModal;