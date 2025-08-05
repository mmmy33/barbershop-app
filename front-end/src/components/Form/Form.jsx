import { useState, useMemo, useEffect } from 'react';
import { API_BASE, getAuthHeaders } from '../../api/config';
import classNames from 'classnames';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { pl } from 'date-fns/locale';
import './Form.css';

export const Form = ({ closeModal, onSuccess }) => {
  const token = localStorage.getItem('jwt');

  fetch('http://127.0.0.1:8000/api/auth/me', {
    headers: {
      Authorization: 'Bearer ' + token // access_token — ваш JWT токен
    }
  })
  .then(res => res.json())
  .then(data => {
    console.log(data.role); // здесь будет роль: "admin", "barber", "user" и т.д.
  });

  //#region useStates
  const [barbers, setBarbers] = useState([]);

  const [services, setServices] = useState([]);
  const [servicesForBarber, setServicesForBarber] = useState([]);

  const [addons, setAddons] = useState([]);

  const [timeslots, setTimeslots] = useState([]);

  const [name, setName] = useState('');
  const [hasNameError, setHasNameError] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState('+48');
  const [hasPhoneNumberError, setHasPhoneNumberError] = useState(false);

  const [userId, setUserId] = useState(0);
  const [hasBarberError, setHasBarberError] = useState(false);

  const [selectedServiceId, setSelectedServiceId] = useState(0);
  const [hasServiceError, setHasServiceError] = useState(false);

  const [selectedAddons, setSelectedAddons] = useState([]);

  const [selectedDate, setSelectedDate] = useState(null);
  const [hasDateError, setHasDateError] = useState(false);

  const [selectedTime, setSelectedTime] = useState('');
  const [hasTimeError, setHasTimeError] = useState(false);
  //#endregion useStates

  //#region Memoized services
  const mergedServicesForBarber = useMemo(() => {
    // servicesForBarber: [{ service_id, duration }]
    // services: [{ id, name, price }]
    return servicesForBarber.map(barberSvc => {
      const svc = services.find(s => Number(s.id) === Number(barberSvc.service_id));
      return svc
        ? {
            id: svc.id,
            name: svc.name,
            price: svc.price,
            duration: barberSvc.duration
          }
        : null;
    }).filter(Boolean);
  }, [servicesForBarber, services]);

  const totalDuration = useMemo(() => {
    const serviceDuration = mergedServicesForBarber.find(service => service.id === selectedServiceId)?.duration || 0;
    const addonsDuration = selectedAddons.reduce((acc, addonId) => {
      const addon = addons.find(a => a.id === addonId);
      return acc + (addon?.duration || 0);
    }, 0);

    return serviceDuration + addonsDuration;
  }, [selectedServiceId, selectedAddons, mergedServicesForBarber, addons]);

  const totalPrice = useMemo(() => {
    const servicePrice = mergedServicesForBarber.find(service => service.id === selectedServiceId)?.price || 0;
    const addonsPrice = selectedAddons.reduce((acc, addonId) => {
      const addon = addons.find(a => a.id === addonId);
      return acc + (addon?.price || 0);
    }, 0);

    return servicePrice + addonsPrice;
  }, [selectedServiceId, selectedAddons, mergedServicesForBarber, addons]);
  //#endregion Memoized services

  //#region handlers (change)
  const handleNameChange = (event) => {
    setName(event.target.value);
    setHasNameError(false);
  };

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
    setHasPhoneNumberError(false);
  };

  const handleBarberChange = (event) => {
    setUserId(+event.target.value);
    setHasBarberError(false);
    setSelectedServiceId(0);
  };

  const handleServiceChange = (event) => {
    setSelectedServiceId(+event.target.value);
    setHasServiceError(false);
  };

  const handleAddonToggle = (addonId) => {
    setSelectedAddons(prev => 
      prev.includes(addonId)
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setHasDateError(false);
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
    setHasTimeError(false);
  };
  //#endregion

  //#region functions
  const isValidPolishPhone = (number) => {
    return /^\+48\d{9}$/.test(number);
  };

  function formatLocalDate(date) {
    const pad = n => String(n).padStart(2, '0');
    const year  = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day   = pad(date.getDate());
    return `${year}-${month}-${day}`;
  }
  //#endregion

  // #region fetches
    // user fetch
    useEffect(() => {
      fetch(`${API_BASE}/auth/me`, { headers: getAuthHeaders() })
        .then(res => res.json())
        .then(json => {
          if (json.name) setName(json.name);
          if (json.phone) setPhoneNumber(json.phone);
        })
        .catch(console.error);
    }, []);

    // barbers fetch
    useEffect(() => {
      fetch(`${API_BASE}/barbers/`, { headers: getAuthHeaders() })
        .then(res => {
          return res.json();
        })
        .then(json => {
          setBarbers(Array.isArray(json) ? json : (json.barbers || []));
        })
        .catch(err => {
          console.error('❌ fetch barbers dropped down:', err);
          setBarbers([]);
        });
    }, []);

    // services fetch
    useEffect(() => {
      fetch(`${API_BASE}/services/`, { headers: getAuthHeaders() })
        .then(res => {
          if (!res.ok) throw new Error(`Status ${res.status}`);
          return res.json();
        })
        .then(json => {
          const list = Array.isArray(json)
            ? json
            : (json.services ?? json.data ?? []);
          setServices(list);
        })
        .catch(err => {
          console.error('❌ fetch services error:', err);
          setServices([]);
        });
    }, []);

    // services for barber fetch
    useEffect(() => {
      if (!userId) {
        setServicesForBarber([]);
        return;
      }
      fetch(`${API_BASE}/barbers/${userId}/services`, { headers: getAuthHeaders() })
      .then(res => res.json())
      .then(json => {
        // json could be array or an object with .services
        const list = Array.isArray(json) ? json : (json.services ?? json.data ?? []);
        setServicesForBarber(list);
      })
      .catch(err => {
        console.error('❌ fetch services for barber error:', err);
        setServicesForBarber([]);
      });
    }, [userId]);

    // Addons fetch
    useEffect(() => {
      fetch(`${API_BASE}/addons/`, { headers: getAuthHeaders() })
        .then(res => {
          if (!res.ok) throw new Error(`Status ${res.status}`);
          return res.json();
        })
        .then(json => {
          setAddons(json);
        })
        .catch(err => {
          console.error('❌ fetch addons error:', err);
          setAddons([]);
        });
    }, []);

    // Timeslots fetch
    useEffect(() => {
    if (!(userId && selectedServiceId && selectedDate)) {
      setTimeslots([]);
      return;
    }

    const fetchAvailableSlots = async () => {
      try {
        const qs = new URLSearchParams({
          barber_id: userId,
          service_id: selectedServiceId,
          addon_ids: selectedAddons.length ? selectedAddons.join(',') : "",
          target_date: formatLocalDate(selectedDate),
        });

        const res = await fetch(`${API_BASE}/timeslots/available?${qs}`,
          { headers: getAuthHeaders() });
        if (!res.ok) {
          const err = await res.json();
          console.error("Slots fetch failed:", err);
          throw new Error(`Slots fetch status ${res.status}`);
        }

        const data = await res.json();
        const rawSlots = Array.isArray(data) ? data : [];
        const pretty = rawSlots.map(dt =>
          dt.split('T')[1].slice(0,5)
        );

        const now = new Date();
        const isToday = formatLocalDate(selectedDate) === formatLocalDate(now);

        const filtered = isToday
          ? pretty.filter(timeStr => {
              const [h, m] = timeStr.split(':');
              const slotDate = new Date(selectedDate);
              slotDate.setHours(Number(h), Number(m), 0, 0);
              return slotDate > now;
            })
          : pretty;

        setTimeslots(filtered);

        // setTimeslots(pretty);
      } catch (e) {
        console.warn('Error fetching available slots:', e);
        setTimeslots([]);
      }
    };

    fetchAvailableSlots();
    }, [userId, selectedServiceId, selectedAddons, selectedDate]);
  // #endregion fetches


  const handleSubmit = async (event) => {
    event.preventDefault();

    const isValid =
      name &&
      isValidPolishPhone(phoneNumber) &&
      userId &&
      selectedServiceId &&
      selectedTime;

    setHasNameError(!name);
    setHasPhoneNumberError(!isValidPolishPhone(phoneNumber));
    setHasBarberError(!userId);
    setHasServiceError(!selectedServiceId);
    setHasDateError(!selectedDate);
    setHasTimeError(!selectedTime);

    if (!isValid || !selectedDate || !selectedTime) return;

    const datePart = formatLocalDate(selectedDate);

    const payload = {
      name,
      phone_number: phoneNumber,
      barberId: userId,
      serviceId: selectedServiceId,
      addonIds: selectedAddons,
      scheduled_time: `${datePart}T${selectedTime}:00`,
    };

    if (selectedAddons.length > 0) {
      payload.addonIds = selectedAddons;
    }

    try {
      const response = await fetch(`${API_BASE}/appointments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Appointment error:', errorData);
        throw new Error(`Error ${response.status}`);
      }

      const data = await response.json();

      const dt = new Date(data.scheduled_time);
      const datetime = dt.toLocaleString('pl-PL', {
        day:   'numeric',
        month: 'long',
        hour:  '2-digit',
        minute:'2-digit',
        timeZone: 'UTC'
      });

      closeModal();

      if (onSuccess) {
        setTimeout(() => {
          onSuccess({ datetime });
        }, 0);
      }
    } catch (error) {
      console.error(error);
      alert('Błąd podczas rezerwacji: Wybierz inny termin(lub inną godzinę) lub skontaktuj się z nami.');
    }
  };

  return (
    <>
        <form
          className="box custom-form"
          onSubmit={handleSubmit}
        >
          <div className="field">
            <label className="label" htmlFor="name">Imię</label>
            <div className={classNames('control', {
              'has-icons-right': hasNameError,
            })}>
              <input
                id='name'
                className={classNames('input', {
                  'is-danger': hasNameError,
                })}
                type="text"
                placeholder={name ? name : 'Wpisz swoje imię'}
                value={name}
                onChange={handleNameChange}
              />

              {hasNameError && (
                <span className="icon is-small is-right">
                  <i className="fas fa-exclamation-triangle has-text-danger"></i>
                </span>
              )}

              {hasNameError && (
                <p className="help is-danger">Imię jest wymagane</p>
              )}
            </div>
          </div>

          <div className="field">
            <label className="label" htmlFor="phone-number">Telefon</label>
            <div className={classNames('control', {
              'has-icons-right': hasPhoneNumberError,
            })}>
              <input
                id='phone-number'
                className={classNames('input', {
                  'is-danger': hasPhoneNumberError,
                })}
                type="tel"
                placeholder={setPhoneNumber}
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
              />

              {hasPhoneNumberError && (
                <p className="help is-danger">Telefon jest wymagany ( +48XXXXXXXXX )</p>
              )}
            </div>
          </div>

          <div className="field">
            <label className="label" htmlFor="barber-select">Barber</label>

            <div className="control has-icons-left choose-barber">
              <div className={classNames('select', {
                'is-danger': hasBarberError,
              })}>
                <select
                  id="barber-select"
                  value={userId}
                  onChange={handleBarberChange}
                >
                  <option value="0" disabled>Wybierz Barbera</option>
                  {barbers.map(barber => (
                    <option key={barber.id} value={barber.id}>
                      {barber.name}
                    </option>
                  ))}
                </select>
              </div>

              <span className="icon is-small is-left">
                <i className="fas fa-user"></i>
              </span>
            </div>

            {hasBarberError && (
              <p className="help is-danger">Proszę wybrać Barbera</p>
            )}
          </div>

          {userId > 0 && (
            <>
              <div className="field">
                <label className="label" htmlFor="service-select">Service</label>

                <div className="control has-icons-left">
                  <div className={classNames('select', {
                    'is-danger': hasServiceError,
                  })}
                  
                  >
                    <select
                      id="service-select"
                      value={selectedServiceId}
                      onChange={handleServiceChange}
                    >
                      <option value="0" disabled>Wybierz usługę</option>

                      {mergedServicesForBarber.map(svc => (
                        <option key={svc.id} value={svc.id}>
                          {svc.name} • {svc.duration} min • {svc.price} zl
                        </option>
                      ))}
                    </select>
                  </div>

                  <span className="icon is-small is-left">
                    <i className="fas fa-cut"></i>
                  </span>
                </div>

                {hasServiceError && (
                  <p className="help is-danger">Proszę wybrać usługę</p>
                )}
              </div>

              {addons.length > 0 && (
                <div className="field">
                  <label className="label">Addons</label>
                  <div className="addons-container">
                    {addons.map(addon => (
                      <label className="addon-item" key={addon.id}>
                        <input
                          type="checkbox"
                          checked={selectedAddons.includes(addon.id)}
                          onChange={() => handleAddonToggle(addon.id)}
                        />
                        <div className="addon-info">
                          <span className="addon-name">{addon.name}</span>
                          <span className="addon-duration">{addon.duration} min</span>
                          <span className="addon-price">{addon.price} zl</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {selectedServiceId > 0 && (
            <div className="field">
              <label className="label" htmlFor='date'>Data</label>
              <div className="control">
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  onClick={(date) => setSelectedDate(date)}
                  dateFormat="dd MMMM yyyy"
                  placeholderText="Kliknij, aby wybrać"
                  minDate={new Date()}
                  className="input"
                  calendarStartDay={1}
                  locale={pl}
                  id='date'
                  popperPlacement="bottom-start"
                  popperModifiers={[
                    {
                      name: 'flip',
                      options: {
                        fallbackPlacements: [],
                      },
                    },
                    {
                      name: 'preventOverflow',
                      options: {
                        boundary: 'viewport'
                      }
                    }
                  ]}
                  showPopperArrow={false}
                  inputMode="none"
                />
              </div>

              {hasDateError && (
                <p className="help is-danger">Proszę wybrać datę</p>
              )}
            </div>
          )}

          {selectedDate && (
            <div className="field">
              <label className="label" htmlFor='time'>Czas</label>
              <div className="control">
                <div className="select is-fullwidth">
                  <select
                    value={selectedTime}
                    onChange={handleTimeChange}
                    id='time'
                    disabled={timeslots.length === 0}
                  >
                    {timeslots.length === 0 ? (
                      <option style={{ color: '#ff0000' }} disabled>
                        Brak dostępnych terminów
                      </option>
                    ) : (
                      <>
                        <option value="">Godzina</option>
                        {timeslots.map((slot) => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </>
                    )}
                  </select>
                </div>
              </div>

              {hasTimeError && (
                <p className="help is-danger">Proszę wybrać czas</p>
              )}
            </div>
          )}

          <div className="box mt-4">
            <p className="total-label">Total Duration: {totalDuration} min</p>
            <p className="total-label">Total Price: {totalPrice} zł</p>
          </div>

          <div className="buttons">
            <button type="button" className="button form-cancel-button" onClick={closeModal}>
              Close
            </button>

            <button type="submit" className="button form-submit-button">
              Submit
            </button>
          </div>
        </form>
      
    </>
  )
}
