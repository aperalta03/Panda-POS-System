import React from 'react';
import { useUser } from '../../../app/context/currentUser'; // Import the custom hook
import styles from './managerProfile.module.css';

const ManagerProfile = () => {
    const { loggedInName } = useUser(); // Access loggedInName from context

    return (
        <div className={styles.mainContainer}>
            <div className={styles.managerName}>
                <h2>Welcome {loggedInName}</h2>
            </div>
            <img className={styles.profilePicture} src='blank-profile-picture.webp' />
        </div>
    );
};

export default ManagerProfile;