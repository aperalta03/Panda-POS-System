import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Switch from '@mui/material/Switch';
import styles from './editEmployeeModal.module.css'; // Import the CSS file

/**
 * @description
 * A modal form component for editing an existing employee's details. 
 * It pre-fills the form with the current employee data and allows for modifications.
 * Once the form is submitted, the updated employee information is sent to the server.
 * 
 * @author Conner Black
 *
 * @param {object} props - The properties passed to the component.
 * @param {boolean} props.isOpen - Controls whether the modal is visible.
 * @param {function} props.onClose - Callback function to close the modal.
 * @param {object} props.employeeData - The current employee data to pre-fill the form.
 * @param {function} props.onSave - Callback function to save the updated employee data.
 *
 * @returns {React.ReactElement} The rendered EditEmployeeModal component.
 *
 * @example
 * <EditEmployeeModal 
 *   isOpen={true} 
 *   onClose={() => {}} 
 *   employeeData={{ first_name: 'John', last_name: 'Doe', phone_number: '1234567890', hourly_rate: 20, is_manager: true, is_part_time: false, employee_id: '123' }} 
 *   onSave={(updatedData) => { console.log('Updated Employee:', updatedData); }} 
 * />
 *
 * @module editEmployeeModal
 */

const EditEmployeeModal = ({ isOpen, onClose, employeeData, onSave }) => {
  const [updatedEmployeeData, setUpdatedEmployeeData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    hourly_rate: '',
    is_manager: false,
    is_part_time: false,
    employee_id: ''
  });

  useEffect(() => {
    if (isOpen && employeeData) {
      // If employeeData exists, update the state with that data
      setUpdatedEmployeeData({
        first_name: employeeData.first_name || '',
        last_name: employeeData.last_name || '',
        phone_number: employeeData.phone_number || '',
        hourly_rate: employeeData.hourly_rate || '',
        is_manager: employeeData.is_manager || false,
        is_part_time: employeeData.is_part_time || false,
        employee_id: employeeData.employee_id || ''
      });
    }
  }, [isOpen, employeeData]);

  // Handle input change to update state
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUpdatedEmployeeData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value, // Update based on the input type
    }));
  };

  // This function will be triggered when the submit button is clicked
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior (page reload)

    // Ensure that blank fields retain the current values from employeeData if available
    const dataToSubmit = {
      ...updatedEmployeeData,
      first_name: updatedEmployeeData.first_name || employeeData?.first_name, // Use updated value or fallback to employeeData
      last_name: updatedEmployeeData.last_name || employeeData?.last_name,
      phone_number: updatedEmployeeData.phone_number || employeeData?.phone_number,
      hourly_rate: updatedEmployeeData.hourly_rate || employeeData?.hourly_rate,
      is_manager: updatedEmployeeData.is_manager !== undefined ? updatedEmployeeData.is_manager : employeeData?.is_manager,
      is_part_time: updatedEmployeeData.is_part_time !== undefined ? updatedEmployeeData.is_part_time : employeeData?.is_part_time,
    };

    handleSave(dataToSubmit); // Call the function to save the data with the current or updated values
  };

  // This is where the actual API call happens
  const handleSave = async (dataToSubmit) => {
    if (!dataToSubmit.employee_id) {
      console.error('Employee ID is required');
      return;
    }

    try {
      const response = await fetch('/api/update-employee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit), // Send the updated employee data in the request body
      });

      if (!response.ok) {
        throw new Error('Failed to update employee');
      }

      const data = await response.json(); // Get the response data
      console.log('Employee updated successfully:', data);

      onSave(dataToSubmit); // Call the onSave callback with the updated data
      onClose(); // Close the modal
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className={styles.modalBox}>
        <h2>Edit Employee</h2>
        <form onSubmit={handleSubmit}> {/* form submits on pressing "Save" */}
          <div className={styles.field}>
            <label>First Name: </label>
            <input
              type="text"
              name="first_name"
              value={updatedEmployeeData.first_name}
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label>Last Name: </label>
            <input
              type="text"
              name="last_name"
              value={updatedEmployeeData.last_name}
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label>Phone Number: </label>
            <input
              type="text"
              name="phone_number"
              value={updatedEmployeeData.phone_number}
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label>Hourly Rate: </label>
            <input
              type="number"
              name="hourly_rate"
              value={updatedEmployeeData.hourly_rate}
              onChange={handleChange}
            />
          </div>

          <div className={styles['switch-container']}>
          <label>
            Is Manager?
            <Switch
              name="is_manager"
              checked={updatedEmployeeData.is_manager}
              onChange={handleChange} // Handle the switch toggle
            />
          </label>
        </div>

        <div className={styles['switch-container']}>
          <label>
            Is Part-Time?
            <Switch
              name="is_part_time"
              checked={updatedEmployeeData.is_part_time}
              onChange={handleChange} // Handle the switch toggle
            />
          </label>
        </div>

          <button type="submit">Save</button> {/* Only triggers API call when clicked */}
        </form>
      </div>
    </Modal>
  );
};

export default EditEmployeeModal;