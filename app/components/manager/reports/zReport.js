import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import styles from './zReport.module.css';

/**
 * @description
 * Displays a summary of daily sales, including items sold and total revenue.
 * Allows managers to generate the Z Report and reset sales data for the day.
 * 
 * @author Alonso Peralta Espinoza, Conner Black
 *
 * @param {object} props - The properties passed to the component.
 * @param {boolean} props.isOpen - A boolean indicating whether the modal is open.
 * @param {function} props.onClose - A function to close the modal.
 *
 * @returns {React.ReactElement} The rendered Z Report Modal component.
 *
 * @example
 * <ZReportModal isOpen={true} onClose={() => {}} />
 *
 * @module zReport
 */

const ZReportModal = ({ isOpen, onClose }) => {
  const [reportData, setReportData] = useState([]);
  const [totalSales, setTotalSales] = useState(0);

  const fetchSalesData = async () => {
    try {
      const response = await fetch('/api/z-report');
      if (!response.ok) throw new Error('Failed to fetch sales data');
      
      const salesData = await response.json();
      setReportData(salesData.report || []);
      setTotalSales(salesData.total || 0);
    } catch (error) {
      console.error("Error fetching sales data:", error);
      setReportData([]);
      setTotalSales(0);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSalesData();
    }
  }, [isOpen]);

  const generateZReport = async () => {
    try {
      const response = await fetch('/api/generate-z-report', { method: 'POST' });
      const data = await response.json();

      if (response.ok) {
        alert(data.message);
      } else {
        alert('Error generating Z Report');
      }
      onClose();
    } catch (error) {
      console.error('Error generating Z report:', error);
      alert('Error generating Z Report');
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className={styles.modalBox}>
        <h2 className={styles.reportTitle}>Z Report</h2>
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