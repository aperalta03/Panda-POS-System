import React, { useState, useEffect, useContext } from 'react';
import styles from './kitchen.module.css';
import { OrdersContext } from '../app/context/ordersContext';
import { Modal, Button } from '@mui/material';

const KitchenPage = () => {
  const { orders, updateOrderStatus } = useContext(OrdersContext);
  const [openModal, setOpenModal] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [hiddenOrders, setHiddenOrders] = useState([]);

  useEffect(() => {
    const storedHiddenOrders = JSON.parse(localStorage.getItem('hiddenOrders')) || [];
    setHiddenOrders(storedHiddenOrders);
  }, []);

  const handleStartOrder = (orderId) => {
    updateOrderStatus(orderId, 'making');
  };

  const handleCompleteOrder = (orderId) => {
    updateOrderStatus(orderId, 'completed');
    setTimeout(() => {
      setHiddenOrders((prevHiddenOrders) => {
        const updatedHiddenOrders = [...prevHiddenOrders, orderId];
        localStorage.setItem('hiddenOrders', JSON.stringify(updatedHiddenOrders));
        return updatedHiddenOrders;
      });
    }, 3000);
  };

  const openCancelModal = (orderId) => {
    setCancelOrderId(orderId);
    setOpenModal(true);
  };

  const handleCancelOrder = () => {
    updateOrderStatus(cancelOrderId, 'canceled');
    setHiddenOrders((prevHiddenOrders) => {
      const updatedHiddenOrders = [...prevHiddenOrders, cancelOrderId];
      localStorage.setItem('hiddenOrders', JSON.stringify(updatedHiddenOrders));
      return updatedHiddenOrders;
    });
    setOpenModal(false);
  };

  const closeModal = () => {
    setOpenModal(false);
  };

  return (
    <div className={styles.gridContainer}>
      {orders
        .filter((order) => order.status !== 'canceled')
        .filter((order) => !hiddenOrders.includes(order.id))
        .map((order) => (
          <div className={styles.orderBox} key={order.id}>
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
            <button
              className={`${styles.startOrderButton} ${
                order.status === 'making' && styles.activeStart
              }`}
              onClick={() => handleStartOrder(order.id)}
              disabled={order.status === 'completed'}
            >
              START ORDER
            </button>
            <button
              className={`${styles.completeButton} ${
                order.status === 'completed' && styles.activeComplete
              }`}
              onClick={() => handleCompleteOrder(order.id)}
              disabled={order.status === 'completed'}
            >
              COMPLETE
            </button>
            <button
              className={styles.cancelButton}
              onClick={() => openCancelModal(order.id)}
            >
              CANCEL
            </button>
          </div>
        ))}

      <Modal open={openModal} onClose={closeModal}>
        <div className={styles.modalContent}>
          <h2>Are you sure you want to cancel this order?</h2>
          <div className={styles.modalButtons}>
            <Button className={styles.modalButton} onClick={handleCancelOrder}>
                Yes
            </Button>
            <Button className={styles.modalButton} onClick={closeModal}>
                No
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default KitchenPage;