import React from 'react';
import { useRouter } from 'next/router';
import styles from './login.module.css';

const Login = () => {
    const router = useRouter();

    const CashierRoute = () => { router.push('/cashier'); }
    const ManagerRoute = () => { router.push('./manager'); }


    return (
        <div className={styles.mainContainer}>
            <h1>Choose Page</h1>
            <button onClick={CashierRoute}>
                Cashier View
            </button> 
            <button onClick={ManagerRoute}>
                Manager View
            </button>
        </div>
    )
}

export default Login