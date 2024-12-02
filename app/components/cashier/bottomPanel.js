import React from "react";
import { Button } from "@mui/material";
import styles from "./cashierComponents.module.css";

/**
 * 
 * @author Uzair Khan, Brandon Batac
 * 
 * Component that displays the total cost of the order, including tax,
 * at the bottom of the screen.  It also includes a button to pay.
 *
 * @param {number} netCost - The total cost of the order, not including tax.
 * @param {function} handlePayClick - Function to call when the 'PAY' button is clicked.
 *
 *
 */
const BottomPanel = ({ netCost, handlePayClick }) => {
  return (
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
        <Button onClick={handlePayClick} className={styles.payButton}>
          PAY
        </Button>
      </div>
    </div>
  );
};

export default BottomPanel;
