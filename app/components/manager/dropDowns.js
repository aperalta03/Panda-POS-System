import React, { useState } from 'react';
import RestockReportModal from './restockReport';
import SalesReportModal from './salesReport';
import XReportModal from './xReport';
import ZReportModal from './zReport';
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

  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.buttonGrid}>
        <button className={styles.button} onClick={() => openModal('Restock Report')}>Restock Report</button>
        <button className={styles.button} onClick={() => openModal('Sales Report')}>Sales Report</button>
        <button className={styles.button} onClick={() => openModal('X Report')}>X Report</button>
        <button className={styles.button} onClick={() => openModal('Z Report')}>Z Report</button>
      </div>

      {modalTitle === 'Restock Report' && (
        <RestockReportModal isOpen={isModalOpen} onClose={closeModal} />
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
    </div>
  );
};

export default DropDowns;