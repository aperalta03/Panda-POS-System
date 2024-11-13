import React from "react";
import styles from "./cashier.module.css";

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