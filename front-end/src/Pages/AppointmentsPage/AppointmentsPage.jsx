import { useState, useEffect } from 'react';
import { API_BASE, getAuthHeaders } from '../../api/config';
import { AptsCalendar } from '../../components/AptsCalendar/AptsCalendar';
import { fetchCurrentUser } from '../../api/auth';

import './AppointmentsPage.css';

export function AppointmentsPage() {
  const [userRole, setUserRole] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [barbers, setBarbers] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState(0);
  const [currentBarberId, setCurrentBarberId] = useState(null);

  // Получаем роль и id текущего пользователя
  useEffect(() => {
    fetchCurrentUser()
      .then(data => {
        setUserRole(data.role);
        if (data.role === 'barber') setCurrentBarberId(data.id);
      })
      .catch(() => setUserRole(null))
      .finally(() => setLoadingUser(false));
  }, []);

  // Для админа получаем список барберов
  useEffect(() => {
    if (userRole === 'admin') {
      fetch(`${API_BASE}/barbers/`, { headers: getAuthHeaders() })
        .then(res => res.json())
        .then(json => {
          const list = Array.isArray(json) ? json : json.barbers || [];
          setBarbers(list);
          if (list.length > 0) setSelectedBarber(list[0].id);
        })
        .catch(console.error);
    }
  }, [userRole]);

  if (loadingUser) return <div className="container"><p>Loading...</p></div>;
  if (userRole !== 'admin' && userRole !== 'barber') return <div className="container"><p>Unauthorized</p></div>;

  return (
    <div className="appointments-container">
      {userRole === 'admin' && selectedBarber > 0 && (
        <AptsCalendar barberId={selectedBarber} userRole="admin" />
      )}
      {userRole === 'barber' && currentBarberId && (
        <AptsCalendar barberId={currentBarberId} userRole="barber" />
      )}
    </div>
  );
}
