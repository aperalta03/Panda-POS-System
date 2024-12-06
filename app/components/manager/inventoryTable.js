import React, { useState, useEffect } from 'react';
import style from './inventoryTable.module.css';

/**
 * @author Alonso
 * 
 * @description
 * Displays a sortable table of inventory items, including stock levels, reorder quantities, and associated menu item IDs (MID).
 * 
 * @state
 * - `inventoryData`: Stores the fetched inventory data.
 * - `loading`: Indicates whether data is being loaded.
 * - `error`: Tracks errors during data fetch.
 * - `sortConfig`: Tracks sorting configuration (column and direction).
 * 
 * @methods
 * - `fetchData`: Fetches inventory data from the API.
 * - `requestSort`: Updates `sortConfig` to sort by the specified column.
 * 
 * @example
 * <InventoryTable />
 * 
 * @module inventoryTable
 */
const InventoryTable = () => {
    const [inventoryData, setInventoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/inventory-table');
                if (!response.ok) {
                    throw new Error('Failed to fetch inventory data');
                }
                const data = await response.json();

                const adjustedData = data.data.map(item => ({
                    ...item,
                    to_order: item.to_order < 0 ? 0 : item.to_order,
                }));

                setInventoryData(adjustedData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching inventory data:', error);
                setError('Failed to load inventory data');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const sortedData = React.useMemo(() => {
        if (!sortConfig.key) return inventoryData;

        const sorted = [...inventoryData].sort((a, b) => {
            const aValue = a[sortConfig.key] === null ? Infinity : a[sortConfig.key];
            const bValue = b[sortConfig.key] === null ? Infinity : b[sortConfig.key];

            if (aValue < bValue) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });

        return sorted;
    }, [inventoryData, sortConfig]);

    /**
     * Updates the sorting configuration based on the specified column key.
     * Toggles the sorting direction between ascending and descending if the same column is clicked consecutively.
     *
     * @param {string} key - The column key to sort by.
     */
    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className={style.mainContainer}>
            <div className={style.scrollableTableContainer}>
                <table className={style.InventoryTable}>
                    <thead>
                        <tr>
                            <th onClick={() => requestSort('id')} className={style.clickableHeader}>ID</th>
                            <th onClick={() => requestSort('mid')} className={style.clickableHeader}>MID</th>
                            <th onClick={() => requestSort('name')} className={style.clickableHeader}>Item Name</th>
                            <th onClick={() => requestSort('stocked')} className={style.clickableHeader}>Stocked</th>
                            <th onClick={() => requestSort('required')} className={style.clickableHeader}>Required</th>
                            <th onClick={() => requestSort('to_order')} className={style.clickableHeader}>To Order</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.id}</td>
                                <td>{item.mid || ''}</td>
                                <td>{item.name}</td>
                                <td>{item.stocked}</td>
                                <td>{item.required}</td>
                                <td>{item.to_order}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InventoryTable;