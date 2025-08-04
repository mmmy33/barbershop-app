import './AdminPage.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import { API_BASE, getAuthHeaders } from '../../api/config';
import { fetchCurrentUser } from '../../api/auth';

import BarberSchedule from './Components/BarbersSchedule/BarbersSchedule';
import UnavailableTime from './Components/UnavailableTime/UnavailableTime';
import CreateAddon from './Components/Addons/CreateAddons';
import CreateService from './Components/Services/CreateService';
import BarberAdd from './Components/BarberAdd/BarberAdd';

export const AdminPage = () => {
  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState(false);
  const [barbers, setBarbers] = useState([]);
  const [error, setError] = useState('');

  const daysOfWeek = [
    { label: 'Monday', value: 0 },
    { label: 'Tuesday', value: 1 },
    { label: 'Wednesday', value: 2 },
    { label: 'Thursday', value: 3 },
    { label: 'Friday', value: 4 },
    { label: 'Saturday', value: 5 },
    { label: 'Sunday', value: 6 },
  ];

  // User fetch to check if admin
  useEffect(() => {
    fetchCurrentUser()
      .then(data => setIsAdmin(data.role === 'admin'))
      .catch(() => {})
  }, []);

  // Barbers fetch
  useEffect(() => {
    if (isAdmin) {
      fetch(`${API_BASE}/barbers/`, { headers: getAuthHeaders() })
        .then(res => res.json())
        .then(data => setBarbers(Array.isArray(data) ? data : data.barbers || []))
        .catch(() => setError('Failed to load barbers'));
    }
  }, [isAdmin]);

  if (!isAdmin) return (
    <div className="container">
      <p
        style={{
          color: '#ff0000',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        Unauthorized
      </p>
    </div>
  );

  return (
    <div className="container">
      <section className="section">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}
        >
          <h1 className="title">ADMIN PANEL</h1>
          <button className="button is-link" onClick={() => navigate('/')}>Home</button>
        </div>

        {error && <div className="notification is-danger">{error}</div>}

        <BarberSchedule barbers={barbers} daysOfWeek={daysOfWeek} />

        <UnavailableTime barbers={barbers} />

        <CreateService barbers={barbers} />

        <CreateAddon />

        <BarberAdd />
      </section>
    </div>
  );
}

export default AdminPage;
