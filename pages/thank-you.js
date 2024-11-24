import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from './thank-you.module.css';
import JSConfetti from 'js-confetti';

const ThankYouPage = () => {
    const router = useRouter();

    useEffect(() => {
        // Initialize the JSConfetti instance
        const jsConfetti = new JSConfetti();

        // Trigger confetti rain for a certain duration
        const confettiRainDuration = 2000; // 5 seconds
        const confettiInterval = 500; // Interval between bursts (ms)

        const confettiTimer = setInterval(() => {
            jsConfetti.addConfetti({
                emojis: ['🥠'], // Optional emojis
                confettiRadius: 1,
                confettiNumber: 30
            });
        }, confettiInterval);

        // Stop the confetti rain after the duration
        setTimeout(() => {
            clearInterval(confettiTimer);
        }, confettiRainDuration);

        // Add click-to-navigate functionality
        const handleClick = () => {
            router.push('/kiosk');
        };
        window.addEventListener('click', handleClick);

        return () => {
            window.removeEventListener('click', handleClick);
        };
    }, [router]);

    return (
        <div className={styles.Container}>
            <h1>Thank you for your order!</h1>
            <div className={styles.CookieWrapper}>
                <Image width={100} height={100} src="/fortune_cookie.png" alt="Fortune Cookie" className={styles.CookieImage} />
                <div className={styles.FortuneMessage}>
                    "Your AI-generated fortune: Great things are coming your way!"
                </div>
            </div>
        </div>
    );
};

export default ThankYouPage;