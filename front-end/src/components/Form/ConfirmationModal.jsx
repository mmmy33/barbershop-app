import './ConfirmationModal.css';

export default function ConfirmationModal({ onClose, datetime }) {
  return (
    <div className="confirm-overlay">
      <div className="confirm-box">
        <div className="confirm-icon" aria-label="Success"></div>
        <h2 className="confirm-title">Zarezerwowano!</h2>
        <p className="confirm-text">
          Świetny wybór.<br />
          Twój termin w <span className="confirm-barber">Barber Poznań №1</span> został potwierdzony.<br />
          <span className="confirm-datetime">{datetime}</span>
        </p>
        <button className="confirm-button" onClick={onClose}>
          Zrozumiało
        </button>
      </div>
    </div>
  );
}