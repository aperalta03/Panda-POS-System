import React, { useState, useEffect } from 'react';
import { useGlobalState } from "./globalStateContext";
import Modal from '@mui/material/Modal';
import CustomerSignUp from './customerSignUpModal';  // Import the sign-up modal
import styles from './customerLoginModal.module.css';

const CustomerLogIn = ({ onClose, isOpen }) => {
    const {setCustomerPhoneNumber, setCustomerName, setCustomerTotalPoints} = useGlobalState();
    const [isSignUpModalOpen, setSignUpModalOpen] = useState(false);  // State to control the sign-up modal
    const [input, setInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isOpen) {
            setInput('');
            setError(null);
        }
    }, [isOpen]);

    const handleButtonClick = (value) => {
        setInput((prevInput) => prevInput + value);
    };

    const handleSubmit = async () => {
        if (!input) {
            setError('Please enter a phone number');
            return;
        }
        setIsSubmitting(true);  // Disable submit button while submitting
        setError(null);  // Reset error message

        try {
            // Call the customerLogin API
            const response = await fetch('/api/customerLogin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phoneNumber: input }),  // Send phone number in the body
            });

            const data = await response.json();

            if (response.ok) {
                const { phoneNumber, name, totalPoints } = data.customer;
                alert(`Login successful: ${data.message}`);
                setCustomerName(name);
                setCustomerPhoneNumber(phoneNumber);
                setCustomerTotalPoints(totalPoints);
                onClose();  // Close the modal on success
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (error) {
            setError('Error contacting the server');
            console.error('Error logging in:', error);
        } finally {
            setIsSubmitting(false);  // Enable submit button after submitting
        }
    };

    const handleSignUp = () => {
        setSignUpModalOpen(true);  // Open the sign-up modal when the button is clicked
    };

    return (
        <>
            <Modal open={isOpen} onClose={onClose}>
                <div className={styles.modal}>
                    <h2>Customer Log In</h2>
                    <div className={styles.keypad}>
                        <div className={styles['input-display']}>{input}</div>
                        <div className={styles['keypad-row']}>
                            <button className={styles.button} onClick={() => handleButtonClick('1')}>1</button>
                            <button className={styles.button} onClick={() => handleButtonClick('2')}>2</button>
                            <button className={styles.button} onClick={() => handleButtonClick('3')}>3</button>
                        </div>
                        <div className={styles['keypad-row']}>
                            <button className={styles.button} onClick={() => handleButtonClick('4')}>4</button>
                            <button className={styles.button} onClick={() => handleButtonClick('5')}>5</button>
                            <button className={styles.button} onClick={() => handleButtonClick('6')}>6</button>
                        </div>
                        <div className={styles['keypad-row']}>
                            <button className={styles.button} onClick={() => handleButtonClick('7')}>7</button>
                            <button className={styles.button} onClick={() => handleButtonClick('8')}>8</button>
                            <button className={styles.button} onClick={() => handleButtonClick('9')}>9</button>
                        </div>
                        <div className={styles['keypad-row']}>
                            <button className={styles.button} onClick={() => handleButtonClick('0')}>0</button>
                        </div>
                    </div>

                    <div className={styles['button-container']}>
                        <button className={styles['signup-btn']} onClick={handleSignUp}>Sign Up</button>
                        <button
                            className={styles['submit-btn']}
                            onClick={handleSubmit}
                            disabled={isSubmitting}  // Disable button while submitting
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>

                    {/* Display any error message */}
                    {error && <div className={styles.error}>{error}</div>}
                </div>
            </Modal>

            {/* Sign Up Modal */}
            <CustomerSignUp 
                isOpen={isSignUpModalOpen} 
                onClose={() => setSignUpModalOpen(false)}  // Close sign-up modal when done
            />
        </>
    );
};

export default CustomerLogIn;