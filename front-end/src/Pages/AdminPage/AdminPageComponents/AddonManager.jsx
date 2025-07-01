import { useState, useEffect } from 'react';
import { error }  from '../AdminPage'

const API_BASE = 'http://127.0.0.1:8000/api';
const getAuthHeaders = () => ({
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('jwt')}`,
});

export const AddonManager = () => {
  const [addons, setAddons] = useState([]);
  const [addonName, setAddonName] = useState('');
  const [addonDuration, setAddonDuration] = useState('');
  const [addonPrice, setAddonPrice] = useState('');
  const [addAddonMessage, setAddAddonMessage] = useState('');

  //#region Addons
    // Addons fetch
    useEffect(() => {
      fetch(`${API_BASE}/addons/`, { headers: getAuthHeaders() })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          setAddons(data);
        })
        .catch(error => console.error('Error fetching addons:', error));
    }, []);

    // Function to add a new addon
    const addAddon = async (addonData) => {
      try {
        const res = await fetch(`${API_BASE}/addons/`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(addonData),
        });
        if (!res.ok) throw new Error('Failed to add addon');
        const createdAddon = await res.json();
        setAddons((prevAddons) => [...prevAddons, createdAddon]);
        setError('');
        setAddAddonMessage('Addon created successfully');
        setTimeout(() => setAddAddonMessage(''), 2500);
      } catch (error) {
        setError(`Failed to add addon: ${error.message}`);
      }
    };

    // Function to delete an addon by ID
    const deleteAddon = async (addonId) => {
      try {
        const res = await fetch(`${API_BASE}/addons/${addonId}/`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error('Failed to delete addon');
        // Remove the deleted addon from the state
        setAddons((prevAddons) => prevAddons.filter((addon) => addon.id !== addonId));
        setError('');
        setAddAddonMessage ('Addon deleted successfully');
        setTimeout(() => setAddAddonMessage(''), 2500);
      } catch (error) {
        setError(`Failed to delete addon: ${error.message}`);
      }
    };

    // Handle 'Add Addon' form submission
    const handleAddonSubmit = (e) => {
      e.preventDefault();
      const newAddon = {
        name: addonName,
        duration: parseInt(addonDuration),
        price: parseFloat(addonPrice),
      };
      addAddon(newAddon);
    };
  //#endregion Addons
  return(
    <>
     {/* Add new addon */}
        <div className="box">
          <h2 className="subtitle">Add New Addon</h2>
          {addAddonMessage && <div className="notification is-success">{addAddonMessage}</div>}
          <form onSubmit={handleAddonSubmit}>
            <div className="field">
              <label className="label">Addon Name</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  value={addonName}
                  onChange={(e) => setAddonName(e.target.value)}
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
                  onChange={(e) => setAddonDuration(e.target.value)}
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
                  onChange={(e) => setAddonPrice(e.target.value)}
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

        {/* List of existing addons */}
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