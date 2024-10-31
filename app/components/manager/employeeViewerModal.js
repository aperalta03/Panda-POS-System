import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import styles from './employeeViewerModal.module.css';

const EmployeeViewerModal = ({ isOpen, onClose }) => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('/api/employee-viewer');
        if (!response.ok) {
          throw new Error('Failed to fetch employee data');
        }
        const data = await response.json();
        setEmployees(data.data || []);
      } catch (error) {
        console.error('Error fetching employee data:', error);
        setError('Failed to load employee data. Please try again.');
      }
    };

    if (isOpen) {
      fetchEmployees();
    }
  }, [isOpen]);

  // Function to toggle the is_active status in the database
  const toggleActiveStatus = async (employeeId, currentStatus) => {
    try {
      const response = await fetch('/api/toggle-employee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employeeId, isActive: !currentStatus }),
      });
      if (!response.ok) {
        throw new Error('Failed to update employee status');
      }
      // Update the local state to reflect the change
      setEmployees((prevEmployees) =>
        prevEmployees.map((employee) =>
          employee.employee_id === employeeId
            ? { ...employee, active: !currentStatus }
            : employee
        )
      );
    } catch (error) {
      console.error('Error updating employee status:', error);
      setError('Failed to update employee status. Please try again.');
    }
  };

  // Helper function to check if an employee is 18 or older
  const isEighteenOrOlder = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className={styles.modalBox}>
        <h2>Employee Viewer</h2>
        
        {error && <p className={styles.errorText}>{error}</p>}
        
        <div className={styles.employeeTableContainer}>
          <table className={styles.employeeTable}>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>ID</th>
                <th>Phone Number</th>
                <th>Hourly Rate</th>
                <th>18+</th>
                <th>PT</th>
                <th>Date of Birth</th>
                <th>Active</th>
                <th>Switch</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.employee_id}>
                  <td className={employee.is_manager ? styles.managerName : ''}>{employee.first_name}</td>
                  <td className={employee.is_manager ? styles.managerName : ''}>{employee.last_name}</td>
                  <td>{employee.employee_id}</td>
                  <td>{employee.phone_number}</td>
                  <td>${employee.hourly_rate.toFixed(2)}</td>
                  <td>{isEighteenOrOlder(employee.date_of_birth) >= 18 ? '✔️' : ''}</td>
                  <td>{employee.pt ? '✔️' : ''}</td>
                  <td>{new Date(employee.date_of_birth).toLocaleDateString('en-US')}</td>
                  <td className={employee.active ? styles.active : styles.inactive}>
                    {employee.active ? 'Active' : 'Inactive'}
                  </td>
                  <td>
                    <button
                      onClick={() => toggleActiveStatus(employee.employee_id, employee.active)}
                      className={styles.switchButton}
                    >
                      Switch
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <button onClick={onClose} className={styles.closeButton}>Close</button>
      </div>
    </Modal>
  );
};

export default EmployeeViewerModal;