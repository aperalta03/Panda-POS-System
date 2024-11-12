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
