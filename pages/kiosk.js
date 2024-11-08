import React, { useState, useEffect } from "react";
import styles from './kiosk.module.css';
import { useRouter } from "next/router";

const Welcome = ({toItemPage}) => {
    return (
        <div onClick = {toItemPage} className = {styles.body}>
            <h1 className = {styles.welcomeHeader}>
                We Wok for You
            </h1>
            <h1 className = {styles.orderHeader}>
                Tap to Order Now
            </h1>

            <div className = {styles.bottomPanel}> 
                <button className = {styles.accessibility}>accessibility</button>
            </div>
        </div>
    );
};

const KioskPage = () => {
    const router = useRouter();

    const toItemPage = () => {
        router.push("/kiosk_item");
    }

    return (
        <div>
           <Welcome 
                toItemPage={toItemPage} 
            /> 
        </div>
    );
};

export default KioskPage;