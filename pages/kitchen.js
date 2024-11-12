// kitchen.js
import React, { useState, useEffect, useContext } from 'react';
import styles from './kitchen.module.css';
import { Modal, Button } from '@mui/material';

const KitchenPage = () => {
  const [orders, setOrders] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/kitchen-get-orders');
        const data = await response.json();
        setOrders(data.orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch('/api/kitchen-update-order-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ saleNumber: orderId, status: newStatus }),
      });

      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.saleNumber === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        console.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleStartOrder = (orderId) => {
    updateOrderStatus(orderId, 'Cooking');
  };

  const handleCompleteOrder = (orderId) => {
    updateOrderStatus(orderId, 'Completed');
  };

  const openCancelModal = (orderId) => {
    setCancelOrderId(orderId);
    setOpenModal(true);
  };

  const handleCancelOrder = () => {
    updateOrderStatus(cancelOrderId, 'Canceled');
    setOpenModal(false);
  };

  const closeModal = () => {
    setOpenModal(false);
  };

  return (
    <div className={styles.gridContainer}>
      {orders
        .filter((order) => order.status !== 'Canceled')
        .map((order) => (
          <div className={styles.orderBox} key={order.saleNumber}>
            <div className={styles.orderHeader}>
              SALE #{order.saleNumber} - ORDER #1
              <span className={styles.orderStatus}>
                {order.status === 'Completed'
                  ? 'COMPLETED'
                  : order.status === 'Cooking'
                  ? 'COOKING...'
                  : 'NOT STARTED'}
              </span>
            </div>
            <button 
              className={`${styles.startOrderButton} ${
                order.status === 'Cooking' && styles.activeStart
              }`}
              onClick={() => handleStartOrder(order.saleNumber)} disabled={order.status !== 'Not Started'}
            >
              START ORDER
            </button>
            <button
              className={`${styles.completeButton} ${
                order.status === 'Completed' && styles.activeComplete
              }`}
              onClick={() => handleCompleteOrder(order.saleNumber)} disabled={order.status !== 'Cooking'}
            >
              COMPLETE
            </button>
            <button className={styles.cancelButton} onClick={() => openCancelModal(order.saleNumber)} disabled={order.status === 'Completed'}>
              CANCEL
            </button>
          </div>
        ))}

      <Modal open={openModal} onClose={closeModal}>
        <div className={styles.modalContent}>
          <h2>Are you sure you want to cancel this order?</h2>
          <div className={styles.modalButtons}>
            <Button onClick={handleCancelOrder}>Yes</Button>
            <Button onClick={closeModal}>No</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default KitchenPage;