import React from "react";
import styles from "./cashierComponents.module.css";

/**
 * @author Brandon Batac
 * 
 * @description
 * A React component that displays a list of all items in the current order. 
 * Each item shows the plate size and components, with an option to delete the order.
 * 
 * @param {object} props - The properties passed to the component.
 * @param {Array<Object>} props.orders - An array of objects, each containing 
 *   a 'plateSize' property and a 'components' property (an array of strings).
 * @param {function} props.onDelete - A function to call when the 'DELETE' button is clicked, 
 *   which accepts the index of the order to delete.
 * @param {string} props.seasonalItemName - The name of the seasonal item to be displayed 
 *   in place of the "Seasonal Item" label.
 * 
 * @returns {JSX.Element} The OrderPanel component.
 * 
 * @example
 * // Example usage:
 * <OrderPanel 
 *   orders={[
 *     { plateSize: 'Plate', components: ['Item 1', 'Seasonal Item'] },
 *     { plateSize: 'Bowl', components: ['Item 2'] }
 *   ]}
 *   onDelete={(index) => console.log("Delete order at index:", index)}
 *   seasonalItemName="Pumpkin Soup"
 * />
 * 
 * @since 1.0.0
 * 
 * @module OrderPanel
 */
const OrderPanel = ({ orders, onDelete, seasonalItemName }) => {
    return (
        <div className={styles.orderPanel}>
            <h1>ORDER TOTAL</h1>
            {orders.map((order, index) => (
                <div
                    key={index}
                    className={`${styles.orderRow} ${index % 2 === 0 ? styles.evenRow : styles.oddRow
                        }`}
                >
                    <span>
                        {order.plateSize} (
                        {order.components
                            .map((item) =>
                                item === "Seasonal Item" ? seasonalItemName : item
                            )
                            .join(", ")}
                        )
                    </span>
                    <button
                        onClick={() => onDelete(index)}
                        className={styles.deleteButton}
                    >
                        DELETE
                    </button>
                </div>
            ))}
        </div>
    );
};

export default OrderPanel;