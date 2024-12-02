import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import styles from './employeeIdModal.module.css';

/**
 * Employee ID Modal Component
 *
 * @author Conner Black
 *
 * @description
 * A modal that allows the user to input an employee ID. Upon submission, it attempts to fetch 
 * the employee's data from the server. If the employee is found, the parent component is notified 
 * with the employee's data, and the modal is closed. If not, an error message is displayed.
 *
 * @features
 * - Employee ID Input: Collects the employee ID from the user.
 * - API Request: Sends the employee ID to the server to fetch the corresponding employee data.
 * - Error Handling: Displays an error message if the employee is not found or if there is an issue with the request.
 * - Modal Interaction: Allows the modal to be opened and closed via parent component control.
 * - State Management: Tracks the input value for the employee ID and error messages.
 *
 * @state
 * - `employeeId`: Stores the input value for the employee ID entered by the user.
 * - `error`: Holds the error message to be displayed when the employee is not found or an error occurs during the API request.
 *
 * @methods
 * - `handleSubmit`: Triggers the API call to fetch the employee data based on the entered employee ID. Handles both success and failure scenarios.
 *
 * @dependencies
 * - Material-UI: For modal component and basic styling.
 *
 * @example
 * <EmployeeIdModal 
 *   isOpen={true} 
 *   onClose={() => {}} 
 *   onSubmit={(employeeData) => { console.log('Employee Data:', employeeData); }} 
 * />
 */

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