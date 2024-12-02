import { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, TextField, Button, Typography } from '@mui/material';
import styles from './oauth.module.css';
import Image from 'next/image';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();
  const { token } = router.query;

  const handleResetPassword = () => {
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    fetch('/api/oauth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reset-password', token, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert('Password reset failed.');
        } else {
          alert('Password reset successfully!');
          router.push('/login-oauth');
        }
      });
  };

  return (
    <Box className={styles.container}>
        <Image src="/chickenmaxxing_logo.png" alt="Logo" width={100} height={100} className={styles.logo} />
        <Image src="/panda_express.png" alt="Logo" width={100} height={100} className={styles.pandalogo} />
        <div className={styles.upBlob}></div>
        <div className={styles.downBlob}></div>
        <div className={styles.centerBlob}></div>
        <Box className={styles.card}>
            <Typography variant="h4" className={styles.title}>Reset Password</Typography>
            <TextField
                label="New Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                className={styles.input}
            />
            <TextField
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                className={styles.input}
            />
            <Button onClick={handleResetPassword} variant="contained" className={styles.emailButton}>
                Reset Password
            </Button>
        </Box>
    </Box>
  );
};

export default ResetPassword;