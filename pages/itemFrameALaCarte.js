import React, { useState, useEffect } from 'react';
import { useGlobalState } from '../app/context/GlobalStateContext'; //import global state
import styles from './itemFrameALaCarte.module.css';

const ItemFrame = ({ item, isDone }) => {
  const { 
    menu, 
    setMenu, 
    numTrackedSides, 
    setNumTrackedSides, 
    numTrackedEntrees, 
    setNumTrackedEntrees,
    setNumTrackedOthers,
    numTrackedOthers,
    priceMap 
  } = useGlobalState();

  const [showDescription, setShowDescription] = useState(false); //var to show description of an item

  //handles incrementation
  const handleIncrement = () => {
    if (isDone && item.type === 'entree') return; 
    const updatedMenu = menu.map((menuItem) => {
      if (menuItem.name === item.name) {
        const incrementAmount = item.type === 'side' ? 0.5 : 1;
        const updatedItem = { ...menuItem, count: menuItem.count + incrementAmount };

        if (item.type === 'side') {
          setNumTrackedSides(numTrackedSides + 0.5);
        } 
        else if (item.type === 'entree') {
          setNumTrackedEntrees(numTrackedEntrees + 1);
        }
        else if (item.type === 'other') {
          setNumTrackedOthers(numTrackedOthers + 1);
        }

        return updatedItem;
      }
      return menuItem;
    });
    setMenu(updatedMenu);
  };

  //handles decrement
  const handleDecrement = () => {
    const updatedMenu = menu.map((menuItem) => {
      if (menuItem.name === item.name && menuItem.count > 0) {
        const decrementAmount = item.type === 'side' ? 0.5 : 1;
        const updatedItem = { ...menuItem, count: menuItem.count - decrementAmount };

        if (item.type === 'side' && numTrackedSides > 0) {
          setNumTrackedSides(numTrackedSides - 0.5);
        } 
        else if (item.type === 'entree' && numTrackedEntrees > 0) {
          setNumTrackedEntrees(numTrackedEntrees - 1);
        }
        else if (item.type === 'other' && numTrackedOthers > 0) {
          setNumTrackedOthers(numTrackedOthers - 1);
        }

        return updatedItem;
      }
      return menuItem;
    });
    setMenu(updatedMenu);
  };

  //handles toggling description of an item
  const toggleDescription = () => {
    setShowDescription(!showDescription);
  };

  //depends on designation, setting a different icon
  const getDesignationIcon = (designation) => {
    console.log(designation);
    switch (designation) {
      case 'Premium':
        return 'P';
      case 'Spicy':
        return 'S';
      case 'Veggie':
        return 'V';
      default:
        return null;
    }
  };

  const designationIcon = getDesignationIcon(item.designation);
  const designationClass = item.designation ? `${styles[item.designation.toLowerCase() + 'designation']}` : ''; //setting designation style class based on icon
  //console.log(designationClass); 

  const price = priceMap[item.name];

  return (
    <div className={`${styles.itemFrame}`}>
      <img src={item.image} alt={item.name} className={styles.itemImage} />
      
      <h3 className = {styles.name}>{item.name}</h3>
      <p className = {styles.calories}>{item.calories} Cal.</p>
      {price && <p className = {styles.price}>${price.toFixed(2)}</p>} {/* Display the price with 2 decimal points */}


      <div className={styles.infoButtonContainer}>
        {designationIcon && (
            <div className={`${styles.designationIcon} ${designationClass}`}>{designationIcon}</div>
        )}
        <button onClick={toggleDescription} className={styles.infoButton}>i</button>
      </div>

      {showDescription && (
          <div className={styles.popup}>
            <div className={styles.popupContent}>
                <p>{item.description}</p>
                <p>
                <span className={styles.designationLabel}>Designation:</span> {item.designation ? item.designation : 'No specific designation'}
                </p>
                <button onClick={toggleDescription} className={styles.closeButton}>Close</button>
            </div>
          </div>
      )}
    
      <div className={styles.counterContainer}>
          <button className={styles.addSub} onClick={handleDecrement}>-</button>
          <span>{item.count}</span>
          <button 
            className={styles.addSub} 
            onClick={handleIncrement}
            disabled={item.type === 'entree' && isDone}>+</button>
      </div>

    </div>
  );
};

export default ItemFrame;