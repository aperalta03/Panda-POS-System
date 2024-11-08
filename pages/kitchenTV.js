import React, { useState, useEffect } from 'react';
import styles from './kitchenTV.module.css';
import salesData from '/app/context/salesRecord.json';

const KitchenTV = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        let orderCount = 1;
        const initialOrders = salesData
            //! Change which sales/orders display here --> Cashier or Kiosk
            .filter((sale) => sale.source === 'Kiosk')
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

    return (
        <div className={styles.gridContainer}>
            {orders.map((order) => (
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
                    <div className={styles.orderDetails}>
                        <p>Plate Size: {order.plateSize}</p>
                        <p>Items:</p>
                        <ul>
                            {order.items.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>

                        <p>Total Price: ${order.totalPrice}</p>
                        <p>Time: {order.time}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default KitchenTV;