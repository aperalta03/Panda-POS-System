import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Modal from '@mui/material/Modal';
import styles from './salesReport.module.css';
/**
 * @description
 * Displays a detailed sales report for a specified date range.
 * Allows managers to generate reports and view total sales and item-specific details.
 * 
 * @author Alonso Peralta Espinoza
 *
 * @param {object} props - The properties passed to the component.
 * @param {boolean} props.isOpen - Controls whether the modal is visible.
 * @param {function} props.onClose - Callback function to close the modal.
 * @param {Date} props.startDate - The selected start date for the report.
 * @param {Date} props.endDate - The selected end date for the report.
 * @param {function} props.setStartDate - Function to set the start date.
 * @param {function} props.setEndDate - Function to set the end date.
 *
 * @returns {React.ReactElement} The rendered SalesReportModal component.
 *
 * @example
 * <SalesReportModal
 *   isOpen={true}
 *   onClose={() => {}}
 *   startDate={new Date()}
 *   endDate={new Date()}
 *   setStartDate={(date) => {}}
 *   setEndDate={(date) => {}}
 * />
 *
 * @module salesReport
 */

const SalesReportModal = ({
  isOpen,
  onClose,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to round up to two decimal places
  const roundUpToTwoDecimalPlaces = (num) => {
    return (Math.ceil(num * 100) / 100).toFixed(2);
  };

  // Function to fetch report data from API
  const fetchReportData = async () => {
    setLoading(true);
    setError(null);

    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];

    try {
      const response = await fetch(
        `/api/sales-report?startDate=${formattedStartDate}&endDate=${formattedEndDate}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setReportData(data.data || []); // Set report data if available
    } catch (error) {
      console.error('Error fetching sales report:', error);
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className={styles.modalBox}>
        <h2>Sales Report</h2>

        {/* Date Pickers for selecting start and end dates */}
        <div className={styles.datePickerContainer}>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
          />
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
            <button onClick={fetchReportData} className={styles.fetchButton}>
                Generate Report
            </button>
            
            <button onClick={onClose} className={styles.closeButton}>
                Close
            </button>
        </div>
        
        {/* Display loading, error, or report data */}
        {loading && <p>Loading...</p>}
        {error && <p className={styles.errorText}>{error}</p>}

        {reportData.length > 0 && (
          <div className={styles.scrollableTableContainer}>
            <table className={styles.reportTable}>
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Total Sold</th>
                  <th>Total Revenue</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.item_name}</td>
                    <td>{item.total_sold}</td>
                    <td>{roundUpToTwoDecimalPlaces(item.total_revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default SalesReportModal;