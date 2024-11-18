import React, { useEffect, useState } from 'react';
import styles from './kitchenTV.module.css';
import { Divider } from '@mui/material';

const KitchenTV = () => {
    const [sales, setSales] = useState([]);

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const response = await fetch('/api/kitchen-get-orders');
                const data = await response.json();
                console.log("API Response:", data);

                const salesArray = data.orders.map(order => {
                    const {
                        saleNumber,
                        saleDate,
                        saleTime,
                        totalPrice,
                        items,
                    } = order;

                    // Combine saleDate and saleTime into a Date object
                    const saleDateTime = new Date(`${saleDate}T${saleTime}`);

                    // Build sale object
                    return {
                        saleNumber,
                        saleDateTime,
                        totalPrice,
                        items,
                    };
                });

                setSales(salesArray);
            } catch (error) {
                console.error('Error fetching sales:', error);
            }
        };

        fetchSales();
    }, []);

    const formatTime = (dateTime) => {
        console.log("This is date" + dateTime);
        if (!dateTime) return "Time Not Available";

        try {
            return dateTime.toLocaleString();
        } catch (error) {
            console.error("Error formatting time:", error);
            return "Invalid Time";
        }
    };

    return (
        <div className={styles.tvContainer}>
            <div className={styles.gridContainer}>
                {sales.map(sale => (
                    <div className={styles.saleContainer} key={sale.saleNumber}>
                        <div className={styles.saleHeader}>
                            SALE #{sale.saleNumber}
                            <p>Sale Time: {formatTime(sale.saleDateTime)}</p>
                        </div>

                        {sale.items
                            .filter(item => item.status !== 'Canceled')
                            .map(item => (
                                <div
                                    className={
                                        item.status === 'Completed'
                                            ? styles.completedBox
                                            : styles.orderBox
                                    }
                                    key={`${sale.saleNumber}-${item.orderNumber}`}
                                >
                                    <div className={styles.orderHeader}>
                                        ORDER #{item.orderNumber}
                                        <span
                                            className={`${styles.orderStatus} ${item.status === 'Completed'
                                                    ? styles.statusCompleted
                                                    : item.status === 'Cooking'
                                                        ? styles.statusCooking
                                                        : styles.statusNotStarted
                                                }`}
                                        >
                                            {item.status === 'Completed'
                                                ? 'COMPLETED'
                                                : item.status === 'Cooking'
                                                    ? 'COOKING...'
                                                    : 'NOT STARTED'}
                                        </span>
                                    </div>
                                    <div className={styles.orderDetails}>
                                        <p>Plate Size: {item.plateSize}</p>
                                        <p>Items:</p>
                                        <ul>
                                            {item.components.map((component, index) => (
                                                <li key={index}>{component}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        <Divider className={styles.divider} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KitchenTV;