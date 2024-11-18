import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { Box, Button, TextField, Typography, Divider } from '@mui/material';
import styles from './oauth.module.css';
import Image from 'next/image';

const LoginOAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleCredentialResponse = (response) => {
    const id_token = response.credential;

    fetch('/api/oauth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'google', token: id_token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error('Login Error:', data.error);
          alert('Login failed: ' + data.error);
        } else {
          router.push('/landing');
        }
      })
      .catch((error) => {
        console.error('Login Error:', error);
        alert('An error occurred during login.');
      });
  };

  const handleEmailPasswordLogin = () => {
    fetch('/api/oauth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'login', email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error('Login Error:', data.error);
          alert('Login failed: ' + data.error);
        } else {
          router.push('/landing');
        }
      })
      .catch((error) => {
        console.error('Login Error:', error);
        alert('An error occurred during login.');
      });
  };

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (google && google.accounts && google.accounts.id) {
        google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        });
        google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          { theme: 'outline', size: 'large', width: '100%' }
        );
      }
    };

    if (window.google && window.google.accounts && window.google.accounts.id) {
      initializeGoogleSignIn();
    } else {
      window.addEventListener('google-loaded', initializeGoogleSignIn);
    }

    return () => {
      window.removeEventListener('google-loaded', initializeGoogleSignIn);
    };
  }, []);

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
            Log In
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
            <Button
              fullWidth
              variant="contained"
              className={styles.emailButton}
              onClick={handleEmailPasswordLogin}
            >
              Log in
            </Button>
            <Typography className={styles.link} onClick={() => alert('Forgot Password')}>
              Forgot your password?
            </Typography>
            <Divider className={styles.divider}>OR</Divider>
            <Box id="google-signin-button" className={styles.googleButton}></Box>
          </Box>
          <Typography className={styles.footer}>
            Don’t have an account?{' '}
            <span className={styles.link} onClick={() => router.push('/signup-oauth')}>
              Sign up
            </span>
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default LoginOAuth;