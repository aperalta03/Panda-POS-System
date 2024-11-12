import React from 'react';
import { useGlobalState } from '../app/context/GlobalStateContext';
import styles from './itemFrame.module.css';

const ItemFrame = ({ item }) => {
  const { 
    menu, 
    setMenu, 
    numTrackedSides, 
    setNumTrackedSides, 
    numTrackedEntrees, 
    setNumTrackedEntrees 
  } = useGlobalState();

  const handleIncrement = () => {
    const updatedMenu = menu.map((menuItem) => {
      if (menuItem.name === item.name) {
        // Increment item count based on item type
        const incrementAmount = item.type === 'side' ? 0.5 : 1;
        const updatedItem = { ...menuItem, count: menuItem.count + incrementAmount };

        // Update total tracked counts
        if (item.type === 'side') {
          setNumTrackedSides(numTrackedSides + 0.5);
        } else if (item.type === 'entree') {
          setNumTrackedEntrees(numTrackedEntrees + 1);
        }

        return updatedItem;
      }
      return menuItem;
    });
    setMenu(updatedMenu);
  };

  const handleDecrement = () => {
    const updatedMenu = menu.map((menuItem) => {
      if (menuItem.name === item.name && menuItem.count > 0) {
        // Decrement item count based on item type
        const decrementAmount = item.type === 'side' ? 0.5 : 1;
        const updatedItem = { ...menuItem, count: menuItem.count - decrementAmount };

        // Update total tracked counts
        if (item.type === 'side' && numTrackedSides > 0) {
          setNumTrackedSides(numTrackedSides - 0.5);
        } else if (item.type === 'entree' && numTrackedEntrees > 0) {
          setNumTrackedEntrees(numTrackedEntrees - 1);
        }

        return updatedItem;
      }
      return menuItem;
    });
    setMenu(updatedMenu);
  };

  return (
    <div className={styles.itemFrame}>
      <h3>{item.name}</h3>
      <p>Price: ${item.price}</p>
      <div className={styles.counterContainer}>
        <button onClick={handleDecrement}>-</button>
        <span>{item.count}</span>
        <button onClick={handleIncrement}>+</button>
      </div>
    </div>
  );
};

export default ItemFrame;
