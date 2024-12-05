import React, { useState } from 'react';
import CustomerLogIn from '../app/components/kiosk/customerLogInModal';

/**
 * @description
 * This component represents the customer login functionality in a kiosk system. It includes a button that triggers a modal 
 * for customer login when clicked. The modal allows customers to enter their login information. The modal's visibility is 
 * controlled by the component's state.
 *
 * @author Conner Black
 *
 * @param {object} props - The properties passed to the component.
 * @param {boolean} props.isModalOpen - A boolean state variable that tracks whether the modal is visible or not.
 * @param {function} props.onModalClose - A function that closes the modal when invoked.
 *
 * @returns {JSX.Element} The Customer Login component with the modal visibility control.
 *
 * @example
 * // Usage example
 * <CustomerLogin isModalOpen={true} onModalClose={() => setModalOpen(false)} />
 *
 * @module customer
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