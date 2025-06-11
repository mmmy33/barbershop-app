  import React, { useState, useEffect } from 'react';
  import './ContactButton.css';
  // import { iconClose } from '../../Icons/IconClose.svg'
  import { Form } from '../Form/Form';

  // button in last section behaves different


  export const ContactButton = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
      if (isModalOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }, [isModalOpen]);

    const openModal = () => {
      setIsModalOpen(true);
    };

    const closeModal = () => {
      setIsModalOpen(false);
    };

    return (
      <div>
        <a onClick={openModal} className="contact-button">Umów się o wizytę</a>

        {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <Form closeModal={closeModal} />
              </div>
            </div>
        )}
      </div>
    );
  };
