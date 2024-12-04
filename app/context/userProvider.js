import React, { createContext, useContext, useState, useEffect } from "react";

// Create context
const UserContext = createContext();

// Custom hook to access UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// Provider component
export const UserProvider = ({ children }) => {
  const [loggedInName, setLoggedInName] = useState("");
  const [employeeID, setEmployeeID] = useState(null);

  // Load initial values from localStorage
  useEffect(() => {
    const storedName = localStorage.getItem("loggedInName");
    const storedEmployeeID = localStorage.getItem("employeeID");
    if (storedName) setLoggedInName(storedName);
    if (storedEmployeeID) setEmployeeID(storedEmployeeID);
  }, []);

  // Sync changes to localStorage
  useEffect(() => {
    if (loggedInName) localStorage.setItem("loggedInName", loggedInName);
  }, [loggedInName]);

  useEffect(() => {
    if (employeeID) localStorage.setItem("employeeID", employeeID);
  }, [employeeID]);

  return (
    <UserContext.Provider
      value={{ loggedInName, setLoggedInName, employeeID, setEmployeeID }}
    >
      {children}
    </UserContext.Provider>
  );
};
