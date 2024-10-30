import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useRole } from '../app/context/roleProvider';
import styles from './login.module.css';

const Login = () => {
    const router = useRouter();
    const { setRole } = useRole();
    const [input, setInput] = useState("");

    const handleButtonClick = (num) => {
        setInput((prev) => prev + num);
    };

    const handleLogin = () => {
        if (input === "01") {
            setRole("manager");
            router.push('/cashier');
        } else if (input === "02") {
            setRole("cashier");
            router.push('/cashier');
        } else {
            alert("Invalid Code");
        }
        setInput(""); // Reset input after login attempt
    };

    return (
        <div className={styles.mainContainer}>
            <h1>Enter Code</h1>
            <div className={styles.numpad}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0].map((num, index) => (
                    <button 
                        key={index} 
                        onClick={() => num !== "" && handleButtonClick(num)} 
                        disabled={num === ""}
                    >
                        {num}
                    </button>
                ))}
            </div>
            <button onClick={handleLogin}>Login</button>
            <div>Current Input: {input}</div>
        </div>
    );
};

export default Login;