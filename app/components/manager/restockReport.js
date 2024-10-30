import React from 'react';
import Modal from '@mui/material/Modal';
import styles from './restockReport.module.css';

const RestockReportModal = ({ isOpen, onClose }) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className={styles.modalBox}>
        <h2>Restock Report</h2>
        {/* Add Restock Report specific content here */}
        <button onClick={onClose} className={styles.closeButton}>Close</button>
      </div>
    </Modal>
  );
};

export default RestockReportModal;