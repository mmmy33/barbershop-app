  import { useState, useMemo, useEffect } from 'react';
  import classNames from 'classnames';
  import './Form.css';

  import DatePicker from 'react-datepicker';
  import 'react-datepicker/dist/react-datepicker.css';
  import { pl } from 'date-fns/locale';

  const API_BASE = 'http://127.0.0.1:8000/api';
  const getAuthHeaders = () => ({
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
  });

  const Form = ({ closeModal }) => {
    //#region useStates
    const [barbers, setBarbers] = useState([]);
    const [services, setServices] = useState([]);
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
    const servicesForBarber = useMemo(() => {
      return services;
    }, [services]);

    const totalDuration = useMemo(() => {
      // Суммируем продолжительность основной услуги и всех добавок
      const serviceDuration = services.find(service => service.id === selectedServiceId)?.duration || 0;
      const addonsDuration = selectedAddons.reduce((acc, addonId) => {
        const addon = addons.find(a => a.id === addonId);
        return acc + (addon?.duration || 0);
      }, 0);

      return serviceDuration + addonsDuration;
    }, [selectedServiceId, selectedAddons, services, addons]);

    const totalPrice = useMemo(() => {
      // Суммируем стоимость основной услуги и всех добавок
      const servicePrice = services.find(service => service.id === selectedServiceId)?.price || 0;
      const addonsPrice = selectedAddons.reduce((acc, addonId) => {
        const addon = addons.find(a => a.id === addonId);
        return acc + (addon?.price || 0);
      }, 0);

      return servicePrice + addonsPrice;
    }, [selectedServiceId, selectedAddons, services, addons]);
    //#endregion Memoized services

    //#region handlers (change)
    const handeNameChange = (event) => {
      setName(event.target.value);
      setHasNameError(false);
    };
  
    const handePhoneNumberChange = (event) => {
      setPhoneNumber(event.target.value);
      setHasPhoneNumberError(false);
    };

    const handleBarberChange = (event) => {
      setUserId(+event.target.value);
      setHasBarberError(false);
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

    // user fetch
    useEffect(() => {
      fetch(`${API_BASE}/auth/me/`, { headers: getAuthHeaders() })
        .then(res => res.json())
        .then(json => {
          if (json.name) setName(json.name);
          if (json.phone) setPhoneNumber(json.phone);
        })
        .catch(console.error);
    }, []);

    // barbers fetch
    useEffect(() => {
      const token = localStorage.getItem('jwt');
      fetch(`${API_BASE}/barbers/`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
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
      const token = localStorage.getItem('jwt');
      console.log('JWT для services:', token);
      console.log('GET /api/services/…');
      fetch(`${API_BASE}/services/`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(res => {
          if (!res.ok) throw new Error(`Status ${res.status}`);
          return res.json();
        })
        .then(json => {
          console.log('Services payload:', json);
          // Если API отдаёт массив:
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

    // addons fetch
    useEffect(() => {
      const token = localStorage.getItem('jwt');
      fetch(`${API_BASE}/addons/`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(res => {
          if (!res.ok) throw new Error(`Status ${res.status}`);
          return res.json();
        })
        .then(json => {
          console.log('Addons payload:', json);
          setAddons(json);
        })
        .catch(err => {
          console.error('❌ fetch addons error:', err);
          setAddons([]);
        });
    }, []);

    // 1) Подгружаем расписание и блок-времена, как только знаем barberId
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
          addon_ids: selectedAddons.join(','),
          target_date: selectedDate.toISOString().split('T')[0],
        });

        const res = await fetch(`${API_BASE}/timeslots/available?${qs}`, {
          headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error(`Status ${res.status}`);

        const data = await res.json();
        // ожидаем массив ISO-строк, превращаем их в "HH:MM"
        const rawSlots = Array.isArray(data) ? data : [];
        const pretty = rawSlots.map(dt =>
          dt.split('T')[1].slice(0,5)
        );
        setTimeslots(pretty);
      } catch (e) {
        console.warn('Error fetching available slots:', e);
        setTimeslots([]);
      }
    };

    fetchAvailableSlots();
  }, [userId, selectedServiceId, selectedAddons, selectedDate]);

    //#region Phone validation
    const isValidPolishPhone = (number) => {
      return /^\+48\d{9}$/.test(number);
    };
    //#endregion phone validation

    const handleSubmit = async (event) => {
      event.preventDefault();
      const token = localStorage.getItem('jwt');

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

      const datePart = selectedDate.toISOString().slice(0, 10);

      const payload = {
        name,
        phoneNumber,
        barberId: userId,
        serviceId: selectedServiceId,
        addonIds: selectedAddons,
        scheduled_time: `${datePart}T${selectedTime}:00`,
      };

      if (selectedAddons.length > 0) {
        payload.addonIds = selectedAddons;
      }

      console.log('Payload:', payload);

      try {
        const response = await fetch('http://127.0.0.1:8000/api/appointments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Ошибка при отправке данных');
        }

        const data = await response.json();
        console.log('Успех:', data);
        closeModal();

      } catch (error) {
        console.error('Ошибка:', error);
        alert('Не удалось создать запись. Проверьте данные или повторите позже.');
      }
    };

    return (
      <form
        className="box custom-form"
        onSubmit={handleSubmit}
      >
        <div className="field">
          <label className="label" htmlFor="name">Name</label>
          <div className={classNames('control', {
            'has-icons-right': hasNameError,
          })}>
            <input
              id='name'
              className={classNames('input', {
                'is-danger': hasNameError,
              })}
              type="text"
              placeholder="Name"
              value={name}
              onChange={handeNameChange}
            />

            {hasNameError && (
              <span className="icon is-small is-right">
                <i className="fas fa-exclamation-triangle has-text-danger"></i>
              </span>
            )}

            {hasNameError && (
              <p className="help is-danger">Name is required</p>
            )}
          </div>
        </div>

        <div className="field">
          <label className="label" htmlFor="phone-number">Phone</label>
          <div className={classNames('control', {
            'has-icons-right': hasPhoneNumberError,
          })}>
            <input
              id='phone-number'
              className={classNames('input', {
                'is-danger': hasPhoneNumberError,
              })}
              type="phone"
              placeholder="+48"
              value={phoneNumber}
              onChange={handePhoneNumberChange}
            />

            {hasPhoneNumberError && (
              <p className="help is-danger"> Please enter a valid Polish number ( +48XXXXXXXXX )</p>
            )}
          </div>
        </div>

        <div className="field">
          <label className="label" htmlFor="barber-select">Barber</label>

          <div className="control has-icons-left">
            <div className={classNames('select', {
              'is-danger': hasBarberError,
            })}>
              <select
                id="barber-select"
                value={userId}
                onChange={handleBarberChange}
              >
                <option value="0" disabled>Select a Barber</option>
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
            <p className="help is-danger">Please select a Barber</p>
          )}
        </div>

        {userId > 0 && (
          <div className="field">
            <label className="label" htmlFor="service-select">Service</label>

            <div className="control has-icons-left">
              <div className={classNames('select', {
                'is-danger': hasServiceError,
              })}>
                <select
                  // className='is-fullwidth'
                  id="service-select"
                  value={selectedServiceId}
                  onChange={handleServiceChange}
                >
                  <option value="0" disabled>Select a Service</option>

                  {servicesForBarber.map(svc => (
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
              <p className="help is-danger">Please select a service</p>
            )}
          </div>
        )}

        {selectedServiceId > 0 && addons.length > 0 && (
          <div className="field">
            <label className="label">Add-ons</label>
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

        {selectedServiceId > 0 && (
          <>
            <div className="field">
              <label className="label" htmlFor='date'>Wybierz datę</label>
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
                />
              </div>

              {hasDateError && (
                <p className="help is-danger">Please select a date</p>
              )}
            </div>

            <div className="field">
              <label className="label" htmlFor='time'>Wybierz czas</label>
              <div className="control">
                <div className="select is-fullwidth">
                  <select
                    value={selectedTime}
                    onChange={handleTimeChange}
                    onClick={(e) => setSelectedTime(e.target.value)}
                    id='time'
                  >
                    <option value="">Godzina</option>
                    {timeslots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              {hasTimeError && (
                <p className="help is-danger">Please select time</p>
              )}
            </div>

            <div className="box mt-4">
              <p><strong>Total Duration:</strong> {totalDuration} min</p>
              <p><strong>Total Price:</strong> {totalPrice} zł</p>
            </div>
          </>
        )}

        <div className="buttons">
          <button type="button" className="button is-danger" onClick={closeModal}>
            Close
          </button>

          <button type="submit" className="button is-link">
            Submit
          </button>
        </div>
      </form>
    )
  }

  export default Form;
