import React from 'react';
import { useUser } from '../../context/userProvider'; 
import styles from './managerProfile.module.css';

/**
 * ManagerProfile Component
 * 
 * @author Anson Thai
 *
 * @description
 * A component for displaying the manager's profile information.
 *
 * @features
 * - Displays the manager's name.
 * - Displays the manager's profile picture.
 *
 * @returns {React.ReactElement} A React functional component.
 */
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