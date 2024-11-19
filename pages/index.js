import React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './index.module.css';

const Loading = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/login-oauth');
  }, [router]);

  return (
    <div className={styles.container} height={'100vh'} width={'100%'}>
      <h1>Loading...</h1>
    </div> 
  );
};

export default Loading;