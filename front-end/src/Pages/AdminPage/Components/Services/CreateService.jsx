import React, { useState, useEffect } from 'react';
import { API_BASE, getAuthHeaders } from '../../../../api/config';

export default function CreateService({ barbers }) {
  const [services, setServices] = useState([]);
  const [barberServices, setBarberServices] = useState([]);
  const [serviceName, setServiceName] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedBarberId, setSelectedBarberId] = useState('');
  const [serviceDuration, setServiceDuration] = useState('');
  const [addServiceMessage, setAddServiceMessage] = useState('');
  const [assignMessage, setAssignMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_BASE}/services/`, { headers: getAuthHeaders() })
      .then(res => res.json())
      .then(setServices)
      .catch(() => setError('Failed to load services'));

    // Получаем связи для каждого барбера
    Promise.all(
      barbers.map(barber =>
        fetch(`${API_BASE}/barbers/${barber.id}/services`, { headers: getAuthHeaders() })
          .then(res => res.json())
          .then(data => 
            (Array.isArray(data) ? data : []).map(svc => ({
              barber_id: barber.id,
              service_id: svc.service_id ?? svc.id,
              duration: svc.duration,
            }))
          )
          .catch(() => [])
      )
    ).then(results => {
      // results — массив массивов связей, объединяем в один
      setBarberServices(results.flat());
    }).catch(() => setError('Failed to load barber-service links'));
  }, [barbers]);

  // 1. Создание сервиса (без duration)
  const handleCreateService = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API_BASE}/services/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: serviceName,
          price: parseFloat(servicePrice),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Failed to create service');
      }
      const created = await res.json();
      setServices(prev => [...prev, created]);
      setServiceName('');
      setServicePrice('');
      setAddServiceMessage('Service created successfully');
      setTimeout(() => setAddServiceMessage(''), 2000);
    } catch (err) {
      setError('Error creating Service: ' + err.message);
    }
  };

  // 2. Привязка сервиса к барберу с duration
  const handleAssignService = async (e) => {
    e.preventDefault();
    setError('');
    if (!selectedBarberId || !selectedServiceId || !serviceDuration) {
      setError('Choose barber, service and duration');
      return;
    }
    const payload = {
      services: [
        {
          service_id: Number(selectedServiceId),
          duration:   Number(serviceDuration),
        }
      ]
    }
    try {
      const res = await fetch(`${API_BASE}/barbers/${selectedBarberId}/service`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        console.log('POST body:', payload);
        const data = await res.json();
        throw new Error(data.detail || 'Failed to assign service to barber');
      }
      setAssignMessage('Service assigned successfully');
      setTimeout(() => setAssignMessage(''), 2000);

      // Обновить связи
      fetch(`${API_BASE}/barbers/`, { headers: getAuthHeaders() })
        .then(res => res.json())
        .then(barbersData => {
          const allLinks = [];
          barbersData.forEach(barber => {
            (barber.services || []).forEach(svc => {
              allLinks.push({
                barber_id: barber.id,
                service_id: svc.service_id,
                duration: svc.duration,
              });
            });
          });
          setBarberServices(allLinks);
        });

      setSelectedBarberId('');
      setSelectedServiceId('');
      setServiceDuration('');
    } catch (err) {
      setError('Failed to assign service to barber: ' + err.message);
    }
  };

  // Удаление сервиса (и связей)
  const deleteService = async (serviceId) => {
    setError('');
    try {
      const res = await fetch(`${API_BASE}/services/${serviceId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error();
      setServices(prev => prev.filter(s => s.id !== serviceId));
      setBarberServices(prev => prev.filter(bs => bs.service_id !== serviceId));
    } catch {
      setError('Failed to delete service');
    }
  };

  // Удаление связи барбер-сервис
  const deleteBarberService = async (barberId, serviceId) => {
    setError('');
    try {
      const res = await fetch(`${API_BASE}/barbers/${barberId}/service/${serviceId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error();
      setBarberServices(prev => prev.filter(bs => !(bs.barber_id === barberId && bs.service_id === serviceId)));
    } catch {
      setError('Failed to delete barber-service link');
    }
  };

  return (
    <>
      {/* Create Service Form */}
      <div className="box">
        <h2 className="subtitle">Create Service</h2>
        {addServiceMessage && <div className="notification is-success">{addServiceMessage}</div>}
        {error && <div className="notification is-danger">{error}</div>}
        <form onSubmit={handleCreateService}>
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
          <div className="field">
            <label className="label">Price</label>
            <div className="control">
              <input
                className="input"
                type="number"
                value={servicePrice}
                onChange={e => setServicePrice(e.target.value)}
                placeholder="Enter service price"
                required
              />
            </div>
          </div>
          <div className="field">
            <button className="button is-primary" type="submit">
              Create Service
            </button>
          </div>
        </form>
      </div>

      {/* Assign Service to Barber Form */}
      <div className="box">
        <h2 className="subtitle">Assign Service to Barber</h2>
        {assignMessage && <div className="notification is-success">{assignMessage}</div>}
        {error && <div className="notification is-danger">{error}</div>}
        <form onSubmit={handleAssignService}>
          <div className="field">
            <label className="label">Barber</label>
            <div className="control">
              <div className="select">
                <select
                  value={selectedBarberId}
                  onChange={e => setSelectedBarberId(e.target.value)}
                  required
                >
                  <option value="">Select Barber</option>
                  {barbers.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="field">
            <label className="label">Service</label>
            <div className="control">
              <div className="select">
                <select
                  value={selectedServiceId}
                  onChange={e => setSelectedServiceId(e.target.value)}
                  required
                >
                  <option value="">Select Service</option>
                  {services.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.price} zł)</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="field">
            <label className="label">Duration in minutes</label>
            <div className="control">
              <input
                className="input"
                type="number"
                value={serviceDuration}
                onChange={e => setServiceDuration(e.target.value)}
                placeholder="Enter Duration"
                required
              />
            </div>
          </div>
          <div className="field">
            <button className="button is-primary" type="submit">
              Assign Service
            </button>
          </div>
        </form>
      </div>

      {/* Таблица сервисов и связей */}
      <div className="box">
        <h2 className="subtitle">Existing Services</h2>
        <table className="table is-fullwidth is-striped">
          <thead>
            <tr>
              <th>Service Name</th>
              <th>Service Price</th>
              <th>Barbers (duration)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {services.map(service => {
              // Найти всех барберов, которые делают этот сервис
              const assignedBarbers = barberServices
                .filter(bs => bs.service_id === service.id)
                .map(bs => {
                  const barber = barbers.find(b => b.id === bs.barber_id);
                  return barber
                    ? { name: barber.name, duration: bs.duration, barber_id: barber.id }
                    : null;
                })
                .filter(Boolean);

              return (
                <tr key={service.id}>
                  <td>{service.name}</td>
                  <td>{service.price} zł</td>
                  <td>
                    {assignedBarbers.length > 0
                      ? assignedBarbers.map((b, i) => (
                          <span key={i} style={{ marginRight: 12 }}>
                            {b.name} <span style={{ color: '#aaa' }}>({b.duration} min)</span>
                            <button
                              className="button is-small is-danger"
                              style={{ marginLeft: 10 }}
                              onClick={() => deleteBarberService(b.barber_id, service.id)}
                              title="delete"
                            >✕</button>
                          </span>
                        ))
                      : <span className="has-text-grey">Nobody assigned</span>
                    }
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
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}