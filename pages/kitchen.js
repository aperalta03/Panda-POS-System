import React, { useState, useEffect } from 'react';
import styles from './kitchen.module.css';
import { Modal, Button } from '@mui/material';

import Head from "next/head"; // Import Head for managing the document head


/**
 * Kitchen Page Component
 *
 * @author Anson Thai
 *
 * @description
 * Displays orders and their items in a grid layout.
 * Supports text-to-speech for each order, removing sales, and updating order status.
 *
 * @features
 * - Text-to-Speech: Reads out the items in each sale.
 * - Remove Sale: Deletes a sale from the orders list.
 * - Update Order Status: Updates the status of an order item.
 *
 * @state
 * - orders: Holds the list of orders, each containing a sale number and an array of items.
 * - isModalOpen: Boolean indicating whether the cancel order modal is open.
 * - cancelOrderDetails: Holds the sale number and order number of the order to be cancelled.
 *
 * @methods
 * - handleTextToSpeech: Generates a text-to-speech message for the given sale number.
 * - handleRemoveSale: Removes a sale from the orders list.
 * - handleStartOrder: Updates the status of an order item to 'Cooking'.
 * - handleCompleteOrder: Updates the status of an order item to 'Completed'.
 * - openCancelModal: Opens the cancel order modal with the given sale number and order number.
 * - handleCancelOrder: Cancels an order and removes it from the orders list.
 * - closeModal: Closes the cancel order modal.
 *
 * @dependencies
 * - Material-UI: For modal, form controls, and buttons.
 */
const KitchenPage = () => {
    const [orders, setOrders] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cancelOrderDetails, setCancelOrderDetails] = useState({ saleNumber: null, orderNumber: null });

    useEffect(() => {
        /**
         * Fetches orders from the server and updates the component state.
         *
         * This function is called whenever the component mounts or updates.
         * It fetches the orders list from the server and updates the component state.
         * If the server returns an error, it logs the error to the console.
         */
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

    /**
     * Removes a sale from the kitchen screen.
     *
     * Sends a POST request to the server to remove the sale.
     * If successful, it updates the orders list in the local state.
     * Logs an error if the request fails or encounters an exception.
     *
     * @async
     * @param {number} saleNumber - The unique identifier for the sale.
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
     * Announces the items in the sale with the given sale number.
     *
     * It finds the sale in the orders list and iterates over its items. For each item, it
     * determines the counts of each component and generates a string description of the
     * item. It then creates a SpeechSynthesisUtterance object with that string and
     * speaks it using the window.speechSynthesis object.
     *
     * If the sale is not found, it speaks a message indicating that.
     *
     * @param {number} saleNumber - The unique identifier for the sale.
     */
    const textToSpeech = async (saleNumber) => {
        const saleToSpeech = orders.find(order => order.saleNumber === saleNumber);

        if (saleToSpeech) {
            const { items } = saleToSpeech;

            items.forEach(item => {
                const { orderNumber, plateSize, components } = item;

                const componentCounts = components.reduce((acc, component) => {
                    acc[component] = (acc[component] || 0) + 1;
                    return acc;
                }, {});

                const specialComponents = ["Super Greens", "Chow Mein", "Fried Rice", "White Steamed Rice"];
                specialComponents.forEach(side => {
                    if (componentCounts[side]) {
                        const count = componentCounts[side];
                        if (count === 1) {
                            componentCounts[side] = 0.5; // Single = half
                        } else if (count === 2) {
                            componentCounts[side] = 1; // Double = one
                        } else if (count > 2) {
                            componentCounts[side] = 1 + (count - 2); // Two = one, extras count normally
                        }
                    }
                });

                const componentsArray = Object.entries(componentCounts)
                    .map(([component, count]) => {
                        if (count === 2) return `double ${component}`;
                        if (count === 3) return `triple ${component}`;
                        if (count === 0.5) return `half ${component}`;
                        return count > 3 ? `${count} times ${component}` : component;
                    });

                const componentDescription = componentsArray.length > 1
                    ? `${componentsArray.slice(0, -1).join(', ')}, and ${componentsArray[componentsArray.length - 1]}`
                    : componentsArray[0] || '';

                const message = `Order number ${orderNumber}: ${plateSize} with ${componentDescription}`;
                const utterance = new SpeechSynthesisUtterance(message);
                window.speechSynthesis.speak(utterance);
            });
        } else {
            const utterance = new SpeechSynthesisUtterance(`No matching order found for sale number ${saleNumber}`);
            window.speechSynthesis.speak(utterance);
        }
    };

    const handleTextToSpeech = (saleNumber) => {
        textToSpeech(saleNumber);
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
        setIsModalOpen(true);
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
            setIsModalOpen(false);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className={styles.gridContainer}>
            {orders.map(order => (
                <div className={styles.saleContainer} key={order.saleNumber}>
                    <div className={styles.saleHeader}>SALE #{order.saleNumber}</div>
                    {order.items.every(item => item.status === 'Completed') ? (
                        <button
                            className={styles.removeSaleButton}
                            onClick={() => handleRemoveSale(order.saleNumber)}
                        >
                            REMOVE SALE
                        </button>
                    ) : (
                        <button
                            className={styles.textToSpeechButton}
                            onClick={() => handleTextToSpeech(order.saleNumber)}
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
                                        onClick={() => handleStartOrder(order.saleNumber, item.orderNumber)}
                                        disabled={item.status !== 'Not Started'}
                                    >
                                        START ORDER
                                    </button>
                                    <button
                                        className={`${styles.completeButton} ${item.status === 'Completed' && styles.activeComplete}`}
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