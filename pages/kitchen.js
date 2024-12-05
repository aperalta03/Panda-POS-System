import React, { useState, useEffect } from 'react';
import styles from './kitchen.module.css';
import { Modal, Button } from '@mui/material';

import Head from "next/head"; // Import Head for managing the document head


/**
 * @description
 * Displays orders and their items in a grid layout.
 * Supports text-to-speech for each order, removing sales, and updating order status.
 * 
 * @author Anson Thai, Alonso Peralta Espinoza
 *
 * @param {object} props - The properties passed to the component.
 * @param {Array<Object>} props.orders - Holds the list of orders, each containing a sale number and an array of items.
 * @param {boolean} props.isModalOpen - Boolean indicating whether the cancel order modal is open.
 * @param {object} props.cancelOrderDetails - Holds the sale number and order number of the order to be cancelled.
 *
 * @returns {JSX.Element} The rendered Kitchen Page component.
 *
 * @example
 * <KitchenPage orders={ordersArray} isModalOpen={true} cancelOrderDetails={cancelDetailsObject} />
 *
 * @module Kitchen
 */
const KitchenPage = () => {
    const [orders, setOrders] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cancelOrderDetails, setCancelOrderDetails] = useState({ saleNumber: null, orderNumber: null });

    // Fetch orders from the server
    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/kitchen-get-orders');
            const data = await response.json();
            setOrders(data.orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    // Periodically fetch orders every second
    useEffect(() => {
        fetchOrders(); // Initial fetch
        const interval = setInterval(fetchOrders, 1000); // Fetch every second

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);

    /**
     * Updates the status of an order item and updates the orders list.
     *
     * @param {number} saleNumber - The unique identifier for the sale.
     * @param {number} orderNumber - The order number to update.
     * @param {string} newStatus - The new status of the order (e.g., "Not Started", "Cooking", "Completed").
     *
     * @returns {Promise<void>}
     */
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

    /**
     * Removes a sale from the kitchen view by making a POST request to /api/kitchen-remove-sale
     * with the saleNumber as the request body.
     *
     * @param {number} saleNumber - The sale number to remove
     *
     * @returns {Promise<void>}
     */
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

    /**
     * Takes a sale number as input and speaks out the corresponding order.
     * It will iterate through the items of the sale and generate a message
     * that describes the order, including the order number, plate size, and
     * components. The message is then spoken out using the
     * SpeechSynthesis API.
     *
     * If no matching order is found, it will speak out a message
     * indicating that no matching order was found.
     *
     * @param {number} saleNumber - The sale number to speak out.
     */
    const textToSpeech = (saleNumber) => {
        const saleToSpeech = orders.find(order => order.saleNumber === saleNumber);

        if (saleToSpeech) {
            const { items } = saleToSpeech;

            items.forEach(item => {
                const { orderNumber, plateSize, components } = item;

                const componentCounts = components.reduce((acc, component) => {
                    acc[component] = (acc[component] || 0) + 1;
                    return acc;
                }, {});

                const componentsArray = Object.entries(componentCounts).map(([component, count]) => {
                    if (count === 2) return `double ${component}`;
                    if (count === 3) return `triple ${component}`;
                    if (count === 1) return component;
                    return `${count} times ${component}`;
                });

                const message = `Order number ${orderNumber}: ${plateSize} with ${componentsArray.join(', ')}`;
                const utterance = new SpeechSynthesisUtterance(message);
                window.speechSynthesis.speak(utterance);
            });
        } else {
            const utterance = new SpeechSynthesisUtterance(`No matching order found for sale number ${saleNumber}`);
            window.speechSynthesis.speak(utterance);
        }
    };
    /**
     * Opens the cancellation modal for the given sale number and order number.
     * 
     * @param {number} saleNumber - The sale number of the order to cancel.
     * @param {number} orderNumber - The order number to cancel.
     */
    const openCancelModal = (saleNumber, orderNumber) => {
        setCancelOrderDetails({ saleNumber, orderNumber });
        setIsModalOpen(true);
    };
    /**
     * Handles the cancellation of an order.
     * 
     * @description
     * Calls the `/api/kitchen-cancel-order` API endpoint to cancel the order.
     * If the request is successful, it removes the order from the list of orders
     * if it has no items left. If the request fails, it logs an error message.
     * 
     * @returns {undefined}
     */

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
            setIsModalOpen(false);
        }
    };

    const closeModal = () => setIsModalOpen(false);

    return (
        <div className={styles.gridContainer}>
            {orders.map(order => (
                <div className={styles.saleContainer} key={order.saleNumber}>
                    <div className={styles.saleHeader}>SALE #{order.saleNumber}</div>
                    {order.items.every(item => item.status === 'Completed') ? (
                        <button
                            className={styles.removeSaleButton}
                            onClick={() => removeSale(order.saleNumber)}
                        >
                            REMOVE SALE
                        </button>
                    ) : (
                        <button
                            className={styles.textToSpeechButton}
                            onClick={() => textToSpeech(order.saleNumber)}
                        >
                            TEXT TO SPEECH
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
                                        className={`${styles.startOrderButton} ${item.status === 'Cooking' && styles.activeStart}`}
                                        onClick={() => updateOrderStatus(order.saleNumber, item.orderNumber, 'Cooking')}
                                        disabled={item.status !== 'Not Started'}
                                    >
                                        START ORDER
                                    </button>
                                    <button
                                        className={`${styles.completeButton} ${item.status === 'Completed' && styles.activeComplete}`}
                                        onClick={() => updateOrderStatus(order.saleNumber, item.orderNumber, 'Completed')}
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

            <Modal open={isModalOpen} onClose={closeModal}>
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