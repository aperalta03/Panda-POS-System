import React, { createContext, useContext, useState, useEffect } from "react";


/**
 * @file UserProvider.js
 * @description Provides the user context for managing user information across the application.
 *
 * @author Uzair Khan, Brandon Batac
 *
 * @description This component stores and updates the user's information in state and
 * localStorage. It automatically loads the saved user information from localStorage
 * on component mount and provides a context for accessing and updating the user's
 * information throughout the app.
 *
 * @property {string} loggedInName - Tracks the user's name.
 * @property {string} loggedInEmail - Tracks the user's email.
 * @property {boolean} isLoggedIn - Tracks whether the user is logged in or not.
 *
 * @example
 * // Wrapping the application with UserProvider
 * <UserProvider>
 *   <App />
 * </UserProvider>
 *
 * // Using the context in a component
 * const { loggedInName, loggedInEmail, isLoggedIn } = useUser();
 */

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

