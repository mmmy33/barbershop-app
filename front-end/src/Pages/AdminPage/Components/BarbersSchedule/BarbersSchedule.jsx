import { useState, useEffect } from 'react';
import { API_BASE, getAuthHeaders } from '../../../../api/config';

export default function BarberSchedule({ barbers, daysOfWeek }) {
  const [selectedBarberId, setSelectedBarberId] = useState(0);
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState(0);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('20:00');
  const [schedules, setSchedules] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedBarberId) loadSchedules(selectedBarberId);
  }, [selectedBarberId]);

  const loadSchedules = (barberId) => {
    fetch(`${API_BASE}/barbers/${barberId}/schedules/`, { headers: getAuthHeaders() })
      .then((res) => res.json())
      .then((data) => setSchedules(data))
      .catch(() => setError('Failed to load schedules'));
  };

  const addSchedule = () => {
    if (selectedBarberId === 0 || selectedDayOfWeek === -1) {
      setError('Please select barber and day');
      return;
    }
    const newSchedule = {
      day_of_week: selectedDayOfWeek,
      start_time: startTime,
      end_time: endTime
    };
    fetch(`${API_BASE}/barbers/${selectedBarberId}/schedules/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(newSchedule),
    })
      .then((res) => res.json())
      .then(() => loadSchedules(selectedBarberId))
      .catch(() => setError('Failed to add schedule'));
  };

  const deleteSchedule = async (scheduleId) => {
    try {
      const response = await fetch(`${API_BASE}/barbers/schedules/${scheduleId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error();
      await loadSchedules(selectedBarberId);
    } catch {
      setError('Failed to delete schedule');
    }
  };

  return (
    <div className="box">
      <h2 className="subtitle">Manage Barber Schedules</h2>
      {error && <div className="notification is-danger">{error}</div>}
      <div className="field">
        <div className="field is-grouped is-flex-wrap-wrap">
          <div className="control">
            <div className="select">
              <select
                value={selectedBarberId}
                onChange={e => setSelectedBarberId(+e.target.value)}
              >
                <option value={-1}>Select Barber</option>
                {barbers.map((barber) => (
                  <option key={barber.id} value={barber.id}>
                    {barber.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="control">
            <div className="select">
              <select value={selectedDayOfWeek} onChange={e => setSelectedDayOfWeek(+e.target.value)}>
                <option value={-1}>Select Day</option>
                {daysOfWeek.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="control">
            <input
              className="input"
              type="time"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
            />
          </div>
          <div className="control">
            <input
              className="input"
              type="time"
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
            />
          </div>
          <div className="control">
            <button className="button is-primary" onClick={addSchedule}>
              Add Schedule
            </button>
          </div>
        </div>

        <table className="table is-fullwidth is-striped">
          <thead>
            <tr>
              <th>Barber</th>
              <th>Day</th>
              <th>From</th>
              <th>To</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((s) => {
              const barber = barbers.find((b) => b.id === s.barber_id);
              const day = daysOfWeek.find((d) => d.value === s.day_of_week)?.label;
              return (
                <tr key={s.id}>
                  <td>{barber ? barber.name : 'Unknown Barber'}</td>
                  <td>{day}</td>
                  <td>{s.start_time}</td>
                  <td>{s.end_time}</td>
                  <td>
                    <button className="button is-small is-danger" onClick={() => deleteSchedule(s.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}