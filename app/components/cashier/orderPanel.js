import React from "react";
import styles from "./cashierComponents.module.css";

/**
 *
 * @author Brandon Batac
 *
 * Component that displays a list of all items in the current order.
 *
 * @param {Array<Object>} orders - An array of objects, each of which contains
 *   a 'plateSize' property and a 'components' property, which is an array of
 *   strings representing the components of the plate.
 * @param {function} onDelete - Function to call when the 'DELETE' button is
 *   clicked.  It should take one argument, the index of the order to delete.
 * @param {string} seasonalItemName - The name of the seasonal item to be
 *   displayed in the order panel.
 */

const OrderPanel = ({ orders, onDelete, seasonalItemName }) => {
  return (
    <div className={styles.orderPanel}>
      <h1>ORDER TOTAL</h1>
      {orders.map((order, index) => (
        <div
          key={index}
          className={`${styles.orderRow} ${
            index % 2 === 0 ? styles.evenRow : styles.oddRow
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
