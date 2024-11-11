import React, { useState } from 'react';
import EmployeeViewerModal from './employeeViewerModal';
import SalesReportModal from './salesReport';
import XReportModal from './xReport';
import ZReportModal from './zReport';
import { Modal, Box, Typography, Button } from '@mui/material';
import styles from './dropDowns.module.css';

const DropDowns = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const openModal = (title) => {
    setModalTitle(title);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const openResetModal = () => setIsResetModalOpen(true);
  const closeResetModal = () => setIsResetModalOpen(false);

  const handleResetSalesData = async () => {
    try {
      const response = await fetch('/api/reset-salesRecord', { method: 'POST' });
      if (response.ok) {
        console.log('Sales data reset successfully');
      } else {
        console.error('Failed to reset sales data');
      }
    } catch (error) {
      console.error('Error resetting sales data:', error);
    }
    closeResetModal();
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.buttonGrid}>
        <button className={styles.button} onClick={() => openModal('Employee Viewer')}>Employee Viewer</button>
        <button className={styles.button} onClick={() => openModal('Sales Report')}>Sales Report</button>
        <button className={styles.button} onClick={() => openModal('X Report')}>X Report</button>
        <button className={styles.button} onClick={() => openModal('Z Report')}>Z Report</button>
        <button className={styles.button} onClick={openResetModal}>Reset Sales Data</button>
      </div>

      {modalTitle === 'Employee Viewer' && (
        <EmployeeViewerModal isOpen={isModalOpen} onClose={closeModal} />
      )}
      {modalTitle === 'Sales Report' && (
        <SalesReportModal
          isOpen={isModalOpen}
          onClose={closeModal}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
      )}
      {modalTitle === 'X Report' && (
        <XReportModal isOpen={isModalOpen} onClose={closeModal} />
      )}
      {modalTitle === 'Z Report' && (
        <ZReportModal isOpen={isModalOpen} onClose={closeModal} />
      )}

      {/* Reset Confirmation Modal */}
      <Modal open={isResetModalOpen} onClose={closeResetModal}>
        <Box className={styles.modalBox}>
          <Typography variant="h6">Are you sure you want to reset &apos;salesRecord&apos; and &apos;saleItems&apos; tables Current day Data?</Typography>
          <Button onClick={handleResetSalesData} color="error" variant="contained" sx={{ mt: 2 }}>
            Yes, Reset Data
          </Button>
          <Button onClick={closeResetModal} sx={{ mt: 1 }}>Cancel</Button>
        </Box>
      </Modal>
    </div>
  );
};

export default DropDowns;