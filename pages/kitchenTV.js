import React, { useEffect, useState } from 'react';
import styles from './kitchenTV.module.css';
import { Divider } from '@mui/material';

import Head from "next/head"; // Import Head for managing the document head

/**
 * KitchenTV
 * 
 * @author Anson Thai, Alonso Peralta Espinoza
 * 
 * @description
 * Displays orders in real-time in the kitchen queue.
 * 
 * @features
 * - **API Call**: Fetches orders from the API and formats the data for display.
 * - **Data Grouping**: Groups items by saleNumber for structured display.
 * - **Elapsed Time Calculation**: Calculates the time elapsed since the order was placed.
 * - **Elapsed Time Display**: Displays the time elapsed since the order was placed.
 * - **Component List**: Displays the list of components in the plate.
 * - **Component Transform**: Modifies the display of components if they appear only once.
 * - **Error Handling**: Catches and logs errors, returning a 500 status code.
 * - **Request Validation**: Ensures only GET requests are processed.
 * 
 * @requestMethod
 * - `GET`: Fetches the orders.
 * 
 * @response
 * - `200 OK`: Returns a JSON object containing the grouped orders.
 * - `500 Internal Server Error`: Returns an error message if data retrieval fails.
 * - `405 Method Not Allowed`: Returns an error message if the request method is not `GET`.
 * 
 * @returns {Object} JSON response with grouped orders.
 * - `orders` (Array): Array of order objects grouped by `saleNumber`.
 *   - `saleNumber` (number): Unique identifier for the sale.
 *   - `saleDate` (Date): Date of the sale.
 *   - `saleTime` (string): Time of the sale.
 *   - `totalPrice` (number): Total price of the sale.
 *   - `employeeID` (number): ID of the employee who processed the sale.
 *   - `source` (string): Source of the sale (e.g., "Kiosk").
 *   - `items` (Array): Array of items for the sale, where each item contains:
 *     - `orderNumber` (number): Order number.
 *     - `plateSize` (string): Size of the plate.
 *     - `components` (Array): List of components in the plate.
 *     - `status` (string): Status of the order (e.g., "Not Started", "In Progress", "Completed").
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