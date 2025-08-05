import './UserProfilePage.css';
import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeaderNavigation } from '../../sections/HeaderNavigation/HeaderNavigation';
import { FooterSection } from '../../sections/FooterSection/FooterSection';
import { getAuthHeaders } from '../../api/config';
import { API_BASE } from '../../api/config';

import { DeleteWarningModal, DeleteSuccessModal, CancelAppointmentModal } from './ConfirmationModals/ConfirmationModals';

export const UserProfilePage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState({ upcoming: [], completed: [] });
  const [error, setError] = useState(null);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const token = localStorage.getItem('jwt');

  // For completed appointments:
  function handleDeleteCompletedClick(visitId) {
    setDeleteTarget(visitId);
    setShowDeleteConfirm(true);
  }

  async function handleConfirmDeleteCompleted() {
    setShowDeleteConfirm(false);
    setShowSuccessModal(true);
    try {
      const res = await fetch(
        `${API_BASE}/appointments/${deleteTarget}`,
        { method: 'DELETE', headers: getAuthHeaders() }
      );
      if (!res.ok) throw new Error(`Failed to delete appointment ${deleteTarget}`);
      setAppointments(prev => ({
        ...prev,
        completed: prev.completed.filter(a => a.id !== deleteTarget),
      }));
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleteTarget(null);
    }
  }

  // Auth check
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return
    }

    (async () => {
      try {
        const resUser = await fetch(`${API_BASE}/auth/me`, {
          headers: getAuthHeaders(),
        });
        if (resUser.status === 401 || resUser.status === 403) {
          localStorage.removeItem('jwt');
          navigate('/login');
          return;
        }
        if (!resUser.ok) throw new Error(`Auth failed: ${resUser.status}`);
        const userData = await resUser.json();
        setUser(userData);

        const resAppts = await fetch(`${API_BASE}/appointments/me`, {
          headers: getAuthHeaders(),
        });
        if (resAppts.status === 401 || resAppts.status === 403) {
          localStorage.removeItem('jwt');
          navigate('/login');
          return;
        }
        if (!resAppts.ok) throw new Error(`Appointments failed: ${resAppts.status}`);
        const apptData = await resAppts.json();

        // adding field addonIds
        const mapWithAddons = list =>
          (list || []).map(a => ({
            ...a,
            addonIds: Array.isArray(a.addons) ? a.addons.map(ad => ad.id) : [],
          }));

        setAppointments({
          upcoming: mapWithAddons(apptData.upcoming),
          completed: mapWithAddons(apptData.completed),
        });
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    })();
  }, [token]);

  // appointment(main service) & addon cancellation
  async function cancelAppointment(id, addonIds = []) {
    try {
      // delete addons
      if (Array.isArray(addonIds)) {
        for (const addonId of addonIds) {
          const resAddon = await fetch(
            `${API_BASE}/appointments/${id}/addon/${addonId}`,
            { method: 'DELETE', headers: getAuthHeaders() }
          );
          if (!resAddon.ok) {
            throw new Error(`Failed to delete addon ${addonId}`);
          }
        }
      }
      // delete main appointment
      const resMain = await fetch(
        `${API_BASE}/appointments/${id}`,
        { method: 'DELETE', headers: getAuthHeaders() }
      );
      if (!resMain.ok) {
        throw new Error(`Failed to delete appointment ${id}`);
      }
      // refresh state
      setAppointments(prev => ({
        upcoming: prev.upcoming.filter(a => a.id !== id),
        completed: prev.completed,
      }));
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  const handleCancelUpcoming = async () => {
    const next = appointments.upcoming[0];
    if (!next) return;
    await cancelAppointment(next.id, next.addonIds);
    setShowCancelModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    navigate('/login');
  };

  const navItems = useMemo(() => {
      const items = [
        { id: 'main-page', label: 'Main', route: '/' },
        { id: 'editProfile-page', label: 'Edit Profile', route: '/edit' },
      ];
      if (user?.role === 'admin' || user?.role === 'barber') {
        items.unshift({ id: 'appointments', label: 'Apps', route: '/appointments' });
      }
      if (user?.role === 'admin') {
        items.unshift({ id: 'admin', label: 'Admin', route: '/admin' });
      }
      items.push({ id: 'logout', label: 'Logout', action: handleLogout });
      return items;
  }, [user]);

  if (error) {
    return (
      <p style={{ color: 'red' }}>{error}</p>
    );
  }

  function getGreeting(user) {
    const hour = new Date().getHours();
    let base = 'Hello';
    if (hour < 12) base = 'Good morning';
    else if (hour < 18) base = 'Good afternoon';
    else base = 'Good evening';

    const name = user?.name || '';
    return `${base}${name ? ', ' + name : ''}!`;
  }

  return (
    <div className="user-profile-container">
      <HeaderNavigation navItems={navItems} />
      <div className="user-profile-box">
        <div className="user-greeting">
          {getGreeting(user)}
        </div>
        {appointments.upcoming.length > 0 ? (
          <div className="visit-card scheduled">
            <div className="visit-header">
              <span>Zaplanowany</span>
              <i className="fas fa-calendar-alt"></i>
            </div>
            <div className="visit-body">
              {(() => {
                const next = appointments.upcoming[0];
                return (
                  <>
                    <div className="visit-row">
                      <span className="label">Twój barber:</span>
                      <span className="value">{next.barber_name}</span>
                    </div>
                    <div className="visit-row">
                      <span className="label">Service:</span>
                      <span className="value">{next.full_service_title}</span>
                    </div>
                    <div className="visit-row">
                      <span className="label">Kiedy:</span>
                      <span className="value">{next.scheduled_date}</span>
                    </div>
                    <div className="visit-row">
                      <span className="label">O której godzinie:</span>
                      <span className="value">{next.scheduled_time}</span>
                    </div>
                  </>
                );
              })()}
            </div>
            <div className="visit-actions">
              <button
                className="cancel-appointment-button" 
                onClick={handleCancelUpcoming}
              >
                Anulować
              </button>
            </div>
          </div>
        ) : (
          <div className="notification is-warning">
            Brak zaplanowanych wizyt
          </div>
        )}

        {appointments.completed.length > 0 ? (
          appointments.completed.slice(0, 5).map((visit, idx) => (
            <div className="visit-card completed" key={visit.id || idx}>
              <div className="visit-header">
                <span>Zakończony</span>
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="visit-body">
                <div className="visit-row">
                  <span className="label">Twój barber:</span>
                  <span className="value">{visit.barber_name}</span>
                </div>
                <div className="visit-row">
                  <span className="label">Service:</span>
                  <span className="value">{visit.full_service_title}</span>
                </div>
                <div className="visit-row">
                  <span className="label">Kiedy:</span>
                  <span className="value">{visit.scheduled_date}</span>
                </div>
                <div className="visit-row">
                  <span className="label">O której godzinie:</span>
                  <span className="value">{visit.scheduled_time}</span>
                </div>
              </div>
              <div className="visit-actions">
                <button
                  className="delete-appointment-button"
                  onClick={() => handleDeleteCompletedClick(visit.id)}
                >
                  Usuń zapis
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="notification is-info">
            Brak zakończonych wizyt
          </div>
        )}
      </div>
      <FooterSection />

      {showCancelModal && (
        <CancelAppointmentModal onClose={() => setShowCancelModal(false)} />
      )}

      {showDeleteConfirm && (
        <DeleteWarningModal
          onConfirm={handleConfirmDeleteCompleted}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}

      {showSuccessModal && (
        <DeleteSuccessModal
          onClose={() => setShowSuccessModal(false)}
        />
      )}
    </div>
  );
};