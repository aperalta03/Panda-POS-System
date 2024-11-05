import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import styles from './employeeViewerModal.module.css';
import AddEmployeeForm from './addEmployeeForm'; // Import the AddEmployeeForm component

const EmployeeViewerModal = ({ isOpen, onClose }) => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [isAddEmployeeFormOpen, setIsAddEmployeeFormOpen] = useState(false); // Controls visibility of AddEmployeeForm

  // Fetch employee data when the modal opens
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('/api/employee-viewer');
        if (!response.ok) {
          throw new Error('Failed to fetch employee data');
        }
        const data = await response.json();
        setEmployees(data.data || []);  // Ensure employees data is loaded correctly
      } catch (error) {
        console.error('Error fetching employee data:', error);
        setError('Failed to load employee data. Please try again.');
      }
    };

    if (isOpen) {
      fetchEmployees();
    }
  }, [isOpen]);

  // Handle adding a new employee
  const handleAddEmployee = (newEmployee) => {
    setEmployees((prevEmployees) => [...prevEmployees, newEmployee]);
    setIsAddEmployeeFormOpen(false); // Close the Add Employee Form Modal after submission
    onClose(); // Close the Employee Viewer Modal as well
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className={styles.modalBox}>
        <h2>Employee Viewer</h2>
        {error && <p className={styles.errorText}>{error}</p>}

        {/* Employee Table */}
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
              {employees.length > 0 ? (
                employees.map((employee) => {
                  if (!employee) return null;  // Skip rendering if employee is undefined or null
                  return (
                    <tr key={employee.employee_id}>
                      <td>{employee?.first_name || '-'}</td> {/* Check if first_name exists */}
                      <td>{employee?.last_name || '-'}</td> {/* Check if last_name exists */}
                      <td>{employee?.employee_id || '-'}</td> {/* Check if employee_id exists */}
                      <td>{employee?.phone_number || '-'}</td> {/* Check if phone_number exists */}
                      <td>{employee?.hourly_rate ?? '-'}</td> {/* Default to '-' if hourly_rate is undefined */}
                      <td>{employee?.pt ? '✔️' : ''}</td>
                      <td>{employee?.active ? 'Active' : 'Inactive'}</td>
                      <td>{employee?.date_of_birth || '-'}</td> {/* Check if date_of_birth exists */}
                      <td>
                        <button className={styles.switchButton}>Switch</button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="10">No employees available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Button to open Add Employee Form Modal */}
        <button onClick={() => setIsAddEmployeeFormOpen(true)} className={styles.addButton}>
          Add New Employee
        </button>

        {/* Close Button for Employee Viewer Modal */}
        <button onClick={onClose} className={styles.closeButton}>
          Close
        </button>

        {/* Add Employee Form Modal */}
        {isAddEmployeeFormOpen && (
          <AddEmployeeForm
            isOpen={isAddEmployeeFormOpen}
            onClose={() => setIsAddEmployeeFormOpen(false)} // Close the Add Employee form
            onSubmit={handleAddEmployee} // Add the new employee to the list and close both modals
          />
        )}
      </div>
    </Modal>
  );
};

export default EmployeeViewerModal;