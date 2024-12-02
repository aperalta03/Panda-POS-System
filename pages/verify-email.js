import { useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './verify-email.module.css';
import Image from 'next/image';
import { Box, Typography } from '@mui/material';


/**
 * VerifyEmail Component
 * 
 * @author Alonso Peralta Espinoza
 *
 * @description
 * Handles email verification using a token passed as a query parameter.
 *
 * @features
 * - Sends the token to the server for verification.
 * - Displays success or failure messages based on the server response.
 * - Redirects to the login page upon successful verification.
 *
 * @api
 * - `/api/oauth` (POST): Action `verify-email`: Verifies the email using the provided token.
 *
 * @returns {React.ReactElement} A React functional component.
 */

const VerifyEmail = () => {
  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    if (token) {
      fetch('/api/oauth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify-email', token }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            alert('Email verification failed.');
          } else {
            alert('Email verified successfully!');
            router.push('/login-oauth');
          }
        });
    }
  }, [token]);

  return (
    <Box className={styles.container}>
        <div className={styles.leftBlob}></div>
        <div className={styles.rightBlob}></div>
        <Typography className={styles.title}>Verifying your email...</Typography>
    </Box>
    
  );
};

export default VerifyEmail;