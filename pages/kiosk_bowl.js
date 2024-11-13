import React, { useState, useEffect } from "react";
import styles from './kiosk_bowl.module.css';
import { useRouter } from "next/router";
import { useGlobalState } from '../app/context/GlobalStateContext'; //import global state
import ItemFrame from './itemFrame';


//top bar containing panel info, tracker of items selected, etc.
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
                <button className = {styles.checkOut} onClick={handleCartClick}>
                🛒
                </button>
                <div className={styles.quantContainer}>
                    <div className={styles.sideContainer}>
                        <h2 className={styles.sideQuant}>{numTrackedSides}</h2>
                        <h2 className={styles.sideQuantLabel}>Side</h2>
                    </div>
                    <div className={styles.entreeContainer}>
                        <h2 className={styles.entreeQuant}>{numTrackedEntrees}</h2>
                        <h2 className={styles.entreeQuantLabel}>Entree</h2>
                    </div>
                </div>
            </div>
        </div>
    );
};

const KioskBowlPage = () => {
    const router = useRouter();
    const { menu, priceMap, numTrackedSides, numTrackedEntrees, totalItemCount, resetTrackedSides, resetTrackedEntrees } = useGlobalState();
    const [currentStep, setCurrentStep] = useState("sides"); //step var to indicate whether selecting sides or entrees

    //set currentStep based on the number of tracked sides and entrees
    useEffect(() => {
        if (numTrackedSides < 1) {
            setCurrentStep("sides");
        } 
        else if (numTrackedSides >= 1 && numTrackedEntrees < 1) {
            setCurrentStep("entrees");
        }
    }, [numTrackedSides, numTrackedEntrees]);

    //checking if menu items are fetched correctly
    useEffect(() => {
        console.log("Menu items:", menu); 
    }, [menu]);
    
    //resets counter variables and sets back to sides step
    const handleBackToSides = () => {
        resetTrackedSides();
        resetTrackedEntrees();
        setCurrentStep("sides"); 
    };

    // done button to go back to item page
    const handleDone = () => {
        router.push("/kiosk_item");
    };

    //should go to CART FIXMEEEEE
    const handleCartClick = () => {
        router.push("/kiosk_item");
    };

    let itemsToDisplay = []; //item frames to display depending on selection step
    let headerText = ''; //info text that changes based on selection step
    if (numTrackedSides < 1) { //side selection
        itemsToDisplay = menu.filter(item => item.type === 'side');
        headerText = 'Select Sides';
    } 
    else { //entree selection
        itemsToDisplay = menu.filter(item => item.type === 'entree');
        headerText = 'Select Entrees';
    }

    return (
        <div className= {styles.layout}>
            <div className = {styles.circle}>
                <p>1</p>
            </div>
            
            <div className= {styles.topHeader}>
                <TopBar
                    handleCartClick = {handleCartClick}
                    numTrackedSides={numTrackedSides} 
                    numTrackedEntrees={numTrackedEntrees} 
                />
            </div>
            {headerText && <h2 className={styles.itemHeader}>{headerText}</h2>}
            <div className={styles.itemsContainer}>
                {itemsToDisplay.map(item => (
                <ItemFrame key={item.name} item={item} />
                ))}
            </div> 

             {/* Creates and renders a sticky bottom bar */ }
             {currentStep === "entrees" && (
                <div className={styles.bottomBar}>
                    <button className={styles.bottomButton} onClick={handleBackToSides}>
                        Back to Sides
                    </button>
                    <button
                        className={styles.doneButton}
                        onClick={handleDone}
                        disabled={numTrackedSides !== 1 || numTrackedEntrees !== 1}
                    >
                        Done
                    </button>
                </div>
            )}

        </div>
    );
};

export default KioskBowlPage;