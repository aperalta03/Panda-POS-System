// src/components/Navbar.js
import React, { useEffect, useState } from 'react';

const Navbar = ({ title }) => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={navbarStyle}>
      <button onClick={() => alert("Switch to Employee View")}>Switch View</button>
      <h1>{title}</h1>
      <span>{time}</span>
    </div>
  );
};

const navbarStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px',
  background: '#FF001C',
  color: 'white',
};

export default Navbar;