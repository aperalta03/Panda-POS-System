import React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './index.module.css';
import { Box, Typography } from '@mui/material';

/**
 * Loading Component
 * 
 * @author Alonso Peralta Espinoza
 *
 * @description
 * Displays a loading screen while redirecting the user to the login page.
 *
 * @features
 * - Redirects to `/login-oauth` on mount.
 * - Shows animated visual elements and a "Loading..." message.
 *
 * @returns {React.ReactElement} A React functional component.
 */

const Loading = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/login-oauth');
  }, [router]);

  return (
    <Box className={styles.container}>
      <div className={styles.leftBlob}></div>
      <div className={styles.rightBlob}></div>
      <Typography variant="h4" className={styles.title}>Loading...</Typography>
    </Box>
    
  );
};

export default Loading;