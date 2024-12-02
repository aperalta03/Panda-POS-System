import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import styles from './employeeViewerModal.module.css';
import AddEmployeeForm from './addEmployeeForm';
import EmployeeIdModal from './employeeIdModal';  // Import the EmployeeIdModal
import EditEmployeeModal from './editEmployeeModal';

/**
 * Employee Viewer Modal Component
 * 
 * @author Alonso Peralta Espinoza
 *
 * @description
 * A modal interface for viewing and managing employees.
 * Features include listing employees, editing employee details, toggling active status,
 * adding new employees, and displaying detailed information via sub-modals.
 *
 * @features
 * - Fetch and display employee data from `/api/employee-viewer`.
 * - Toggle employee active status with a switch button.
 * - Add new employees via `AddEmployeeForm`.
 * - Edit employee details through `EditEmployeeModal`.
 * - Search for specific employees using `EmployeeIdModal`.
 *
 * @state
 * - `employees`: Stores the list of employees fetched from the API.
 * - `error`: Tracks errors during data fetch or updates.
 * - `isAddEmployeeFormOpen`: Controls visibility of the add employee modal.
 * - `isEmployeeIdModalOpen`: Controls visibility of the employee ID modal.
 * - `isEditEmployeeModalOpen`: Controls visibility of the edit employee modal.
 * - `employeeToEdit`: Stores details of the employee being edited.
 *
 * @methods
 * - `fetchEmployees`: Fetches employee data from the API.
 * - `handleAddEmployee`: Adds a new employee and updates the local state.
 * - `toggleEmployeeStatus`: Toggles the active status of an employee.
 * - `calculateAge`: Calculates the age of an employee from their date of birth.
 * - `onEmployeeFound`: Opens the edit modal with details of the selected employee.
 * - `handleSaveEmployee`: Saves updated employee details to the local state.
 *
 * @example
 * <EmployeeViewerModal isOpen={true} onClose={() => {}} />
 */

const EmployeeViewerModal = ({ isOpen, onClose }) => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [isAddEmployeeFormOpen, setIsAddEmployeeFormOpen] = useState(false);
  const [isEmployeeIdModalOpen, setIsEmployeeIdModalOpen] = useState(false);  // State to control EmployeeIdModal
  const [isEditEmployeeModalOpen, setIsEditEmployeeModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);

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

  // Handle submitting employee ID (this is where you'll integrate fetching data for a specific employee)
  const handleEmployeeIdSubmit = (id) => {
    // Implement fetch logic here to get employee details by ID
    console.log(`Employee ID submitted: ${id}`);
  };

  // Open Employee ID Modal
  const openEmployeeIdModal = () => {
    setIsEmployeeIdModalOpen(true);
  };

  const handleAddEmployee = (newEmployee) => {
    setEmployees((prevEmployees) => [...prevEmployees, newEmployee]);
    setIsAddEmployeeFormOpen(false);
    onClose();
  }

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

  const onEmployeeFound = (employeeData) => {
    setEmployeeToEdit(employeeData);
    setIsEmployeeIdModalOpen(false);  // Close EmployeeIdModal
    setIsEditEmployeeModalOpen(true);  // Open EditEmployeeModal
  };

  const handleSaveEmployee = (updatedEmployeeData) => {
    // You can now handle saving the updated employee data here.
    // For example, you can update the employee in the local state or send it to the API.
    console.log('Updated employee data:', updatedEmployeeData);
  
    // Update the employee in the local state if you're using it for rendering.
    setEmployees((prevEmployees) =>
      prevEmployees.map((employee) =>
        employee.employee_id === updatedEmployeeData.employee_id
          ? { ...employee, ...updatedEmployeeData }
          : employee
      )
    );
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

        {/* Button to open Employee ID Modal */}
        <button onClick={openEmployeeIdModal} className={styles.addButton}>
          Edit Employee
        </button>

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

        {/* Employee ID Modal */}
        <EmployeeIdModal
          isOpen={isEmployeeIdModalOpen}
          onClose={() => setIsEmployeeIdModalOpen(false)}
          onSubmit={(onEmployeeFound)}
        />

        <EditEmployeeModal
          isOpen={isEditEmployeeModalOpen}
          onClose={() => setIsEditEmployeeModalOpen(false)}
          employeeData={employeeToEdit} // Pass the employee data
          onSave={handleSaveEmployee} // Handle saving the updated data
        />
      </div>
    </Modal>
  );
};

export default EmployeeViewerModal;