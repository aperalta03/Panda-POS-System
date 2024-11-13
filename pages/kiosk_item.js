import React, { useState, useEffect } from "react";
import styles from './kiosk_item.module.css';
import { useRouter } from "next/router";
import { useGlobalState } from '../app/context/GlobalStateContext';

const TopBar = ({handleCartClick, handleOptionsClick}) => {
    const router = useRouter();
    return (
        <div className = {styles.KioskItemPanel}>
        <div className={styles.leftButtons}>
            <div className={styles.cartAndPriceContainer}>
                <button className={styles.circleButton} onClick={handleCartClick}>
                    <img src="/cart2_img.png" alt="Cart Icon" className={styles.cartImage} />
                </button>
                <h1 className={styles.priceLabel}>$11.20</h1>
        </div>
            <div className={styles.gearButtonContainer}>
                <button className={styles.circleButton} onClick={handleOptionsClick}>
                    <img src="/handicap_button.jpg" alt="Accessible Icon" className={styles.accessImage} />
                </button>
            </div>
        </div>
            <div className = {styles.leftPanel}>
                <div className = {styles.rightButtons}> 
                    <button className = {styles.checkOut} onClick={() => {router.push("/kiosk")}}>
                        Checkout
                    </button>
                    <button className = {styles.genStartOver} onClick={() => {router.push("/kiosk")}}>
                        <div className={styles.inlineText}>
                            <span className = {styles.x}>X</span>
                            <span className = {styles.startOver}>Start Over</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

const KioskItemPanel = ({}) => {
    const router = useRouter();
    //<a href="#" className={styles.itemImg}><img src="/bowl_img.png" alt="Image of Panda Express Bowl"/></a>
    //<a href="#" className={styles.itemImg}><img src="/plate_img.png" alt="Image of Panda Express Plate"/></a>
    //<a href="#" className={styles.itemImg}><img src="/bigger_plate_img.png" alt="Image of Panda Express Bigger Plate"/></a>
    //<a href="#" className={styles.itemImg}><img src="/a_la_carte_img.png" alt="Image of Panda Express A La Carte Item"/></a>
    return (
        <div className = {styles.midPanel}>
            <div className = {styles.itemButtons}>
            <button onClick={() => {router.push("/kiosk_bowl")}}>
                <p className = {styles.itemLeft}>Bowl | $9.50</p>
                <div className = {styles.itemRight}>
                    <p className = {styles.itemRight}>1 Side</p>
                    <p className = {styles.itemRight}>1 Entree</p>
                </div>
            </button>
            <button onClick={() => {router.push("/kiosk_plate")}}>
                <p className = {styles.itemLeft}>Plate | $11.50</p>
                <div className = {styles.itemRight}>
                    <p className = {styles.itemRight}>1 Side</p>
                    <p className = {styles.itemRight}>2 Entrees</p>
                </div>
            </button>
            <button onClick={() => {router.push("/kiosk_bigger_plate")}}>
                <p className = {styles.itemLeft}>Bigger Plate | $13.50</p>
                <div className = {styles.itemRight}>
                    <p className = {styles.itemRight}>1 Side</p>
                    <p className = {styles.itemRight}>3 Entrees</p>
                </div>
            </button>
            <button onClick={() => {router.push("/kiosk_a_la_carte")}}>
                <p className = {styles.itemLeft}>A La Carte</p>
                <div className = {styles.itemRight}>
                    <p className = {styles.itemRight}>Any Food Item</p>
                    <p className = {styles.itemRight}>Any Drink</p>
                </div>
            </button>
            </div>
        </div>    
    );
};

const BottomBar = () => {
    return (
        <div className = {styles.bottomPanel}>
            <h1 className = {styles.bottomHeader}>Choose A Meal Above</h1>
        </div>
    );
};

const KioskItemPage = () => {
    const router = useRouter();
    const [isOptionsOpens, setIsOptionsOpen] = useState(false);

    const handleCartClick = () => {
        router.push("/kiosk_item");
    };

    const handleOptionsClick = () => {
        setIsOptionsOpen(!isOptionsOpen);
    };
    
    return (
        <div className= {styles.layout}>
            <div className = {styles.circle}>
                <p>1</p>
            </div>
            <div className= {styles.topHeader}>
                <TopBar>
                    handleCartClick = {handleCartClick}
                    handleOptionsClick = {handleOptionsClick}
                </TopBar>
            </div>
            <div className= {styles.midPanel}>
                <KioskItemPanel />
            </div>
            <div className= {styles.bottomPanel}>
                <BottomBar />
            </div>
        </div>
    );
};

export default KioskItemPage;