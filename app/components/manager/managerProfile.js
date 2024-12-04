import React from 'react';
import { useUser } from '../../context/userProvider'; 
import styles from './managerProfile.module.css';

/**
 * ManagerProfile
 * 
 * @description
 * A React functional component that displays the manager's profile information, 
 * including their name and a placeholder profile picture.
 *
 * @usage
 * This component is designed to be used in a manager's dashboard or profile page
 * to greet the user and display their basic information.
 *
 * @author Anson Thai
 *
 * @features
 * - **Manager Name Display**: Dynamically shows the logged-in manager's name.
 * - **Profile Picture Display**: Includes a placeholder profile picture, which can
 *   later be customized or replaced with a real image.
 *
 * @context
 * - **useUser**: 
 *   - A custom context hook imported from `../../context/userProvider`.
 *   - Provides access to `loggedInName`, representing the name of the currently logged-in user.
 *
 * @styles
 * - The component uses the following CSS classes from `managerProfile.module.css`:
 *   - `mainContainer`: Styles the main container for the profile component.
 *   - `managerName`: Styles the section displaying the manager's name.
 *   - `profilePicture`: Styles the placeholder profile picture.
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
 *       <ManagerProfile />
 *     </div>
 *   );
 * }
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