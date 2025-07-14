import { useState, useEffect } from 'react';
import { API_BASE, getAuthHeaders } from '../../api/config';
import { AptsCalendar } from '../../components/AptsCalendar/AptsCalendar';
import { fetchCurrentUser } from '../../api/auth';

import './AppointmentsPage.css';

export function AppointmentsPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  const [barbers, setBarbers] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState(0);

  // User fetch to check if admin
  useEffect(() => {
    fetchCurrentUser()
      .then(data => setIsAdmin(data.role === 'admin'))
      .catch(() => {})
      .finally(() => setLoadingUser(false));
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/barbers/`, { headers: getAuthHeaders() })
      .then(res => res.json())
      .then(json => {
        const list = Array.isArray(json) ? json : json.barbers || [];
        setBarbers(list);
        if (list.length > 0) setSelectedBarber(list[0].id);
      })
      .catch(console.error);
  }, []);

  if (loadingUser) return <div className="container"><p>Loading...</p></div>;
  if (!isAdmin)    return <div className="container"><p>Unauthorized</p></div>;

  return (
    <div className="appointments-container">
      <div className="select-barber-box">
        <div className="control">
          <div className="select">
            <select
              value={selectedBarber}
              onChange={e => setSelectedBarber(+e.target.value)}
            >
              {barbers.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {selectedBarber > 0 && (
        <AptsCalendar barberId={selectedBarber} />
      )}
    </div>
  );
}
