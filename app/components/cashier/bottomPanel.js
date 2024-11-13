import React from "react";
import styles from "./cashier.module.css";

const BottomPanel = ({
  netCost,
  handlePayClick,
  handleSeasonalAddDelete,
  seasonalItemActive,
  handleAdjust,
}) => (
  <div className={styles.bottomPanel}>
    <div className={styles.leftPanel}>
      <div className={styles.labels}>
        <h2 className={styles.netLabel}>Net: ${netCost.toFixed(2)}</h2>
        <h2 className={styles.taxLabel}>
          Tax: ${(netCost * 0.0625).toFixed(2)}
        </h2>
        <h1 className={styles.totalLabel}>
          TOTAL | ${(netCost + netCost * 0.0625).toFixed(2)}
        </h1>
      </div>
      <button onClick={handlePayClick} className={styles.payButton}>
        PAY
      </button>
    </div>

    <div className={styles.rightPanel}>
      <button onClick={handleSeasonalAddDelete} className={styles.addItem}>
        {seasonalItemActive ? "DELETE MENU ITEM" : "ADD MENU ITEM"}
      </button>
      <button onClick={handleAdjust} className={styles.adjustButton}>
        ADJUST ITEM
      </button>
    </div>
  </div>
);

export default BottomPanel;