import { useState } from 'react';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { Box, Button, TextField, Typography, Divider } from '@mui/material';
import styles from './oauth.module.css';
import Image from 'next/image';

const SignOAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleGoogleSignUp = (response) => {
    const id_token = response.credential;

    fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({action: 'google', token: id_token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error('Signup Error:', data.error);
          alert('Signup failed: ' + data.error);
        } else {
          router.push('/landing');
        }
      })
      .catch((error) => {
        console.error('Signup Error:', error);
        alert('An error occurred during signup.');
      });
  };

  const handleEmailPasswordSignUp = () => {
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'signup', email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error('Signup Error:', data.error);
          alert('Signup failed: ' + data.error);
        } else {
          router.push('/dashboard');
        }
      })
      .catch((error) => {
        console.error('Signup Error:', error);
        alert('An error occurred during signup.');
      });
  };

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => {
          const event = new Event('google-loaded');
          window.dispatchEvent(event);
        }}
      />
      <Box className={styles.container}>
        {/* Blobs */}
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
    </>
  );
};

export default SignOAuth;
