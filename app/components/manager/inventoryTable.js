// src/components/InventoryTable.js
import React, { useState, useEffect } from 'react';
import style from './inventoryTable.module.css';

const InventoryTable = () => {
    const [inventoryData, setInventoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className={style.mainContainer}>
            <div className={style.scrollableTableContainer}>
                <table className={style.InventoryTable}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Item Name</th>
                            <th>Stocked</th>
                            <th>Required</th>
                            <th>To Order</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventoryData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.id}</td>
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