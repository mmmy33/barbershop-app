import { useState, useEffect } from 'react';
import { API_BASE, getAuthHeaders } from '../../../../api/config';

export default function UnavailableTime({ barbers }) {
  const [selectedBarberId, setSelectedBarberId] = useState('');
  const [startDatetime, setStartDatetime] = useState('');
  const [endDatetime, setEndDatetime] = useState('');
  const [reason, setReason] = useState('text');
  const [unavailableList, setUnavailableList] = useState([]);
  const [error, setError] = useState('');

  // Load unavailable times for selected barber
  useEffect(() => {
    if (selectedBarberId) {
      fetch(`${API_BASE}/barbers/${selectedBarberId}/unavailable-times/`, {
        headers: getAuthHeaders(),
      })
        .then(res => res.json())
        .then(data => setUnavailableList(Array.isArray(data) ? data : []))
        .catch(() => setUnavailableList([]));
    } else {
      setUnavailableList([]);
    }
  }, [selectedBarberId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!selectedBarberId || !startDatetime || !endDatetime || !reason) {
      setError('Please fill all fields');
      return;
    }
    try {
      const body = {
        end_time: endDatetime ? new Date(endDatetime).toISOString() : null,
        reason,
        start_time: startDatetime ? new Date(startDatetime).toISOString() : null,
      };
      console.log('POST body:', body);

      const res = await fetch(`/api/barbers/${selectedBarberId}/unavailable-times`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      console.log('Server response:', data);

      if (!res.ok) {
        setError(JSON.stringify(data));
        throw new Error();
      }

      setStartDatetime('');
      setEndDatetime('');
      setReason('');
      setUnavailableList(prev => [...prev, data]);
    } catch (e) {
      setError('Failed to create unavailable time');
    }
  };

  return (
    <div className="box">
      <h2 className="subtitle">Add Unavailable Time</h2>
      <form onSubmit={handleSubmit} className="field is-grouped is-flex-wrap-wrap" style={{ gap: 12 }}>
        <div className="control">
          <div className="select">
            <select
              value={selectedBarberId}
              onChange={e => setSelectedBarberId(e.target.value)}
            >
              <option value="">Select Barber</option>
              {barbers.map(barber => (
                <option key={barber.id} value={barber.id}>{barber.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="control">
          <input
            className="input"
            type="datetime-local"
            value={startDatetime}
            onChange={e => setStartDatetime(e.target.value)}
            placeholder="Start"
          />
        </div>
        <div className="control">
          <input
            className="input"
            type="datetime-local"
            value={endDatetime}
            onChange={e => setEndDatetime(e.target.value)}
            placeholder="End"
          />
        </div>
        <div className="control">
          <input
            className="input"
            type="text"
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="Reason"
            maxLength={64}
          />
        </div>
        <div className="control">
          <button className="button is-primary" type="submit">
            Add
          </button>
        </div>
      </form>
      {error && <div className="notification is-danger">{error}</div>}

      <h2 className="subtitle" style={{ marginTop: 32 }}>Unavailable Times</h2>
      <table className="table is-fullwidth is-striped">
        <thead>
          <tr>
            <th>Barber</th>
            <th>From</th>
            <th>To</th>
            <th>Reason</th>
          </tr>
        </thead>
        <tbody>
          {unavailableList.length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', color: '#888' }}>No unavailable times</td>
            </tr>
          )}
          {unavailableList.map((item) => {
            const barber = barbers.find(b => String(b.id) === String(item.barber_id));
            return (
              <tr key={item.id}>
                <td>{barber ? barber.name : item.barber_id}</td>
                <td>{item.start_datetime || item.start_time}</td>
                <td>{item.end_datetime || item.end_time}</td>
                <td>{item.reason}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}