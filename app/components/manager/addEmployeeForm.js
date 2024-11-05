import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import styles from './addEmployeeForm.module.css'; // Import your CSS for styling

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

    try {
      const response = await fetch('/api/add-employee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEmployee),
      });

      if (!response.ok) {
        throw new Error('Failed to add new employee');
      }

      const data = await response.json();
      onSubmit(data.employee); // Notify parent about new employee
      onClose(); // Close the modal after successful submission
    } catch (error) {
      console.error('Error adding new employee:', error);
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