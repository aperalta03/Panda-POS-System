import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Modal from '@mui/material/Modal';
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
      
      <Modal open={isModalOpen} onClose={closeModal}>
        <div className={styles.modalBox}>
          <h2>{modalTitle}</h2>
          {modalTitle === 'Sales Report' && (
            <div className={styles.datePickerContainer}>
              <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
              <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
            </div>
          )}
          <button onClick={closeModal} variant="outlined" style={{ marginTop: '20px' }}>Close</button>
        </div>
      </Modal>
    </div>
  );
};

export default DropDowns;