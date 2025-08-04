import './ConfirmationModalForm.css';

export default function ConfirmationModalForm({ onClose, datetime }) {
  return (
    <div className="confirm-overlay">
      <div className="confirm-box">
        <div className="confirm-icon" aria-label="Success"></div>
        <h2 className="confirm-title">Zarezerwowano!</h2>
        <p className="confirm-text">
          Świetny wybór.
          Twój termin w <span className="confirm-barber">Barber Poznań №1</span> został potwierdzony.
          <span className="confirm-datetime">Czekamy na ciebie {datetime}</span>
        </p>
        <button className="confirm-button" onClick={onClose}>
          Zrozumiało
        </button>
      </div>
    </div>
  );
}
