import React, { useState } from 'react';
import EmployeeViewerModal from './reports/employeeViewerModal';
import SalesReportModal from './reports/salesReport';
import XReportModal from './reports/xReport';
import ZReportModal from './reports/zReport';
import ResetSalesDataModal from './reports/resetSales';
import RestockReportModal from './reports/restockReport';
import AddMenuModal from './reports/addMenuModal';
import UpdatePriceModal from './reports/updatePriceModal';
import styles from './dropDowns.module.css';

/**
 * DropDowns Component
 *
 * @author Alonso Peralta Espinoza
 * 
 * @description
 * A centralized menu for accessing various modals related to reports, data management, and employee operations.
 *
 * @features
 * - Displays buttons to open modals for:
 *   - Employee Viewer
 *   - Add/Delete Menu Items
 *   - Update Pricing
 *   - Reset Sales Data
 *   - Restock Report
 *   - Sales Report
 *   - X Report
 *   - Z Report
 * - Manages modal states dynamically based on the button clicked.
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
        <button className={styles.button} onClick={() => openModal('Add Menu Item')}>Add/Delete Item</button>
        <button className={styles.button} onClick={() => openModal('Update Pricing')}>Update Pricing</button>
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
            {modalTitle === 'Add Menu Item' && (
                <AddMenuModal isOpen={isModalOpen} onClose={closeModal} />
            )}
            {modalTitle === 'Update Pricing' && (
                <UpdatePriceModal isOpen={isModalOpen} onClose={closeModal} />
            )}
        </div>
    );
};

export default DropDowns;