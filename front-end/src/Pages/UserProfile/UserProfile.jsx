import './UserProfile.css';
import { useEffect, useState, useMemo } from 'react';
import { HeaderNavigation } from '../../sections/HeaderNavigation/HeaderNavigation';
import { FooterSection } from '../../sections/FooterSection/FooterSection';
import {getAuthHeaders} from '../../api/config';
import { API_BASE } from '../../api/config';

export const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState({ upcoming: [], completed: [] });
  const [error, setError] = useState(null);

  const token = localStorage.getItem('jwt');

  useEffect(() => {
    if (!token) {
      setError('Please log in first');
      return;
    }

    (async () => {
      try {
        const resUser = await fetch(`${API_BASE}/auth/me`, {
          headers: getAuthHeaders(),
        });
        if (!resUser.ok) throw new Error(`Auth failed: ${resUser.status}`);
        const userData = await resUser.json();
        setUser(userData);

        const resAppts = await fetch(`${API_BASE}/appointments/me`, {
          headers: getAuthHeaders(),
        });
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

  const navItems = useMemo(() => {
      const items = [
        { id: 'main-page', label: 'Main', route: '/' },
      ];
      if (user?.role === 'admin') {
        items.unshift({ id: 'admin', label: 'Admin', route: '/admin' });
        items.unshift({ id: 'appointments', label: 'Apps', route: '/appointments' });
      }
      return items;
    }, [user]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="user-profile-container">
      <HeaderNavigation navItems={navItems} />

      <div className="user-profile-box">
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
                className="cancel-button" onClick={() =>
                cancelAppointment(appointments.upcoming[0].id,appointments.upcoming[0].addonIds)}
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
          <div className="visit-card completed">
            <div className="visit-header">
              <span>Zakończony</span>
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="visit-body">
              {(() => {
                const last = appointments.completed[0];
                return (
                  <>
                    <div className="visit-row">
                      <span className="label">Twój barber:</span>
                      <span className="value">{last.barber_name}</span>
                    </div>
                    <div className="visit-row">
                      <span className="label">Service:</span>
                      <span className="value">{last.full_service_title}</span>
                    </div>
                    <div className="visit-row">
                      <span className="label">Kiedy:</span>
                      <span className="value">{last.scheduled_date}</span>
                    </div>
                    <div className="visit-row">
                      <span className="label">O której godzinie:</span>
                      <span className="value">{last.scheduled_time}</span>
                    </div>
                  </>
                );
              })()}
            </div>
            {/* <div className="visit-actions">
              <button className="button is-outlined">Usuń zapis</button>
            </div> */}
          </div>
        ) : (
          <div className="notification is-info">
            Brak zakończonych wizyt
          </div>
        )}
      </div>
      <FooterSection />
    </div>
  );
};