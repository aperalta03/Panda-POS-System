import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useRole } from '../app/context/roleProvider';
import { useUser } from '../app/context/currentUser';  // Import useUser to access context
import styles from './login.module.css';

const Login = () => {
    const router = useRouter();
    const { setRole } = useRole();
    const { setLoggedInName } = useUser();  // Destructure setLoggedInName from context
    const [input, setInput] = useState("");
    const [employeeMap, setEmployeeMap] = useState({});

    const fetchEmployees = async () => {
        try {
            const response = await fetch('/api/login-info');
            if (response.ok) {
                const data = await response.json();
                const employeeMap = {};

                data.data.forEach((employee) => {
                    employeeMap[employee.employeeID] = {
                        isManager: employee.isManager,
                        name: employee.name,
                    };
                });

                setEmployeeMap(employeeMap);
            } else {
                console.error('Failed to fetch employee data');
            }
        } catch (error) {
            console.error('Error fetching employee data:', error);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

  const handleButtonClick = (num) => {
    setInput((prev) => prev + num);
  };

  const handleBackspace = () => {
    setInput((prev) => prev.slice(0, -1));
  };

    const handleLogin = () => {
        if (!employeeMap[input]) {
            alert("Invalid Code");
            setInput("");
        } else {
            const employee = employeeMap[input];

            // Set logged-in name in context
            setLoggedInName(employee.name);  // Set the name in context

            if (employee.isManager) {
                setRole("manager");
            } else {
                setRole("cashier");
            }

            setInput(""); // Clear the input field after a successful login
            router.push('/cashier');
        }
    };

    return (
        <div className={styles.mainContainer}>
            <div className={styles.leftContainer}>
                <h1>Enter Code</h1>
                <div className={styles.numpad}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0].map((num, index) => (
                        <button 
                            key={index} 
                            onClick={() => num !== "" && handleButtonClick(num)} 
                            disabled={num === ""}
                            className={styles.numpadButton}
                        >
                            {num}
                        </button>
                    ))}
                    <button onClick={handleBackspace} className={styles.backspaceButton}>
                        ⌫
                    </button>
                </div>
                <button className={styles.loginButton} onClick={handleLogin}>Login</button>
                <div className={styles.inputDisplay}>Current Input: {input}</div>
            </div>
            <div className={styles.rightContainer}>
                <button className={styles.navButton} onClick={() => {setRole("cashier"); router.push('/menu')}}>
                    Menu Board
                </button>
                <button className={styles.navButton} onClick={() => {setRole("cashier"); router.push('/kitchen')}}>
                    Kitchen View
                </button>
                <button className={styles.navButton} onClick={() => {setRole("cashier"); router.push('/kiosk')}}>
                    Kiosk View
                </button>
            </div>
        </div>
    );
};

export default Login;
