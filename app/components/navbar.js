import React, { useState, useEffect } from 'react';
import styles from './navbar.module.css';

const Navbar = () => {
    const [time, setTime] = useState("");

    useEffect(() => {
        const updateTime = () => {
        const now = new Date();
        setTime(
            now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        );
        };
        updateTime();
        const timer = setInterval(updateTime, 60000); // Update every minute
        return () => clearInterval(timer);
    }, []);

    return (
        <div className={styles.mainContainer}>
            <button className={styles.pageButton}>
                Cashier View
            </button>
            <h1 className={styles.title}>
                Welcome to Panda Express
            </h1>
            <div className={styles.detailsBox}>
                {/* Weather & TimeStamp */}
                <div className={styles.timestamp}>{time}</div>
                <img className={styles.logo} src='chickenmaxxing_logo.png'/>
            </div>
        </div>
    )
}

export default Navbar;