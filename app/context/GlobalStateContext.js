import React, { createContext, useState, useContext, useEffect } from 'react';

const GlobalStateContext = createContext();

//setting global vars
export const GlobalStateProvider = ({ children }) => {
  const [numTrackedSides, setNumTrackedSides] = useState(0);
  const [numTrackedEntrees, setNumTrackedEntrees] = useState(0);
  const [totalItemCount, setTotalItemCount] = useState(0);
  const [priceMap, setPriceMap] = useState({});
  const [menu, setMenu] = useState([]);

  const updateTotalItemCount = () => {
    setTotalItemCount(numTrackedSides + numTrackedEntrees);
  };

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('/api/menu-get-item-price');
      const data = await response.json();
      
      if (response.ok && data.menuItems) {
        const items = data.menuItems;
        setMenu(items);

        const priceMapData = items.reduce((map, item) => {
          map[item.name] = item.price;
          return map;
        }, {});

        setPriceMap(priceMapData);
      }
      else {
        console.error('Error fetching menu items:', data.error);
      }
    }
    catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  return (
    <GlobalStateContext.Provider
      value={{ 
        numTrackedSides, 
        setNumTrackedSides, 
        numTrackedEntrees, 
        setNumTrackedEntrees, 
        totalItemCount, 
        setTotalItemCount,
        updateTotalItemCount,
        priceMap,
        menu,
        setPriceMap,
        setMenu, 
      }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

// Custom hook for easier access to the context
export const useGlobalState = () => useContext(GlobalStateContext);
