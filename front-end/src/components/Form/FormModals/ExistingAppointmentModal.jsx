export default function ExistingAppointmentModal({ onClose }) {
  return (
    <div className="confirm-overlay">
      <div className="confirm-box">
        <h2 className="confirm-title">Już masz umówioną wizytę</h2>
        <p className="confirm-text">
          Nie możesz umówić się na inną wizytę, gdy masz aktywną.
        </p>
        <button className="confirm-button" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
}