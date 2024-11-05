import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
const UserContext = createContext();

// Create a custom hook to use the context
export const useUser = () => {
  return useContext(UserContext);
};

// Create a provider component
export const UserProvider = ({ children }) => {
  const [loggedInName, setLoggedInName] = useState("");

  // You can load the loggedInName from localStorage or sessionStorage on initial load
  useEffect(() => {
    const storedName = localStorage.getItem('loggedInName');
    if (storedName) {
      setLoggedInName(storedName);
    }
  }, []);

  return (
    <UserContext.Provider value={{ loggedInName, setLoggedInName }}>
      {children}
    </UserContext.Provider>
  );
};