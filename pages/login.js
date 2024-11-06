import React, { useState } from "react";
import { useRouter } from "next/router";
import { useRole } from "../app/context/roleProvider";
import styles from "./login.module.css";

const Login = () => {
  const router = useRouter();
  const { setRole } = useRole();
  const [input, setInput] = useState("");

  const handleButtonClick = (num) => {
    setInput((prev) => prev + num);
  };

  const handleBackspace = () => {
    setInput((prev) => prev.slice(0, -1));
  };

  const handleLogin = () => {
    if (input === "01") {
      setRole("manager");
      localStorage.setItem("employeeID", input); // Save employeeID
      router.push("/cashier");
    } else if (input === "02") {
      setRole("cashier");
      localStorage.setItem("employeeID", input); // Save employeeID
      router.push("/cashier");
    } else {
      alert("Invalid Code");
    }
    setInput("");
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
        <button className={styles.loginButton} onClick={handleLogin}>
          Login
        </button>
        <div className={styles.inputDisplay}>Current Input: {input}</div>
      </div>
      <div className={styles.rightContainer}>
        <button
          className={styles.navButton}
          onClick={() => {
            setRole("cashier");
            router.push("/menu");
          }}
        >
          Menu Board
        </button>
        <button
          className={styles.navButton}
          onClick={() => {
            setRole("cashier");
            router.push("/kitchen");
          }}
        >
          Kitchen View
        </button>
        <button
          className={styles.navButton}
          onClick={() => {
            setRole("cashier");
            router.push("/kiosk");
          }}
        >
          Kiosk View
        </button>
      </div>
    </div>
  );
};

export default Login;
