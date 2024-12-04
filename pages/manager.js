import React from 'react';
import InventoryTable from '../app/components/manager/inventoryTable';
import ManagerProfile from '../app/components/manager/managerProfile';
import DropDowns from '../app/components/manager/dropDowns';
import SalesChart from '../app/components/manager/salesChart';
import styles from './manager.module.css';


import Head from "next/head"; // Import Head for managing the document head

/**
 * Manager Component
 * 
 * @author Alonso Peralta Espinoza, Conner Black, Anson Thai
 *
 * @description
 * Dashboard for manager functionalities, including inventory, profiles, reports, and sales charts.
 *
 * @features
 * - Displays an inventory table and manager profile.
 * - Includes dropdown options for various reports and functionalities.
 * - Displays a customizable sales chart.
 *
 * @api
 * - `/api/inventory-table` (GET): Fetches inventory data for the table.
 * - `/api/sales-chart` (GET): Retrieves sales data for the chart, based on filters.
 *
 * @returns {React.ReactElement} A React functional component.
 */

const Manager = () => {
    const mockDataset = [
        { label: 'January', value: 30 },
        { label: 'February', value: 25 },
        { label: 'March', value: 50 },
        { label: 'April', value: 40 },
        { label: 'May', value: 35 },
        { label: 'June', value: 60 },
        { label: 'July', value: 45 },
        { label: 'August', value: 55 },
        { label: 'September', value: 65 },
        { label: 'October', value: 70 },
        { label: 'November', value: 50 },
        { label: 'December', value: 60 }
    ];
    return (
        <>
        <Head>
          {/* Add or update the page title */}
          <title>Manger View Page</title>
          {/* Add other metadata if needed */}
          <meta name="description" content="View and Modify as a Manager" />
        </Head>
        <div className={styles.mainContainer}>
            <div className={styles.left}>
                <div className={styles.inventoryTablePosition}>
                    <InventoryTable />
                </div>
                <div className={styles.managerProfilePosition}>
                    <ManagerProfile />
                </div>
            </div>

            <div className={styles.right}>
                <div className={styles.dropDownPosition}>
                    <DropDowns />
                </div>
                {/* SalesChart positioned in the bottom right */}
                <div className={styles.salesChartPosition}>
                    <SalesChart dataset={mockDataset} />
                </div>
            </div>
        </div>
        </>
    )
}

export default Manager;
