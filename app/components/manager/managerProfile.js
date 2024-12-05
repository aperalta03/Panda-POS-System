import React from 'react';
import { useUser } from '../../context/userProvider'; 
import styles from './managerProfile.module.css';

/**
 * @description
 * A React functional component that displays the manager's profile information, 
 * including their name and a placeholder profile picture.
 *
 * @author Anson Thai
 *
 * @param {object} props - The properties passed to the component.
 * @param {string} props.loggedInName - The logged-in manager's name.
 *
 * @returns {React.ReactElement} A React functional component that displays the manager's name and profile picture.
 *
 * @example
 * // Usage example
 * import ManagerProfile from './managerProfile';
 *
 * function Dashboard() {
 *   return (
 *     <div>
 *       <ManagerProfile loggedInName="John Doe" />
 *     </div>
 *   );
 * }
 *
 *
 * @module managerProfile
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