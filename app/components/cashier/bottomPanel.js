import React from "react";
import { Button } from "@mui/material";
import styles from "./cashierComponents.module.css";

/**
 * @author Uzair Khan, Brandon Batac
 * 
 * @description
 * A React component that displays the total cost of an order, including tax, 
 * and a 'PAY' button at the bottom of the screen. It calculates tax at 6.25% 
 * and formats the total cost dynamically.
 * 
 * @param {object} props - The properties passed to the component.
 * @param {number} props.netCost - The total cost of the order, excluding tax.
 * @param {function} props.handlePayClick - Function to invoke when the 'PAY' button is clicked.
 * 
 * @returns {JSX.Element} The BottomPanel component.
 * 
 * @example
 * // Example usage:
 * <BottomPanel 
 *   netCost={100.00} 
 *   handlePayClick={() => console.log("Pay clicked!")} 
 * />
 * 
 * @since 1.0.0
 * 
 * @module bottomPanel
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