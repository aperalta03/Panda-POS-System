import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useRole } from '../context/roleProvider';
import styles from './navbar.module.css';

const Navbar = () => {
    const { role, setRole } = useRole();
    const [time, setTime] = useState("");
    const router = useRouter();

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

    const handleLogoff = () => {
        setRole(null);
        localStorage.removeItem('role');
        router.push('/login');
    };

    const toggleView = () => {
        if (router.pathname === '/manager') {
            router.push('/cashier');
        } else {
            router.push('/manager');
        }
    };

    return (
        <div className={styles.mainContainer}>
            <button
                className={`${styles.logoffButton} ${role ? styles.visible : ''}`}
                onClick={handleLogoff}
                aria-label="Log Off"
            >
                Log Off
            </button>
            <button
                className={`${styles.pageButton} ${role === "manager" ? styles.visible : ''}`}
                onClick={toggleView}
            >
                Switch View
            </button>
            <h1 className={styles.title}>Welcome to Panda Express</h1>
            <div className={styles.detailsBox}>
                <div className={styles.timestamp}>{time}</div>
                <img className={styles.logo} src='chickenmaxxing_logo.png' alt="Logo"/>
            </div>
        </div>
    );
};

export default Navbar;