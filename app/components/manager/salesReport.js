import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Modal from '@mui/material/Modal';
import styles from './salesReport.module.css';

const SalesReportModal = ({ isOpen, onClose, startDate, setStartDate, endDate, setEndDate }) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className={styles.modalBox}>
        <h2>Sales Report</h2>
        <div className={styles.datePickerContainer}>
          <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
          <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
        </div>
        {/* Add Sales Report specific content here */}
        <button onClick={onClose} className={styles.closeButton}>Close</button>
      </div>
    </Modal>
  );
};

export default SalesReportModal;
