import { useState, useEffect } from 'react';
import ConfirmationModalForm from '../Form/FormModals/ConfirmationModalForm.jsx';
import ExistingAppointmentModal from '../Form/FormModals/ExistingAppointmentModal.jsx';
import { Form } from '../Form/Form.jsx';
import { API_BASE } from '../../api/config.js';
import { fetchCurrentUser } from '../../api/auth.js';
import './ContactButton.css';

export const ContactButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmData, setConfirmData] = useState(null);
  const [showExistingModal, setShowExistingModal] = useState(false);

  // const openModal = async () => {
  //   const token = localStorage.getItem('jwt');
  //   if (!token) {
  //     window.location.href = "/login";
  //     return;
  //   }

  //   const res = await fetch(`${API_BASE}/appointments/me`, {
  //     headers: { Authorization: `Bearer ${token}` }
  //   });
  //   const data = await res.json();

  //   if (data.upcoming && data.upcoming.length > 0) {
  //     setShowExistingModal(true);
  //     return;
  //   }

  //   if (canMultiBook) {
  //     setIsModalOpen(true);
  //   }

  //   setIsModalOpen(true);
  // };
  
const openModal = async () => {
  const token = localStorage.getItem('jwt');
  if (!token) {
    window.location.href = "/login";
    return;
  }

  // Get user role
  let userRole = "user";
  try {
    const user = await fetchCurrentUser();
    userRole = user.role || "user";
  } catch {
    window.location.href = "/login";
    return;
  }

  // Get existing appointments
  const res = await fetch(`${API_BASE}/appointments/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();

  // If default user role (not admin or barber), check for existing appointments
  if (
    userRole !== "admin" &&
    userRole !== "barber" &&
    data.upcoming &&
    data.upcoming.length > 0
  ) {
    setShowExistingModal(true);
    return;
  }

  // For admins and barbers, or if no existing appointment, open the main modal
  setIsModalOpen(true);
};

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFormSuccess = (data) => {
    setIsModalOpen(false);
    setTimeout(() => setConfirmData(data), 100);
  };

  const handleConfirmClose = () => setConfirmData(null);

  useEffect(() => {
    if (isModalOpen || confirmData) {
      document.body.classList.add('no-scroll-mobile');
    } else {
      document.body.classList.remove('no-scroll-mobile');
    }
    return () => {
      document.body.classList.remove('no-scroll-mobile');
    };
  }, [confirmData]);


  return (
    <>
      <a onClick={openModal} className="contact-button">Umów się o wizytę</a>

      {showExistingModal && (
        <ExistingAppointmentModal onClose={() => setShowExistingModal(false)} />
      )}

      {isModalOpen && (
          <div className="contact-button-overlay">
            <div className="contact-button-content">
              <Form closeModal={closeModal} onSuccess={handleFormSuccess} />
            </div>
          </div>
      )}

      {confirmData && (
        <ConfirmationModalForm
          onClose={handleConfirmClose}
          {...confirmData}
        />
      )}
    </>
  );
};
