import React, { useEffect, useState } from 'react';
import styles from './kitchenTV.module.css';
import { Divider } from '@mui/material';

const KitchenTV = () => {
    const [sales, setSales] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('/api/kitchen-get-orders');
                const data = await response.json();
                const salesArray = [];

                data.orders.forEach(order => {
                    const { saleNumber, saleTime, totalPrice, items } = order;

                    // Calculate price per order
                    const pricePerOrder = Number(totalPrice) / items.length;

                    // Build sale object
                    const sale = {
                        saleNumber,
                        saleTime,
                        items: items.map(item => ({
                            saleNumber,
                            orderNumber: item.orderNumber,
                            plateSize: item.plateSize,
                            components: item.components,
                            status: item.status,
                            totalPrice: pricePerOrder,
                        })),
                    };

                    salesArray.push(sale);
                });

                setSales(salesArray);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className={styles.tvContainer}>
            <div className={styles.gridContainer}>
                {sales.map(sale => (
                    <div className={styles.saleContainer} key={sale.saleNumber}>
                        <div className={styles.saleHeader}>
                            SALE #{sale.saleNumber}
                            <p>Sale Time: {new Date(sale.saleTime).toLocaleString()}</p>
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
                                        {/* <p>
                                            Total Price (Per Order): $
                                            {item.totalPrice.toFixed(2)}
                                        </p> */}
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