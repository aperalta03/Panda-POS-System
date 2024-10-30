import React from 'react';
import Modal from '@mui/material/Modal';
import styles from './zReport.module.css';

const ZReportModal = ({ isOpen, onClose }) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className={styles.modalBox}>
        <h2>Z Report</h2>
        {/* Add Z Report specific content here */}
        <button onClick={onClose} className={styles.closeButton}>Close</button>
      </div>
    </Modal>
  );
};

export default ZReportModal;
