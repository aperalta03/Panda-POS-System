import React from 'react';
import Navbar from '../app/components/navbar';
import InventoryTable from '../app/components/InventoryTable';
import SalesReport from '../app/components/SalesChart';
import SalesChart from '../app/components/SalesChart';

const Manager = () => {
    const mockDataset = [
        { label: 'January', value: 30 },
        { label: 'February', value: 20 },
        { label: 'March', value: 50 },
        // Add more as needed
    ];
    return (
        <div>
            <Navbar title="Manager GUI" />
            <InventoryTable />
            <SalesReport />
            <SalesChart dataset={mockDataset} />
        </div>
    )
}

export default Manager;