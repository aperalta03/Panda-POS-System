import React, { useContext, useEffect, useState } from 'react';
import styles from './kitchenTV.module.css';
import { OrdersContext } from '../app/context/ordersContext';
import { Divider } from '@mui/material';

const KitchenTV = () => {
  const { orders } = useContext(OrdersContext);
  const [completedOrders, setCompletedOrders] = useState([]);

  useEffect(() => {
    const storedCompletedOrders = JSON.parse(localStorage.getItem('completedOrders')) || [];
    setCompletedOrders(storedCompletedOrders);
  }, []);

  useEffect(() => {
    const newCompletedOrders = orders
      .filter((order) => order.status === 'completed')
      .slice(-8);
    setCompletedOrders(newCompletedOrders);
    localStorage.setItem('completedOrders', JSON.stringify(newCompletedOrders));
  }, [orders]);

  const currentOrders = orders.filter((order) => order.status !== 'completed' && order.status !== 'canceled');

  return (
    <div className={styles.tvContainer}>
      <div className={styles.gridContainer}>
        {currentOrders.map((order) => (
          <div className={styles.orderBox} key={order.id}>
            <div className={styles.orderHeader}>
              SALE #{order.saleNumber} - ORDER #{order.orderNumber}
              <span className={styles.orderStatus}>
                {order.status === 'making' ? 'MAKING...' : 'NOT STARTED'}
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

      <Divider className={styles.divider} />

      <div className={styles.completedContainer}>
        {completedOrders.map((order) => (
          <div className={styles.completedBox} key={order.id}>
            <div className={styles.completedHeader}>
              SALE #{order.saleNumber} - ORDER #{order.orderNumber}
              <span className={styles.completedStatus}>COMPLETED</span>
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
    </div>
  );
};

export default KitchenTV;