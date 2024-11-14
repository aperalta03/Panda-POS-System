import React from "react";
import { Button } from "@mui/material";
import styles from "./cashierComponents.module.css";

const BottomPanel = ({ netCost, handlePayClick }) => {
  return (
    <div className={styles.bottomPanel}>
      <div className={styles.leftPanel}>
        <div className={styles.labels}>
          <h2 className={styles.netLabel}>Net: ${netCost.toFixed(2)}</h2>
          <h2 className={styles.taxLabel}>Tax: ${(netCost * 0.0625).toFixed(2)}</h2>
          <h1 className={styles.totalLabel}>TOTAL | ${(netCost + netCost * 0.0625).toFixed(2)}</h1>
        </div>
        <Button onClick={handlePayClick} className={styles.payButton}>PAY</Button>
      </div>
    </div>
  );
};

export default BottomPanel;