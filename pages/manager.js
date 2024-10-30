import React from 'react';
import InventoryTable from '../app/components/InventoryTable';
import SalesReport from '../app/components/SalesReport';
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
            <InventoryTable />
            <SalesReport />
            <SalesChart dataset={mockDataset} />
        </div>
    )
}

export default Manager;