import React from 'react';
import { useUser } from '../../../app/context/currentUser'; 
import styles from './managerProfile.module.css';

const ManagerProfile = () => {
    const { loggedInName } = useUser();

    return (
        <div className={styles.mainContainer}>
            <div className={styles.managerName}>
                <h2>Welcome - {loggedInName}</h2>
            </div>
            <img className={styles.profilePicture} src='blank-profile-picture.webp' />
        </div>
    );
};

export default ManagerProfile;