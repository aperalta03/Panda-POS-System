import React, { useState } from 'react';
import CustomerLogIn from '../app/components/kiosk/customerLogInModal';

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