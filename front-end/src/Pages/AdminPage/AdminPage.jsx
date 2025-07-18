import './AdminPage.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
// import DatePicker from 'react-datepicker';
// import { pl } from 'date-fns/locale';
import { API_BASE, getAuthHeaders } from '../../api/config';
import { fetchCurrentUser } from '../../api/auth';

export default function AdminPage() {
  const navigate = useNavigate();

  // #region useState
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  const [barbers, setBarbers] = useState([]);
  const [selectedBarberIds, setSelectedBarberIds] = useState([]);

  const [services, setServices] = useState([]);
  const [serviceName, setServiceName] = useState('');
  const [serviceDuration, setServiceDuration] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [addServiceMessage, setAddServiceMessage] = useState('');

  const [addons, setAddons] = useState([]);
  const [addonName, setAddonName] = useState('');
  const [addonDuration, setAddonDuration] = useState('');
  const [addonPrice, setAddonPrice] = useState('');
  const [addAddonMessage, setAddAddonMessage] = useState('');

  // Weekly schedule form state
  const [schedules, setSchedules] = useState([]);
  const [selectedBarberId, setSelectedBarberId] = useState(0);
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState(0);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('20:00');

  const [error, setError] = useState('');
  // #endregion useState

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
      .finally(() => setLoadingUser(false));
  }, []);

  // Barbers fetch
  useEffect(() => {
    if (!loadingUser) {
      fetch(`${API_BASE}/barbers/`, { headers: getAuthHeaders() })
        .then(res => res.json())
        .then(data => setBarbers(Array.isArray(data) ? data : data.barbers || []))
        .catch((err) => {
          console.error('Error loading barbers', err);
          setError('Failed to load barbers');
        });
    }
  }, [loadingUser]);

  //#region Weekly Schedule
    const loadSchedules = (barberId) => {
      fetch(`${API_BASE}/barbers/${barberId}/schedules/`, { headers: getAuthHeaders() })
        .then((res) => res.json())
        .then((data) => setSchedules(data))
        .catch((err) => console.error('Error loading schedules', err));
    };

    // Add schedule
    const addSchedule = () => {
      if (selectedBarberId === 0 || selectedDayOfWeek === 0) { // Проверка на правильный день и барбера
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
        .then(() => {
          loadSchedules(selectedBarberId);
        })
        .catch(() => console.log('Failed to add schedule'));
    };

    // Delete schedule
  const deleteSchedule = async (scheduleId, barberId) => {
    try {
      const response = await fetch(`${API_BASE}/barbers/schedules/${scheduleId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        // Read the error text for debugging
        const errorText = await response.text();
        throw new Error(`Status ${response.status}: ${errorText}`);
      }
      // On success, reload schedules and show message
      await loadSchedules(barberId);
      setError('Schedule deleted successfully');
      setTimeout(() => setError(''), 2500);
      setError('');
    } catch (err) {
      console.error('Error deleting schedule', err);
      setError('Failed to delete schedule');
    }
  };
  //#endregion Weekly Schedule

  //#region Services
    // Services fetch
    useEffect(() => {
      fetch(`${API_BASE}/services/`, { headers: getAuthHeaders() })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          setServices(data);
        })
        .catch(error => console.error('Error fetching services:', error));
    }, []);

    // Function to add a new service
    const handleService = e => {
      e.preventDefault();
      const newService = {
        name: serviceName,
        duration: parseInt(serviceDuration, 10),
        price: parseFloat(servicePrice),
        barbers: selectedBarberIds.map(id => ({ id }))  // или просто [1,2,3], смотря что принимает API
      };
      addService(newService);
    };

    const addService = async serviceData => {
      try {
        const res = await fetch(`${API_BASE}/services/`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(serviceData),
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `Status ${res.status}`);
        }
        const createdService = await res.json();
        setServices(prev => [...prev, createdService]);
        setError('');
        setAddServiceMessage('Created successfully');
        setTimeout(() => setAddServiceMessage(''), 2500);
      } catch (err) {
        console.error('Failed to add service', err);
        setError(`Failed to add service: ${err.message}`);
      }
    };

      // Function to delete a service by ID
    const deleteService = async (serviceId) => {
      try {
        const res = await fetch(`${API_BASE}/services/${serviceId}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error('Failed to delete service');
        setServices((prevServices) => prevServices.filter((service) => service.id !== serviceId));
        setError('');
        setAddServiceMessage('Service deleted successfully');
        setTimeout(() => setAddServiceMessage(''), 2500);
      } catch (error) {
        setError(`Failed to delete service: ${error.message}`);
      }
    };
  //#endregion Services

  //#region barbers gap
  // Локально сохраняем правки gap в стейт
    const handleGapChange = (barberId, gapValue) => {
      setBarbers(prev =>
        prev.map(b =>
          b.id === barberId
            ? { ...b, gap_minutes: Number(gapValue) }
            : b
        )
      );
    };

    // Сохраняем на бэке
    const saveGap = async (barberId) => {
      const barber = barbers.find(b => b.id === barberId);
      try {
        const res = await fetch(`${API_BASE}/barbers/${barberId}/`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({ gap_minutes: barber.gap_minutes })
        });
        if (!res.ok) {
          const { detail } = await res.json();
          throw new Error(detail || `Status ${res.status}`);
        }
        const updated = await res.json();
        setBarbers(prev =>
          prev.map(b => (b.id === barberId ? updated : b))
        );
        setError('');
      } catch (err) {
        console.error('Failed to save gap', err);
        setError(`Could not save gap: ${err.message}`);
      }
    };
  //#endregion barbers gap

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
        const res = await fetch(`${API_BASE}/addons/${addonId}`, {
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


  if (loadingUser) return <div className="container"><p>Loading...</p></div>;
  if (!isAdmin)    return <div className="container"><p>Unauthorized</p></div>;


  return (
    <div className="container">
      <section className="section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 className="title">ADMIN PANEL</h1>
          <button className="button is-link" onClick={() => navigate('/')}>Home</button>
        </div>

        {error && <div className="notification is-danger">{error}</div>}

        {/* Barber Selection and Schedule Form */}
        <div className="box">
          <h2 className="subtitle">Manage Barber Schedules</h2>
          <div className="field">
            <div className="field is-grouped is-flex-wrap-wrap">
              <div className="control">
                <div className="select">
                  <select
                    value={selectedBarberId}
                    onChange={(e) => {
                      const barberId = +e.target.value;
                      setSelectedBarberId(barberId);
                      loadSchedules(barberId);
                    }}
                  >
                    <option value={0}>Select Barber</option>
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
                  <select value={selectedDayOfWeek} onChange={(e) => setSelectedDayOfWeek(+e.target.value)}>
                    <option value={-1}>Select Day</option>
                    {[...Array(7).keys()].map((day) => (
                      <option key={day} value={day}>
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][day]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="control">
                <input
                  className="input"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>

              <div className="control">
                <input
                  className="input"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
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
                        <button className="button is-small is-danger" onClick={() => deleteSchedule(s.id, selectedBarberId)}>
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


        <div className="box">
          <h2 className="subtitle">Add New Service</h2>
          {addServiceMessage && (
            <div className="notification is-success">{addServiceMessage}</div>
          )}

          <form onSubmit={handleService}>
            {/* Service Name */}
            <div className="field">
              <label className="label">Service Name</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  value={serviceName}
                  onChange={e => setServiceName(e.target.value)}
                  placeholder="Enter service name"
                  required
                />
              </div>
            </div>

            {/* Duration */}
            <div className="field">
              <label className="label">Duration (minutes)</label>
              <div className="control">
                <input
                  className="input"
                  type="number"
                  value={serviceDuration}
                  onChange={e => setServiceDuration(e.target.value)}
                  placeholder="Enter service duration"
                  required
                />
              </div>
            </div>

            {/* Price */}
            <div className="field">
              <label className="label">Price</label>
              <div className="control">
                <input
                  className="input"
                  type="number"
                  step="0.01"
                  value={servicePrice}
                  onChange={e => setServicePrice(e.target.value)}
                  placeholder="Enter service price"
                  required
                />
              </div>
            </div>

            {/* Barbers Multiselect */}
            <div className="field">
              <label className="label">Barbers</label>
              <div className="control">
                <div className="select is-multiple">
                  <select
                    multiple
                    size={Math.min(4, barbers.length)}
                    value={selectedBarberIds}
                    onChange={e =>
                      setSelectedBarberIds(
                        Array.from(e.target.selectedOptions, o => Number(o.value))
                      )
                    }
                    required
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

            {/* Submit */}
            <div className="field is-grouped">
              <div className="control">
                <button className="button is-primary" type="submit">
                  Add Service
                </button>
              </div>
            </div>
          </form>
        </div>


        {/* List of existing services */}
        <div className="box">
          <h2 className="subtitle">Existing Services</h2>
          <table className="table is-fullwidth is-striped">
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Duration</th>
                <th>Price</th>
                <th>Barbers</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {services.map(service => (
                <tr key={service.id}>
                  <td>{service.name}</td>
                  <td>{service.duration} min</td>
                  <td>{service.price} zł</td>
                  <td>
                    {service.barbers && service.barbers.length > 0
                      ? service.barbers.map(b => b.name).join(', ')
                      : '—'}
                  </td>
                  <td>
                    <button
                      className="button is-small is-danger"
                      onClick={() => deleteService(service.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Unavailable Times */}
        {/* <div className="box">
          <h2 className="subtitle">Add Unavailable Time</h2>
          <div className="field is-grouped is-flex-wrap-wrap">
            <div className="control"><div className="select">
              <select value={unBarberId} onChange={e => setUnBarberId(+e.target.value)}>
                <option value={0}>Select Barber</option>
                {barbers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select></div>
            </div>
            <div className="control"><DatePicker selected={unDate} onChange={setUnDate} dateFormat="yyyy-MM-dd" className="input" locale={pl} placeholderText="Select date" /></div>
            <div className="control"><input className="input" type="time" value={unStart} onChange={e => setUnStart(e.target.value)} /></div>
            <div className="control"><input className="input" type="time" value={unEnd} onChange={e => setUnEnd(e.target.value)} /></div>
            <div className="control"><input className="input" type="text" placeholder="Reason" value={unReason} onChange={e => setUnReason(e.target.value)} /></div>
            <div className="control"><button className="button is-primary" onClick={addUnavailableTimeForBarber}>Add Unavailable</button></div>
          </div>
          <table className="table is-fullwidth is-striped">
            <thead><tr><th>Barber</th><th>Start</th><th>End</th><th>Reason</th><th>Action</th></tr></thead>
            <tbody>{unavailables.map(u => {
              const barber = barbers.find(b => b.id === u.barber_id);
              return <tr key={u.id}>
                <td>{barber?.name}</td>
                <td>{new Date(u.start_datetime).toLocaleString()}</td>
                <td>{new Date(u.end_datetime).toLocaleString()}</td>
                <td>{u.reason}</td>
                <td><button className="button is-small is-danger" onClick={() => deleteItem('unavailable', u.id)}>Delete</button></td>
              </tr>;
            })}</tbody>
          </table>
        </div> */}

        {/* Add new service */}
        {/* <div className="box">
          <h2 className="subtitle">Add New Service</h2>
          {addServiceMessage && <div className="notification is-success">{addServiceMessage}</div>}
          <form onSubmit={handleService}>
            <div className="field">
              <label className="label">Service Name</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="Enter service name"
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
                  value={serviceDuration}
                  onChange={(e) => setServiceDuration(e.target.value)}
                  placeholder="Enter service duration"
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
                  value={servicePrice}
                  onChange={(e) => setServicePrice(e.target.value)}
                  placeholder="Enter service price"
                  required
                />
              </div>
            </div>

            <div className="field is-grouped">
              <div className="control">
                <button className="button is-primary" onClick={handleService}>
                  Add Service
                </button>
              </div>
            </div>
          </form>
        </div> */}



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

        <div className="box">
          <h2 className="subtitle">Barbers — set gap between appointments</h2>
          <table className="table is-fullwidth is-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Gap (minutes)</th>
              </tr>
            </thead>
            <tbody>
              {barbers.map(barber => (
                <tr key={barber.id}>
                  <td>{barber.name}</td>
                  <td>
                    <input
                      type="number"
                      value={barber.gap_minutes}
                      min={0}
                      className="input is-small"
                      onChange={e => handleGapChange(barber.id, e.target.value)}
                      onBlur={() => saveGap(barber.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
