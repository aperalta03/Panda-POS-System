import React, { useState } from 'react';
import CustomerLogIn from '../app/components/kiosk/customerLogInModal';

/**
 * Customer Login Component
 *
 * @author Conner Black
 *
 * @description
 * This component represents the customer login functionality in a kiosk system. It includes a button that triggers a modal 
 * for customer login when clicked. The modal allows customers to enter their login information. The modal's visibility is 
 * controlled by the component's state.
 *
 * @features
 * - Modal Control: Uses `useState` to manage the visibility of the login modal.
 * - User Interaction: Displays a "Log In" button that opens the modal when clicked.
 * - Modal Component: Passes control props (`isOpen` and `onClose`) to the `CustomerLogIn` modal component to manage its visibility.
 * 
 * @state
 * - `isModalOpen`: A boolean state variable that tracks whether the modal is visible or not.
 *
 * @dependencies
 * - `React`: The core library for building the component.
 * - `useState`: React hook used to manage component state.
 * - `CustomerLogIn`: A custom modal component used to show the login form to the customer.
 *
 * @example
 * When the customer clicks the "Log In" button, the `CustomerLogIn` modal opens, allowing the user to log in. 
 *
 * Response:
 * - The modal can be closed by calling the `onClose` function passed to the `CustomerLogIn` component.
 *
 * @note
 * The modal component (`CustomerLogIn`) expects two props:
 * - `isOpen`: A boolean that controls the visibility of the modal.
 * - `onClose`: A function that closes the modal when invoked.
 *
 * @usage
 * This component is typically used in a customer-facing kiosk system where customers need to log in before proceeding with other tasks.
 */

const Customer = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleShowModal = () => {
        setIsModalOpen(true);
    };

    const handleHideModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <button onClick={handleShowModal}>Log In</button>
            {/* Pass the isOpen prop to control visibility */}
            <CustomerLogIn isOpen={isModalOpen} onClose={handleHideModal} />
        </div>
    );
};

export default Customer;