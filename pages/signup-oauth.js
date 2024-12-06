import { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, TextField, Typography } from '@mui/material';
import styles from './oauth.module.css';
import Image from 'next/image';

/**
 * @description
 * Sign-up page for users, allowing them to register using an employee ID, email, and password.
 * 
 * @author Alonso Peralta Espinoza
 *
 * @param {object} props - The properties passed to the component.
 *
 * @returns {React.ReactElement} A React functional component.
 *
 * @example
 * <SignOAuth />
 *
 * @module signup-oauth
 */

const SignOAuth = () => {
  const [employee_id, setEmployeeId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleEmailPasswordSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    fetch('/api/oauth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'signup', employee_id, email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error('Signup Error:', data.error);
          alert('Signup failed: ' + data.error);
        } else {
          router.push('/login-oauth');
        }
      })
      .catch((error) => {
        console.error('Signup Error:', error);
        alert('An error occurred during signup.');
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
        <Typography variant="h4" className={styles.title}>
          Sign Up
        </Typography>
        <Box className={styles.form}>
          <TextField
            fullWidth
            label="Employee ID"
            variant="outlined"
            value={employee_id}
            onChange={(e) => setEmployeeId(e.target.value)}
            className={styles.input}
          />
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={styles.input}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleEmailPasswordSignUp(e);
              }
            }}
          />
          <Button
            fullWidth
            variant="contained"
            className={styles.emailButton}
            onClick={handleEmailPasswordSignUp}
          >
            Sign Up
          </Button>
        </Box>
        <Typography className={styles.footer}>
          Already have an account?{' '}
          <span className={styles.link} onClick={() => router.push('/login-oauth')}>
            Log in
          </span>
        </Typography>
      </Box>
    </Box>
  );
};

export default SignOAuth;