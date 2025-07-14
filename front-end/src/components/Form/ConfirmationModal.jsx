import './ConfirmationModal.css';

export default function ConfirmationModal({ onClose, datetime }) {
  return (
    <div className="confirm-overlay">
      <div className="confirm-box">
        <div className="confirm-icon"></div>
        <h2 className="confirm-title">Zarezerwowano!</h2>
        <p className="confirm-text">
          Świetny wybór. Twój termin w Barber Poznań №1 został potwierdzony. <br/>
          Czekamy na Ciebie {datetime}
        </p>
        <button className="confirm-button" onClick={onClose}>
          Zrozumiało
        </button>
      </div>
    </div>
  );
}
