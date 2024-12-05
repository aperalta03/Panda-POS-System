import React, { useEffect, useState } from 'react';
import styles from './kitchenTV.module.css';
import { Divider } from '@mui/material';

import Head from "next/head"; // Import Head for managing the document head

/**
 * @description
 * Displays orders in real-time in the kitchen queue.
 * 
 * @author Anson Thai, Alonso Peralta Espinoza
 *
 * @param {object} props - The properties passed to the component.
 * @param {Array<Object>} props.orders - Array of orders grouped by `saleNumber`, containing order details.
 *
 * @returns {JSX.Element} The rendered KitchenTV component displaying the orders.
 *
 * @example
 * // Request:
 * GET /api/kitchen-orders
 * 
 * // Response:
 * {
 *   "orders": [
 *     {
 *       "saleNumber": 12345,
 *       "saleDate": "2024-01-01",
 *       "saleTime": "12:34:56",
 *       "totalPrice": 29.99,
 *       "employeeID": 1001,
 *       "source": "Kiosk",
 *       "items": [
 *         {
 *           "orderNumber": 1,
 *           "plateSize": "Large",
 *           "components": [
 *             { "componentName": "Chicken", "quantity": 2 },
 *             { "componentName": "Rice", "quantity": 1 }
 *           ],
 *           "status": "In Progress"
 *         }
 *       ]
 *     }
 *   ]
 * }
 * 
 * // Error Response:
 * {
 *   "error": "Error fetching orders"
 * }
 * @module kitchenTV
 */
const KitchenTV = () => {
    const [sales, setSales] = useState([]);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Fetch sales data from the API
    const fetchSales = async () => {
        try {
            const response = await fetch('/api/kitchen-get-orders');
            const data = await response.json();

            const salesArray = data.orders.map(order => {
                const {
                    saleNumber,
                    saleDate,
                    saleTime,
                    totalPrice,
                    items,
                } = order;

                const datePart = saleDate.split('T')[0]; // Extract the date part
                const saleDateTime = new Date(`${datePart}T${saleTime}`);

                return {
                    saleNumber,
                    saleDateTime,
                    totalPrice,
                    items,
                };
            });

            setSales(salesArray);
        } catch (error) {
            console.error('Error fetching sales:', error);
        }
    };

    // Fetch sales and update current time every second
    useEffect(() => {
        fetchSales(); // Initial fetch

        const interval = setInterval(() => {
            fetchSales();
            setCurrentTime(new Date());
        }, 1000); // Update every second

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);

    const orderTimer = (dateTime) => {
        if (!dateTime) return "Time Not Available";

        const differenceInMilliseconds = currentTime - new Date(dateTime);

        if (differenceInMilliseconds < 0) {
            return "In the future";
        }

        const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
        const hours = Math.floor(differenceInSeconds / 3600);
        const minutes = Math.floor((differenceInSeconds % 3600) / 60);
        const seconds = differenceInSeconds % 60;

        const formattedHours = String(hours).padStart(2, "0");
        const formattedMinutes = String(minutes).padStart(2, "0");
        const formattedSeconds = String(seconds).padStart(2, "0");

        return {
            time: `${formattedHours}:${formattedMinutes}:${formattedSeconds}`,
            isOverFiveMinutes: minutes >= 5 || hours > 0,
        };
    };

    return (
        <>
            <Head>
                <title>Kitchen TV View</title>
                <meta name="description" content="View Orders in Real Time in the Kitchen Queue" />
            </Head>
            <div className={styles.tvContainer}>
                <div className={styles.gridContainer}>
                    {sales.map(sale => (
                        <div className={styles.saleContainer} key={sale.saleNumber}>
                            <div className={styles.saleHeader}>
                                SALE #{sale.saleNumber}
                                <p>
                                    <span style={{ color: "white" }}>Elapsed Time: </span>
                                    <span
                                        style={{
                                            color: orderTimer(sale.saleDateTime).isOverFiveMinutes ? "red" : "yellow",
                                        }}
                                    >
                                        {orderTimer(sale.saleDateTime).time}
                                    </span>
                                </p>
                            </div>

                            {sale.items
                                .filter(item => item.status !== 'Canceled')
                                .map(item => (
                                    <div
                                        className={
                                            item.status === 'Completed'
                                                ? styles.completedBox
                                                : styles.orderBox
                                        }
                                        key={`${sale.saleNumber}-${item.orderNumber}`}
                                    >
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
                                        <div className={styles.orderDetails}>
                                            <p>Plate Size: {item.plateSize}</p>
                                            <p>Items:</p>
                                            <ul>
                                                {item.components.map((component, index) => (
                                                    <li key={index}>{component}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            <Divider className={styles.divider} />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default KitchenTV;