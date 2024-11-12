import React, { useEffect, useState } from 'react';
import styles from './kitchenTV.module.css';
import { Divider } from '@mui/material';

const KitchenTV = () => {
  const [orders, setOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/kitchen-get-orders');
        const data = await response.json();
        setOrders(data.orders.filter(order => order.status !== 'Completed'));
        setCompletedOrders(data.orders.filter(order => order.status === 'Completed'));
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className={styles.tvContainer}>
      <div className={styles.gridContainer}>
        {orders.map((order) => (
          <div className={styles.orderBox} key={order.saleNumber}>
            <div className={styles.orderHeader}>
              SALE #{order.saleNumber} - ORDER #1
              <span className={styles.orderStatus}>
                {order.status === 'Cooking' ? 'COOKING...' : 'NOT STARTED'}
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
              <p>Time: {order.saleTime}</p>
            </div>
          </div>
        ))}
      </div>

      <Divider className={styles.divider} />

      <div className={styles.completedContainer}>
        {completedOrders.map((order) => (
          <div className={styles.completedBox} key={order.saleNumber}>
            <div className={styles.completedHeader}>
              SALE #{order.saleNumber} - ORDER #1
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
              <p>Time: {order.saleTime}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KitchenTV;
