import React, { useState, useEffect } from "react";
import styles from './kiosk_bowl.module.css';
import { useRouter } from "next/router";
import { useGlobalState } from '../app/context/GlobalStateContext';
import ItemFrame from './itemFrame';

const TopBar = ({handleCartClick, numTrackedSides, numTrackedEntrees}) => {
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
                <h2 className = {styles.sideQuant}>{numTrackedSides}</h2>
                <h2 className = {styles.sideQuantLabel}>Side</h2>
                <h2 className = {styles.entreeQuant}>{numTrackedEntrees}</h2>
                <h2 className = {styles.entreeQuantLabel}>Entree</h2>
            </div>
        </div>
    );
};

const KioskBowlPage = () => {
    const router = useRouter();
    const { menu, priceMap, numTrackedSides, numTrackedEntrees, totalItemCount } = useGlobalState();

    useEffect(() => {
        console.log("Menu items:", menu); // Check if menu items are fetched correctly
    }, [menu]);
    
    const handleCartClick = () => {
        router.push("/kiosk_item");
    };

    return (
        <div className= {styles.layout}>
            <div className= {styles.topHeader}>
                <TopBar
                    handleCartClick = {handleCartClick}
                    numTrackedSides={numTrackedSides} 
                    numTrackedEntrees={numTrackedEntrees} 
                />
            </div>
            <div className={styles.itemsContainer}>
                {menu.map(item => (
                <ItemFrame key={item.name} item={item} />
                ))}
            </div>  
        </div>
    );
};

export default KioskBowlPage;