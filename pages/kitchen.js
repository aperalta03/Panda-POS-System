import React, { useState, useEffect } from 'react';
import styles from './kitchen.module.css';
import { Modal, Button } from '@mui/material';

const KitchenPage = () => {
    const [orders, setOrders] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [cancelOrderDetails, setCancelOrderDetails] = useState({ saleNumber: null, orderNumber: null });

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

    const updateOrderStatus = async (saleNumber, orderNumber, newStatus) => {
        try {
            const response = await fetch('/api/kitchen-update-order-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ saleNumber, orderNumber, status: newStatus }),
            });

            if (response.ok) {
                setOrders((prevOrders) =>
                    prevOrders.map(order =>
                        order.saleNumber === saleNumber
                            ? {
                                ...order,
                                items: order.items.map(item =>
                                    item.orderNumber === orderNumber
                                        ? { ...item, status: newStatus }
                                        : item
                                ),
                            }
                            : order
                    )
                );
            } else {
                console.error('Failed to update order status');
            }
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    
    const removeSale = async (saleNumber) => {
        try {
            const response = await fetch('/api/kitchen-remove-sale', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ saleNumber }),
            });

            if (response.ok) {
                setOrders((prevOrders) =>
                    prevOrders.filter(order => order.saleNumber !== saleNumber)
                );
            } else {
                console.error('Failed to remove sale');
            }
        } catch (error) {
            console.error('Error removing sale:', error);
        }
    };

    const handleRemoveSale = (saleNumber) => {
        removeSale(saleNumber);
    };
    
    const handleStartOrder = (saleNumber, orderNumber) => {
        updateOrderStatus(saleNumber, orderNumber, 'Cooking');
    };

    const handleCompleteOrder = (saleNumber, orderNumber) => {
        updateOrderStatus(saleNumber, orderNumber, 'Completed');
    };

    const openCancelModal = (saleNumber, orderNumber) => {
        setCancelOrderDetails({ saleNumber, orderNumber });
        setOpenModal(true);
    };

    const handleCancelOrder = async () => {
        try {
            const response = await fetch('/api/kitchen-cancel-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cancelOrderDetails),
            });

            if (response.ok) {
                setOrders((prevOrders) =>
                    prevOrders
                        .map(order =>
                            order.saleNumber === cancelOrderDetails.saleNumber
                                ? {
                                    ...order,
                                    items: order.items.filter(item => item.orderNumber !== cancelOrderDetails.orderNumber),
                                }
                                : order
                        )
                        .filter(order => order.items.length > 0)
                );
            } else {
                console.error('Failed to cancel order');
            }
        } catch (error) {
            console.error('Error cancelling order:', error);
        } finally {
            setOpenModal(false);
        }
    };

    const closeModal = () => {
        setOpenModal(false);
    };

    return (
        <div className={styles.gridContainer}>
            {orders.map(order => (
                <div className={styles.saleContainer} key={order.saleNumber}>
                    <div className={styles.saleHeader}>SALE #{order.saleNumber}</div>
                    {order.items.every(item => item.status === 'Completed') && (
                        <button
                            className={`${styles.removeSaleButton}`}
                            onClick={() => handleRemoveSale(order.saleNumber)} // Add your handler for removing the sale
                        >
                            REMOVE SALE
                        </button>
                    )}
                    <div className={styles.orderColumn}>
                        {order.items
                            .filter(item => item.status !== 'Canceled')
                            .map(item => (
                                <div className={styles.orderBox} key={`${order.saleNumber}-${item.orderNumber}`}>
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
                                    <button
                                        className={`${styles.startOrderButton} ${item.status === 'Cooking' && styles.activeStart
                                            }`}
                                        onClick={() => handleStartOrder(order.saleNumber, item.orderNumber)}
                                        disabled={item.status !== 'Not Started'}
                                    >
                                        START ORDER
                                    </button>
                                    <button
                                        className={`${styles.completeButton} ${item.status === 'Completed' && styles.activeComplete
                                            }`}
                                        onClick={() => handleCompleteOrder(order.saleNumber, item.orderNumber)}
                                        disabled={item.status !== 'Cooking'}
                                    >
                                        COMPLETE
                                    </button>
                                    <button
                                        className={styles.cancelButton}
                                        onClick={() => openCancelModal(order.saleNumber, item.orderNumber)}
                                        disabled={item.status === 'Completed'}
                                    >
                                        CANCEL
                                    </button>
                                </div>
                            ))}
                    </div>
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