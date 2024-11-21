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

    
    const textToSpeech = async (saleNumber) => {

        const saleToSpeech = orders.find(order => order.saleNumber === saleNumber);

        if (saleToSpeech) {

            const { items } = saleToSpeech;

            items.forEach(item => {

                if (item.status === "Completed") {
                    return;
                }

                const { orderNumber, plateSize, components } = item;

                // Count the frequency of components
                const componentCounts = components.reduce((acc, component) => {
                    acc[component] = (acc[component] || 0) + 1;
                    return acc;
                }, {});

                // Adjust for special rules (Super Greens, Chow Mein, Fried Rice, White Steamed Rice)
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

                // Construct the component description
                const componentsArray = Object.entries(componentCounts)
                    .map(([component, count]) => {
                        if (count === 2) return `double ${component}`;
                        if (count === 3) return `triple ${component}`;
                        if (count === 0.5) return `half ${component}`;
                        return count > 3 ? `${count} times ${component}` : component;
                    });

                // Add "and" before the final component
                const componentDescription = componentsArray.length > 1
                    ? `${componentsArray.slice(0, -1).join(', ')}, and ${componentsArray[componentsArray.length - 1]}`
                    : componentsArray[0] || '';

                // Construct the speech message
                const message = `Order number ${orderNumber}: ${plateSize} with ${componentDescription}`;
                console.log(message); // For debugging

                // Speak the message
                const utterance = new SpeechSynthesisUtterance(message);
                window.speechSynthesis.speak(utterance);
            });
        } else {
            console.log("No matching order found.");
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
                    {order.items.every(item => item.status === 'Completed') ? (
                        <button
                            className={`${styles.removeSaleButton}`}
                            onClick={() => handleRemoveSale(order.saleNumber)} // Add your handler for removing the sale
                        >
                            REMOVE SALE
                        </button>
                    ) : (
                        <button
                            className={`${styles.textToSpeechButton}`} // Apply appropriate styling for this button
                            onClick={() => handleTextToSpeech(order.saleNumber)} // Add your handler for text-to-speech functionality
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