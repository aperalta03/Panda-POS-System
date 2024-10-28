import React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './index.module.css';

const Loading = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, [router]);

  return (
    <div className={styles.container} maxWidth={false}>
      <h1 className={styles.title}></h1>
    </div> 
  );
};

export default Loading;