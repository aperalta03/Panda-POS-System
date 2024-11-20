import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import styles from './employeeIdModal.module.css';

const EmployeeIdModal = ({ isOpen, onClose, onSubmit }) => {
  const [employeeId, setEmployeeId] = useState('');
  const [error, setError] = useState('');

  // Reset the employeeId when the modal is closed
  useEffect(() => {
    if (!isOpen) {
      setEmployeeId('');  // Clear the input field when the modal is closed
      setError('');  // Optionally clear the error message as well
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    setError(''); // Reset error state on new submission
    try {
      const response = await fetch('/api/get-employee-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employeeId }),  // Send employeeId in the body
      });

      const data = await response.json();
      console.log("API Response:", data); // Log the response to see what data is returned

      if (response.ok && data.data) { // Check if the response is successful
        // Pass employee data to the parent to open the Edit Employee modal
        onSubmit(data.data);
        onClose();  // Close the EmployeeIdModal
      } else {
        // If employee does not exist, show error message
        setError('Employee not found. Please check the ID and try again.');
      }
    } catch (error) {
      console.error('Error fetching employee:', error);
      setError('An error occurred while fetching the employee. Please try again.');
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className={styles.modalBox}>
        <h2>Enter Employee ID</h2>
        <input
          type="text"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          placeholder="Enter Employee ID"
          className={styles.input}
        />
        {error && <p className={styles.errorText}>{error}</p>}
        <button onClick={handleSubmit} className={styles.submitButton}>
          Submit
        </button>
        <button onClick={onClose} className={styles.closeButton}>
          Close
        </button>
      </div>
    </Modal>
  );
};

export default EmployeeIdModal;