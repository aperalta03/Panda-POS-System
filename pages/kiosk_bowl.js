import React, { useState, useEffect } from "react";
import styles from './kiosk_bowl.module.css';
import { useRouter } from "next/router";
import { useGlobalState } from './context/GlobalStateContext';

const TopBar = ({handleCartClick}) => {
    const router = useRouter();
    return (
        <div className = {styles.KioskItemPanel}>
            <div className = {styles.leftTopPanel}>
                <h1 className = {styles.plateName}>Bowl</h1>
                <h3 className = {styles.selectLabel}>Select:</h3>
                <h3 className = {styles.sideLabel}>1 Side</h3>
                <h3 className = {styles.entreeLabel}>1 Entree</h3>
            </div>
            <div className = {styles.rightTopPanel}>
                <button className = {styles.circleButton} onClick={handleCartClick}>
                🛒
                </button>
                <h2 className = {styles.sideQuant}>0.5</h2>
                <h2 className = {styles.sideQuantLabel}>Side</h2>
                <h2 className = {styles.entreeQuant}>2</h2>
                <h2 className = {styles.entreeQuantLabel}>Entree</h2>
            </div>
        </div>
    );
};

const KioskBowlPage = () => {
    const router = useRouter();
    
    const handleCartClick = () => {
        router.push("/kiosk_item");
    };

    return (
        <div className= {styles.layout}>
            <div className= {styles.topHeader}>
                <TopBar>
                    handleCartClick = {handleCartClick}
                </TopBar>
            </div>
        </div>
    );
};

export default KioskBowlPage;