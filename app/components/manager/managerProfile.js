import React, { useState } from 'react';
import styles from './managerProfile.module.css';

const ManagerProfile = () => {
    return (
    <div className={styles.mainContainer}>
        <div className={styles.managerName}>
          <h2>Welcome Manager Name</h2>
        </div>
        <img className={styles.profilePicture} src='blank-profile-picture.webp'/>
    </div>
  );
};

export default ManagerProfile;