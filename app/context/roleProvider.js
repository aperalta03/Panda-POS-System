import React, { createContext, useContext, useState, useEffect } from "react";

const RoleContext = createContext();

/**
 * @classdesc Provides the role context for managing user roles (e.g., manager, cashier) across the application.
 * 
 * @author Alonso Peralta Espinoza
 * 
 * @description This component stores and updates the user's role in state and localStorage.
 * It automatically loads the saved role from localStorage on component mount and provides
 * a context for accessing and updating the user's role throughout the app.
 * 
 * @property {string|null} role - Tracks the current user's role (e.g., "manager", "cashier").
 * 
 * @function
 * @name updateRole
 * @description Updates the user's role in state and saves it to localStorage.
 * 
 * @example
 * // Wrapping the application with RoleProvider
 * <RoleProvider>
 *   <App />
 * </RoleProvider>
 *
 * // Using the context in a component
 * const { role, setRole } = useRole();
 * setRole("manager");
 */

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Load role from localStorage if it exists
    const savedRole = localStorage.getItem("role");
    if (savedRole) setRole(savedRole);
  }, []);

  const updateRole = (newRole) => {
    setRole(newRole);
    localStorage.setItem("role", newRole);
  };

  return (
    <RoleContext.Provider value={{ role, setRole: updateRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
