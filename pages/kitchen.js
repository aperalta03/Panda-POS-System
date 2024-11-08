import React, { useState, useEffect } from 'react';
import styles from './kitchen.module.css';
import salesData from '/app/context/salesRecord.json';

//! TODO: Add View Page (Second Design in Google Docs), Only Updating Page is there. 

const KitchenPage = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        let orderCount = 1;
        const initialOrders = salesData
            .filter((sale) => sale.source === 'Cashier')
            .flatMap((sale) =>
                sale.items.map((item) => ({
                    saleNumber: sale.saleNumber,
                    orderNumber: orderCount++,
                    date: sale.date,
                    time: sale.time,
                    totalPrice: sale.totalPrice,
                    employeeID: sale.employeeID,
                    plateSize: item.plateSize,
                    items: item.items,
                    status: 'not started'
                }))
            );
        setOrders(initialOrders);
    }, []);

    const handleStartOrder = (index) => {
        setOrders((prevOrders) =>
            prevOrders.map((order, i) =>
                i === index ? { ...order, status: 'making' } : order
            )
        );
    };

    const handleDeleteOrder = (index) => {
        setOrders((prevOrders) => prevOrders.filter((_, i) => i !== index));
    };

    const handleCompleteOrder = (index) => {
        setOrders((prevOrders) =>
            prevOrders.map((order, i) =>
                i === index ? { ...order, status: 'completed' } : order
            )
        );
    };

    return (
        <div className={styles.gridContainer}>
            {orders.map((order, index) => (
                <div className={styles.orderBox} key={`${order.saleNumber}-${order.orderNumber}`}>
                    <div className={styles.orderHeader}>
                        SALE #{order.saleNumber} - ORDER #{order.orderNumber}
                        <span className={styles.orderStatus}>
                            {order.status === 'completed'
                                ? 'COMPLETED'
                                : order.status === 'making'
                                ? 'MAKING...'
                                : 'NOT STARTED'}
                        </span>
                    </div>

                    {/* Order Details - For Other Page */}
                    {/* <div className={styles.orderDetails}>
                        <p>Plate Size: {order.plateSize}</p>
                        <p>Items: {order.items.join(', ')}</p>
                        <p>Total Price: ${order.totalPrice}</p>
                        <p>Time: {order.time}</p>
                    </div> */}

                    <button
                        className={`${styles.startOrderButton} ${
                            order.status === 'making' && styles.activeStart
                        }`}
                        onClick={() => handleStartOrder(index)}
                        disabled={order.status === 'completed'}
                    >
                        START ORDER
                    </button>
                    <button
                        className={`${styles.completeButton} ${
                            order.status === 'completed' && styles.activeComplete
                        }`}
                        onClick={() => handleCompleteOrder(index)}
                        disabled={order.status === 'completed'}
                    >
                        COMPLETE
                    </button>
                    <button
                        className={styles.deleteButton}
                        onClick={() => handleDeleteOrder(index)}
                    >
                        DELETE
                    </button>
                </div>
            ))}
        </div>
    );
};

export default KitchenPage;