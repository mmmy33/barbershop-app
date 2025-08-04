import { useEffect } from 'react';
import './ConfirmationModals.css';

function useBodyNoScroll() {
  useEffect(() => {
    document.body.classList.add('no-scroll-mobile');
    return () => {
      document.body.classList.remove('no-scroll-mobile');
    };
  }, []);
}

export const DeleteWarningModal = ({ onConfirm, onCancel }) => {
  useBodyNoScroll();
  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal-box">
        <h2 className="delete-modal-title">Czy na pewno chcesz usunąć ten zapis?</h2>
        <p className="delete-modal-text">
          Tego działania nie można cofnąć.<br />
          Zapis zostanie trwale usunięty z twojego archiwum.
        </p>
        <div className="delete-modal-buttons">
          <button className="delete-modal-btn delete-modal-btn-danger" onClick={onConfirm}>Tak, usuń</button>
          <button className="delete-modal-btn" onClick={onCancel}>Anuluj</button>
        </div>
      </div>
    </div>
  );
};

export const DeleteSuccessModal = ({ onClose }) => {
  useBodyNoScroll();
  return (
    <div className="success-modal-overlay">
      <div className="success-modal-box">
        <div className="success-modal-icon" aria-label="success"></div>
        <h2 className="success-modal-title">Gotowe! Twój zapis został usunięty.</h2>
        <button className="success-modal-btn" onClick={onClose} style={{ width: '100%' }}>Zrozumiało</button>
      </div>
    </div>
  );
};

export const CancelAppointmentModal = ({ onClose }) => {
  useBodyNoScroll();
  return (
    <div className="cancel-modal-overlay">
      <div className="cancel-modal-box">
        <div className="cancel-modal-icon" aria-label="success"></div>
        <h2 className="cancel-modal-title">
          Anulowano
        </h2>
        <div className="cancel-modal-text">
          „Twój termin w Barber Poznań №1 został odwołany.<br />
          Mamy nadzieję, że zobaczymy się innym razem!”
        </div>
        <button className="cancel-modal-btn" onClick={onClose}>Zrozumiało</button>
      </div>
    </div>
  );
};