import React, { useState, useEffect } from 'react';
import { API_BASE, getAuthHeaders } from '../../../../api/config';

export default function BarberAdd({ onBarberAdded }) {
  const [email, setEmail] = useState('');
  const [barberName, setBarberName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [addError, setAddError] = useState('');
  const [success, setSuccess] = useState('');
  const [barbers, setBarbers] = useState([]);
  const [deleteError, setDeleteError] = useState('');

  // Adding a barber
  const handleAddBarber = async (e) => {
    e.preventDefault();
    setAddError('');
    setSuccess('');
    try {
      const res = await fetch(`${API_BASE}/barbers/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: barberName,
          avatar_url: avatarUrl,
          email: email,
        }),
      });
      if (!res.ok) throw new Error('Error adding barber');
      setSuccess('Barber added successfully!');
      setEmail('');
      setBarberName('');
      setAvatarUrl('');
      if (onBarberAdded) onBarberAdded();
    } catch (err) {
      setAddError('Error adding barber: ' + (err.message || 'Unknown error'));
    }
  };

  // Load barbers
  useEffect(() => {
    fetch(`${API_BASE}/barbers/`, { headers: getAuthHeaders() })
      .then(res => res.json())
      .then(data => setBarbers(Array.isArray(data) ? data : data.barbers || []))
      .catch(() => setAddError('Error loading barbers'))
  }, [success]);

  // Delete barber
  const handleDeleteBarber = async (barberId) => {
    setDeleteError('');
    try {
      const res = await fetch(`${API_BASE}/barbers/${barberId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error();
      setBarbers(prev => prev.filter(b => b.id !== barberId));
    } catch {
      setDeleteError('Error deleting barber');
    }
  };

  return (
    <>
      <div className="box">
        <h2 className="subtitle">Add Barber by User Email</h2>
        <form onSubmit={handleAddBarber}>
          <div className="field">
            <label className="label">Barber Name</label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={barberName}
                onChange={e => setBarberName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="field">
            <label className="label">User Email</label>
            <div className="control">
              <input
                className="input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="field">
            <button className="button is-primary" type="submit">Add Barber</button>
          </div>
          {addError && <div className="notification is-danger">{addError}</div>}
          {success && <div className="notification is-success">{success}</div>}
        </form>
      </div>

      <div className="box">
        <h2 className="subtitle">Barbers</h2>
        {deleteError && <div className="notification is-danger">{deleteError}</div>}
          <table className="table is-fullwidth is-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {barbers.map(barber => (
                <tr key={barber.id}>
                  <td>{barber.name}</td>
                  <td>
                    <button
                      className="button is-small is-danger"
                      onClick={() => handleDeleteBarber(barber.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
    </>
  );

  
}