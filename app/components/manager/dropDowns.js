import React, { useState } from 'react';
import EmployeeViewerModal from './reports/employeeViewerModal';
import SalesReportModal from './reports/salesReport';
import XReportModal from './reports/xReport';
import ZReportModal from './reports/zReport';
import ResetSalesDataModal from './reports/resetSales';
import RestockReportModal from './reports/restockReport';
import UpdateMenuItemModal from './reports/updateMenuItemModal';
import UpdateInventoryItemModal from './reports/updateInventoryItemModal';
import styles from './dropDowns.module.css';

/**
 * @author Alonso Peralta Espinoza
 * 
 * @description
 * A centralized menu for accessing various modals related to reports, data management, and employee operations.
 * 
 * @state
 * - `isModalOpen`: Controls whether a modal is open.
 * - `modalTitle`: Tracks the title of the currently open modal.
 * - `startDate`, `endDate`: Manages the date range for reports requiring date inputs.
 * 
 * @methods
 * - `openModal`: Sets the `modalTitle` and opens the corresponding modal.
 * - `closeModal`: Closes the currently open modal.
 * 
 * @example
 * <DropDowns />
 * 
 * @module dropDowns
 */

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
              <button className={styles.button} onClick={() => openModal('Update Menu Item')}>Update Menu Item</button>
        <button className={styles.button} onClick={() => openModal('Update Inventory Item')}>Update Inventory Item</button>
        <button className={styles.button} onClick={() => openModal('Reset Sales Data')}>Delete Sale(s)</button>
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
            {modalTitle === 'Update Menu Item' && (
                <UpdateMenuItemModal isOpen={isModalOpen} onClose={closeModal} />
            )}
            {modalTitle === 'Update Inventory Item' && (
                <UpdateInventoryItemModal isOpen={isModalOpen} onClose={closeModal} />
            )}
        </div>
    );
};

export default DropDowns;