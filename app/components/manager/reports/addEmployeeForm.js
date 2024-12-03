import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import styles from './addEmployeeForm.module.css'; // Import your CSS for styling

/**
 * Add Employee Form Component
 *
 * @author Conner Black
 *
 * @description
 * A modal form component that allows for adding a new employee to the system.
 * Supports capturing essential employee details and submitting them to an API.
 *
 * @features
 * - Form Inputs: Collects employee details such as ID, name, birth date, phone number, hourly rate, and employment type (manager, part-time).
 * - Validation: Displays an error message if submission fails (e.g., due to invalid input).
 * - State Management: Manages form data and error messages using React hooks.
 * - Modal Interaction: Allows opening and closing the form modal through parent control.
 *
 * @state
 * - `newEmployee`: Holds the employee data to be submitted. Includes fields such as `employee_id`, `first_name`, `last_name`, `date_of_birth`, `phone_number`, `hourly_rate`, `is_manager`, and `is_parttime`.
 * - `errorMessage`: Stores the error message to be displayed in case of invalid data or submission failure.
 *
 * @methods
 * - `handleInputChange`: Handles changes to form input fields, updating the corresponding employee data.
 * - `handleSubmit`: Submits the employee data to the server, handles error response, and triggers parent callbacks (`onSubmit` and `onClose`).
 *
 * @formStructure
 * - Employee:
 *   - Fields: Employee ID, First Name, Last Name, Date of Birth, Phone Number, Hourly Rate, Manager (checkbox), Part-Time (checkbox).
 *
 * @dependencies
 * - Material-UI: For modal component and styling.
 *
 * @example
 * <AddEmployeeForm isOpen={true} onClose={() => {}} onSubmit={(employee) => {}} />
 */

const AddEmployeeForm = ({ isOpen, onClose, onSubmit }) => {
  const [newEmployee, setNewEmployee] = useState({
    employee_id: '',
    first_name: '',
    last_name: '',
    date_of_birth: '',
    phone_number: '',
    hourly_rate: '',
    is_manager: false,
    is_parttime: false,
  });

  const [errorMessage, setErrorMessage] = useState(''); // State to track the error message

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewEmployee((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Submit the form to create a new employee
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Reset the error message before each submission

    try {
      const response = await fetch('/api/add-employee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEmployee),
      });

      if (!response.ok) {
        // If the response is not OK, throw an error
        setErrorMessage('Bad input. Please check your data and try again.'); // Set the error message
        return; // Exit early without closing the modal or notifying the parent
      }

      const data = await response.json();
      onSubmit(data.employee); // Notify parent about new employee
      onClose(); // Close the modal after successful submission
    } catch (error) {
      console.error('Error adding new employee:', error);
      setErrorMessage('Bad input. Please check your data and try again.'); // Show a generic error message
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className={styles.modal}>
        <h3>Add New Employee</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Employee ID:
            <input
              type="text"
              name="employee_id"
              value={newEmployee.employee_id}
              onChange={handleInputChange}
            />
          </label>
          <label>
            First Name:
            <input
              type="text"
              name="first_name"
              value={newEmployee.first_name}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Last Name:
            <input
              type="text"
              name="last_name"
              value={newEmployee.last_name}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Date of Birth:
            <input
              type="date"
              name="date_of_birth"
              value={newEmployee.date_of_birth}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Phone Number:
            <input
              type="text"
              name="phone_number"
              value={newEmployee.phone_number}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Hourly Rate:
            <input
              type="number"
              name="hourly_rate"
              value={newEmployee.hourly_rate}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Is Manager:
            <input
              type="checkbox"
              name="is_manager"
              checked={newEmployee.is_manager}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Is Part-Time:
            <input
              type="checkbox"
              name="is_parttime"
              checked={newEmployee.is_parttime}
              onChange={handleInputChange}
            />
          </label>

          {errorMessage && <div className={styles.error}>{errorMessage}</div>} {/* Display error message */}

          <div className={styles.buttonContainer}>
            <button type="submit">Submit</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddEmployeeForm;