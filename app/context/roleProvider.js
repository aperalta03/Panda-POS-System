import React, { createContext, useContext, useState, useEffect } from "react";

const RoleContext = createContext();

/**
 * RoleProvider Component
 * 
 * @author Alonso Peralta Espinoza
 *
 * @description
 * Provides the role context for managing user roles (e.g., manager, cashier) across the application.
 *
 * @features
 * - Stores and updates the user's role in state and localStorage.
 * - Automatically loads the saved role from localStorage on component mount.
 * - Provides a context for accessing and updating the user's role throughout the app.
 *
 * @state
 * - `role`: Tracks the current user's role (e.g., "manager", "cashier").
 *
 * @methods
 * - `updateRole`: Updates the user's role in state and saves it to localStorage.
 *
 * @context
 * - Provides `{ role, setRole }` to all child components.
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
