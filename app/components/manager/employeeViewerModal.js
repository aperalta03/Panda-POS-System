import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import styles from './employeeViewerModal.module.css';
import AddEmployeeForm from './addEmployeeForm';

const EmployeeViewerModal = ({ isOpen, onClose }) => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [isAddEmployeeFormOpen, setIsAddEmployeeFormOpen] = useState(false);

  // Fetch employee data when the modal opens
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

  // Calculate age based on date of birth
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();

    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
      return age - 1;
    }
    return age;
  };

  // Toggle active status for an employee
  const toggleEmployeeStatus = async (employeeId, currentStatus) => {
    try {
      const response = await fetch('/api/toggle-employee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeId,
          isActive: !currentStatus,
        }),
      });

      if (response.ok) {
        // Update the local state to reflect the new active status
        setEmployees((prevEmployees) =>
          prevEmployees.map((employee) =>
            employee.employee_id === employeeId
              ? { ...employee, active: !currentStatus }
              : employee
          )
        );
      } else {
        console.error('Failed to toggle employee status');
        setError('Failed to update employee status. Please try again.');
      }
    } catch (error) {
      console.error('Error toggling employee status:', error);
      setError('Error updating employee status. Please try again.');
    }
  };

  // Handle adding a new employee
  const handleAddEmployee = (newEmployee) => {
    setEmployees((prevEmployees) => [...prevEmployees, newEmployee]);
    setIsAddEmployeeFormOpen(false);
    onClose();
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
                <th>Date of Birth</th>
                <th>18+</th>
                <th>PT</th>
                <th>Active</th>
                <th>Switch</th>
              </tr>
            </thead>
            <tbody>
              {employees.length > 0 ? (
                employees.map((employee) => {
                  if (!employee) return null;
                  const is18OrOlder = calculateAge(employee?.date_of_birth) >= 18;
                  const nameClass = employee.is_manager ? styles.managerName : styles.regularName;

                  return (
                    <tr key={employee.employee_id}>
                      <td className={nameClass}>{employee?.first_name || '-'}</td>
                      <td className={nameClass}>{employee?.last_name || '-'}</td>
                      <td>{employee?.employee_id || '-'}</td>
                      <td>{employee?.phone_number || '-'}</td>
                      <td>{employee?.hourly_rate ?? '-'}</td>
                      <td>{employee?.date_of_birth ? new Date(employee.date_of_birth).toISOString().split('T')[0] : '-'}</td>
                      <td>{is18OrOlder ? '✔️' : ''}</td>
                      <td>{employee?.pt ? '✔️' : ''}</td>
                      <td>{employee?.active ? '✔️' : ''}</td>
                      <td>
                        <button
                          className={styles.switchButton}
                          onClick={() => toggleEmployeeStatus(employee.employee_id, employee.active)}
                        >
                          Switch
                        </button>
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
            onClose={() => setIsAddEmployeeFormOpen(false)}
            onSubmit={handleAddEmployee}
          />
        )}
      </div>
    </Modal>
  );
};

export default EmployeeViewerModal;
