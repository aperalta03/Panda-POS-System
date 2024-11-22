import React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './index.module.css';
import { Box, Typography } from '@mui/material';

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