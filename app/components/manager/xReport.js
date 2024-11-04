import React from 'react';
import Modal from '@mui/material/Modal';
import styles from './xReport.module.css';

const XReportModal = ({ isOpen, onClose }) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className={styles.modalBox}>
        <h2>X Report</h2>
        {/* Add X Report specific content here */}
        <button onClick={onClose} className={styles.closeButton}>Close</button>
      </div>
    </Modal>
  );
};

export default XReportModal;
