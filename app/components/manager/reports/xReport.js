import React, { useState, useEffect, useCallback } from 'react';
import Modal from '@mui/material/Modal';
import styles from './xReport.module.css';

/**
 * X Report Modal Component
 * 
 * @author Alonso Peralta Espinoza
 *
 * @description
 * Displays an hourly breakdown of sales for the current day.
 * Provides a total sales summary at the bottom.
 *
 * @features
 * - Fetch hourly sales data from `/api/x-report`.
 * - Displays a scrollable table with hourly sales details.
 * - Shows total sales at the bottom of the report.
 *
 * @state
 * - `reportData`: Stores hourly sales data.
 * - `totalSales`: Stores the total sales for the day.
 *
 * @methods
 * - `fetchSalesData`: Fetches hourly sales data from the API.
 *
 * @example
 * <XReportModal isOpen={true} onClose={() => {}} />
 */

const XReportModal = ({ isOpen, onClose }) => {
  const [reportData, setReportData] = useState([]);
  const [totalSales, setTotalSales] = useState(0);

  const fetchSalesData = useCallback(async () => {
    try {
      const response = await fetch('/api/x-report');
      if (!response.ok) {
        throw new Error('Failed to fetch sales data');
      }
      
      const data = await response.json();
      const salesData = data.data; // Ensure correct structure

      const total = salesData.reduce((acc, sale) => acc + sale.sales, 0).toFixed(2);
      setReportData(salesData);
      setTotalSales(total);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchSalesData();
    }
  }, [isOpen, fetchSalesData]);

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className={styles.modalBox}>
        <h2 className={styles.modalTitle}>X Report</h2>
        
        <div className={styles.scrollableContent}>
          <table className={styles.reportTable}>
            <thead>
              <tr>
                <th>Hour</th>
                <th>Sales</th>
              </tr>
            </thead>
            <tbody>
              {reportData.length === 0 ? (
                <tr>
                  <td colSpan="2">No data available</td>
                </tr>
              ) : (
                reportData.map((data, index) => (
                  <tr key={index}>
                    <td>{data.hour}:00</td>
                    <td>${data.sales.toFixed(2)}</td>
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
          <button onClick={onClose} className={styles.closeButton}>Close</button>
        </div>
      </div>
    </Modal>
  );
};

export default XReportModal;