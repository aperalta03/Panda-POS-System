import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import styles from './zReport.module.css';

const ZReportModal = ({ isOpen, onClose }) => {
  const [reportData, setReportData] = useState([]);
  const [totalSales, setTotalSales] = useState(0);

  // Function to fetch and process the latest sales data
  const fetchSalesData = async () => {
    try {
      const response = await fetch('/api/salesRecord');
      const salesData = await response.json();

      // Aggregate sales data
      const aggregatedData = {};
      let totalPrice = 0;

      salesData.forEach(sale => {
        sale.items.forEach(itemCategory => {
          itemCategory.items.forEach(item => {
            const itemPrice = parseFloat(sale.totalPrice) / itemCategory.items.length;

            if (aggregatedData[item]) {
              aggregatedData[item].count += 1;
              aggregatedData[item].totalPrice += itemPrice;
            } else {
              aggregatedData[item] = {
                count: 1,
                totalPrice: itemPrice,
              };
            }
          });
        });
      });

      const report = Object.entries(aggregatedData).map(([itemName, { count, totalPrice }]) => ({
        itemName,
        count,
        totalPrice: totalPrice.toFixed(2),
      }));

      const total = report.reduce((acc, item) => acc + parseFloat(item.totalPrice), 0).toFixed(2);

      setReportData(report);
      setTotalSales(total);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
  };

  // Fetch sales data every time the modal is opened
  useEffect(() => {
    if (isOpen) {
      fetchSalesData();
    }
  }, [isOpen]);

  // Function to generate the Z report
  const generateZReport = async () => {
    try {
      const response = await fetch('/api/generate-z-report', { method: 'POST' });
      const data = await response.json();

      if (response.ok) {
        alert(data.message);
      } else {
        alert('Error generating Z Report');
      }
      onClose(); // Close the modal after generating the report
    } catch (error) {
      console.error('Error generating Z report:', error);
      alert('Error generating Z Report');
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className={styles.modalBox}>
        {/* Title of the report */}
        <h2 className={styles.reportTitle}>Z Report</h2>

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

        {/* Bottom section with total sales and buttons */}
        <div className={styles.bottomContainer}>
          <div className={styles.totalContainer}>
            <strong>Total Sales: ${totalSales}</strong>
          </div>
          <button onClick={generateZReport} className={styles.generateButton}>
            Generate Z Report
          </button>
          <button onClick={onClose} className={styles.closeButton}>
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ZReportModal;