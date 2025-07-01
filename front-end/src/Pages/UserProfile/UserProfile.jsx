import { useEffect, useState } from 'react';

export const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState({ upcoming: [], completed: [] });

  const API_BASE = '/api';

  const token = localStorage.getItem('jwt');

  const getAuthHeaders = () => ({
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  });

  // user profile and appointments fetching
  useEffect(() => {
    fetch(`${API_BASE}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setUser(data));

    fetch('http://127.0.0.1:8000/api/appointments/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        const mapWithAddons = list => (list || []).map(a => ({
          ...a,
          // предположим, что в ответе приходит массив объектов a.addons: [{ id, name, … }, …]
          addonIds: Array.isArray(a.addons) ? a.addons.map(ad => ad.id) : []
        }));

        setAppointments({
          upcoming: mapWithAddons(data.upcoming),
          completed: mapWithAddons(data.completed),
        });
      });
  }, [token]);

  // id — это appointment.id, addonIds — массив addon_id для этой записи
  async function cancelAppointment(id, addonIds = []) {
    try {
      if (Array.isArray(addonIds)) {
        for (const addonId of addonIds) {
          await fetch(
            `${API_BASE}/appointments/${id}/addon/${addonId}`,
            { method: 'DELETE', headers: getAuthHeaders() }
          );
        }
      }

      await fetch(
        `${API_BASE}/appointments/${id}`,
        { method: 'DELETE', headers: getAuthHeaders() }
      );

      setAppointments(prev => ({
        upcoming: prev.upcoming.filter(a => a.id !== id),
        completed: prev.completed,
      }));
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      alert('Error cancelling appointment. Please try again later.');
    }
  }



  if (!user) return <p>Searching your profile...</p>;

  return (
    <div className="box">
      <h2 className="title is-4">Hello, {user.name}</h2>

      {appointments.upcoming.length > 0 ? (
        <div className="card" style={{ backgroundColor: '#2a4d32', border: '1px solid #1e3a2d' }}>
          <header className="card-header" style={{ backgroundColor: '#1e3a2d' }}>
            <p className="card-header-title" style={{ color: '#ffffff', fontWeight: 'bold' }}>Найближчий візит</p> 
          </header>
          <div className="card-content">
            <div className="content" style={{ color: '#d3d3d3', fontSize: '16px', lineHeight: '1.8', padding: '1rem' }}>
              <p><strong style={{ color: '#ffffff' }}>Дата:</strong> <span style={{ color: '#d3d3d3' }}>{appointments.upcoming[0].scheduled_date}</span></p>
              <p><strong style={{ color: '#ffffff' }}>Час:</strong> <span style={{ color: '#d3d3d3' }}>{appointments.upcoming[0].scheduled_time}</span></p>
              <p><strong style={{ color: '#ffffff' }}>Барбер:</strong> <span style={{ color: '#d3d3d3' }}>{appointments.upcoming[0].barber_name}</span></p>
              <p><strong style={{ color: '#ffffff' }}>Послуга:</strong> <span style={{ color: '#d3d3d3' }}>{appointments.upcoming[0].full_service_title}</span></p>
            </div>
            <button
              className="button is-danger"
              onClick={() => cancelAppointment(
                appointments.upcoming[0].id,
                appointments.upcoming[0].addonIds
              )}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="notification is-light is-success" style={{ backgroundColor: '#3b5d34', color: '#ffffff' }}>
          Найближчих візитів немає.
        </div>
      )}

      <hr />

      <h3 className="title is-5">Мої попередні візити:</h3>
      {appointments.completed.length === 0 ? (
        <p>Візитів поки не було.</p>
      ) : (
        <ul>
          {appointments.completed.map((visit, i) => (
            <li key={visit.id || i}>
              <p><b>{visit.scheduled_date}</b> о {visit.scheduled_time} — {visit.full_service_title}, барбер: {visit.barber_name}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
