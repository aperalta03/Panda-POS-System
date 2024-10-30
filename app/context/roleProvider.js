import React, { createContext, useContext, useState, useEffect } from 'react';

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
    const [role, setRole] = useState(null);

    useEffect(() => {
        // Load role from localStorage if it exists
        const savedRole = localStorage.getItem('role');
        if (savedRole) setRole(savedRole);
    }, []);

    const updateRole = (newRole) => {
        setRole(newRole);
        localStorage.setItem('role', newRole); // Save role to localStorage
    };

    return (
        <RoleContext.Provider value={{ role, setRole: updateRole }}>
            {children}
        </RoleContext.Provider>
    );
};

export const useRole = () => useContext(RoleContext);