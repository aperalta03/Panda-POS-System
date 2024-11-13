//! TODO:
// 1. Update Price to reflect per Order
// 2. Update Time to reflect per Sale

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
        const activeOrders = [];
        const completedOrdersList = [];
    
        data.orders.forEach(order => {
          order.items.forEach(item => {
            const orderCard = {
              saleNumber: order.saleNumber,
              orderNumber: item.orderNumber,
              plateSize: item.plateSize,
              components: item.components,
              status: item.status,
              totalPrice: Number(order.totalPrice), 
              saleTime: order.saleTime
            };
    
            if (item.status === 'Completed') {
              completedOrdersList.push(orderCard);
            } else {
              activeOrders.push(orderCard);
            }
          });
        });
    
        setOrders(activeOrders);
        setCompletedOrders(completedOrdersList);
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
          <div className={styles.orderBox} key={`${order.saleNumber}-${order.orderNumber}`}>
            <div className={styles.orderHeader}>
              SALE #{order.saleNumber} - ORDER #{order.orderNumber}
              <span className={styles.orderStatus}>
                {order.status === 'Cooking' ? 'COOKING...' : 'NOT STARTED'}
              </span>
            </div>
            <div className={styles.orderDetails}>
              <p>Plate Size: {order.plateSize}</p>
              <p>Items:</p>
              <ul>
                {order.components.map((component, index) => (
                  <li key={index}>{component}</li>
                ))}
              </ul>
              <p>Total Price: ${order.totalPrice.toFixed(2)}</p>
              <p>Time: {order.saleTime}</p>
            </div>
          </div>
        ))}
      </div>

      <Divider className={styles.divider} />

      <div className={styles.completedContainer}>
        {completedOrders.map((order) => (
          <div className={styles.completedBox} key={`${order.saleNumber}-${order.orderNumber}`}>
            <div className={styles.completedHeader}>
              SALE #{order.saleNumber} - ORDER #{order.orderNumber}
              <span className={styles.completedStatus}>COMPLETED</span>
            </div>
            <div className={styles.orderDetails}>
              <p>Plate Size: {order.plateSize}</p>
              <p>Items:</p>
              <ul>
                {order.components.map((component, index) => (
                  <li key={index}>{component}</li>
                ))}
              </ul>
              <p>Total Price: ${order.totalPrice.toFixed(2)}</p>
              <p>Time: {order.saleTime}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KitchenTV;