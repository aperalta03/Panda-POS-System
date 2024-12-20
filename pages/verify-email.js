import { useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './verify-email.module.css';
import Image from 'next/image';
import { Box, Typography } from '@mui/material';

import Head from "next/head"; // Import Head for managing the document head

/**
 * @description
 * Handles email verification using a token passed as a query parameter.
 * 
 * @author Alonso Peralta Espinoza
 *
 * @param {object} props - The properties passed to the component.
 *
 * @returns {React.ReactElement} A React functional component.
 *
 * @example
 * <VerifyEmail />
 *
 * @module verify-email
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
    <>
    <Head>
      {/* Add or update the page title */}
      <title>Verfication Page</title>
      {/* Add other metadata if needed */}
      <meta name="description" content="Verify your email here" />
    </Head>
    <Box className={styles.container}>
        <div className={styles.leftBlob}></div>
        <div className={styles.rightBlob}></div>
        <Typography className={styles.title}>Verifying your email...</Typography>
    </Box>
    </>
  );
};

export default VerifyEmail;