import { useState } from 'react';
import './ContactButton.css';
import Form from '../Form/Form.jsx';

export const ContactButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    const jwt = localStorage.getItem('jwt');
    if (!jwt || jwt==='undefined' || jwt==='null') {
      window.location.href = '/login';
      return;
    }
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
