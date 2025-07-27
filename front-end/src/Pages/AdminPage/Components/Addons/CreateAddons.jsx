import React, { useState, useEffect } from 'react';
import { API_BASE, getAuthHeaders } from '../../../../api/config';

export default function CreateAddon() {
  const [addons, setAddons] = useState([]);
  const [addonName, setAddonName] = useState('');
  const [addonDuration, setAddonDuration] = useState('');
  const [addonPrice, setAddonPrice] = useState('');
  const [addAddonMessage, setAddAddonMessage] = useState('');
  const [error, setError] = useState('');

  // Addons(loading) fetch
  useEffect(() => {
    fetch(`${API_BASE}/addons/`, { headers: getAuthHeaders() })
      .then(res => res.json())
      .then(setAddons)
      .catch(() => setError('Failed to load addons'));
  }, []);

  // Create Addon
  const handleAddonSubmit = (e) => {
    e.preventDefault();
    const newAddon = {
      name: addonName,
      duration: parseInt(addonDuration, 10),
      price: parseFloat(addonPrice),
    };
    fetch(`${API_BASE}/addons/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(newAddon),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to add addon');
        return res.json();
      })
      .then((created) => {
        setAddons(prev => [...prev, created]);
        setAddonName('');
        setAddonDuration('');
        setAddonPrice('');
        setAddAddonMessage('Addon added successfully');
        setTimeout(() => setAddAddonMessage(''), 2000);
      })
      .catch(() => setError('Failed to add addon'));
  };

  // Delete Addon
  const deleteAddon = (addonId) => {
    fetch(`${API_BASE}/addons/${addonId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
      .then(res => {
        if (!res.ok) throw new Error();
        setAddons(prev => prev.filter(a => a.id !== addonId));
      })
      .catch(() => setError('Failed to delete addon'));
  };

  return (
    <>
      <div className="box">
        <h2 className="subtitle">Add New Addon</h2>
        {addAddonMessage && <div className="notification is-success">{addAddonMessage}</div>}
        {error && <div className="notification is-danger">{error}</div>}
        <form onSubmit={handleAddonSubmit}>
          <div className="field">
            <label className="label">Addon Name</label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={addonName}
                onChange={e => setAddonName(e.target.value)}
                placeholder="Enter addon name"
                required
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Duration (minutes)</label>
            <div className="control">
              <input
                className="input"
                type="number"
                value={addonDuration}
                onChange={e => setAddonDuration(e.target.value)}
                placeholder="Enter addon duration"
                required
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Price</label>
            <div className="control">
              <input
                className="input"
                type="number"
                value={addonPrice}
                onChange={e => setAddonPrice(e.target.value)}
                placeholder="Enter addon price"
                required
              />
            </div>
          </div>
          <div className="field is-grouped">
            <div className="control">
              <button className="button is-primary" type="submit">
                Add Addon
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="box">
        <h2 className="subtitle">Existing Addons</h2>
        <table className="table is-fullwidth is-striped">
          <thead>
            <tr>
              <th>Addon Name</th>
              <th>Duration</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {addons.map((addon) => (
              <tr key={addon.id}>
                <td>{addon.name}</td>
                <td>{addon.duration} min</td>
                <td>{addon.price} zł</td>
                <td>
                  <button
                    className="button is-small is-danger"
                    onClick={() => deleteAddon(addon.id)}
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
