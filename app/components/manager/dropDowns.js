import React, { useState } from 'react';
import EmployeeViewerModal from './reports/employeeViewerModal';
import SalesReportModal from './reports/salesReport';
import XReportModal from './reports/xReport';
import ZReportModal from './reports/zReport';
import ResetSalesDataModal from './reports/resetSales';
import RestockReportModal from './reports/restockReport';
import styles from './dropDowns.module.css';

const DropDowns = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const openModal = (title) => {
    setModalTitle(title);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalTitle('');
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.buttonGrid}>
        <button className={styles.button} onClick={() => openModal('Employee Viewer')}>Employee Viewer</button>
        <button className={styles.button} onClick={() => openModal('Reset Sales Data')}>Reset Today Sales</button>
        <button className={styles.button} onClick={() => openModal('Restock Report')}>Restock Report</button>
        <button className={styles.button} onClick={() => openModal('Sales Report')}>Sales Report</button>
        <button className={styles.button} onClick={() => openModal('X Report')}>X Report</button>
        <button className={styles.button} onClick={() => openModal('Z Report')}>Z Report</button>
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
      {modalTitle === 'Reset Sales Data' && (
        <ResetSalesDataModal isOpen={isModalOpen} onClose={closeModal} />
      )}
      {modalTitle === 'Restock Report' && (
        <RestockReportModal isOpen={isModalOpen} onClose={closeModal} />
      )}
    </div>
  );
};

export default DropDowns;