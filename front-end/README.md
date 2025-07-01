# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



import { useState, useMemo, useEffect } from 'react';
import classNames from 'classnames';
import './Form.css';

import { barbers } from '../../api/barbers';
import { services } from '../../api/services';
import { additionalServices } from '../../api/additionalServices';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { pl } from 'date-fns/locale';

export const Form = ({ closeModal }) => {
  //#region useStates
  const [barbersList, setBarbersList] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  const [addonsList, setAddonsList] = useState([]);


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

  // const handleDateChange = (date) => {
  //   setSelectedDate(date);
  //   setHasDateError(false);
  // };

  // const handleTimeChange = (e) => {
  //   setSelectedTime(e.target.value);
  //   setHasTimeError(false);
  // };

  //#endregion

  //#region Submit & Fetch
  // const handleSubmit = (event) => {
  //   event.preventDefault();

  //   const isValid =
  //     name &&
  //     isValidPolishPhone(phoneNumber) &&
  //     userId &&
  //     selectedServiceId;

  //   setHasNameError(!name);
  //   setHasPhoneNumberError(!isValidPolishPhone(phoneNumber));
  //   setHasBarberError(!userId);
  //   setHasServiceError(!selectedServiceId);
  //   setHasDateError(!selectedDate);
  //   setHasTimeError(!selectedTime);

  //   if (!isValid || !selectedDate || !selectedTime) return;

  //   const payload = {
  //     name,
  //     phoneNumber,
  //     barberId: userId,
  //     serviceId: selectedServiceId,
  //     addonIds: selectedAddons,
  //     totalDuration,
  //     totalPrice,
  //     date: selectedDate,
  //     time: selectedTime,
  //   };

  //   fetch('http://127.0.0.1:8000/api/appointments', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(payload),
  //   })
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error('Server error');
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       console.log('Success:', data);
  //     })
  //     .catch((error) => {
  //       console.error('Error:', error);
  //     });
  //     console.log('selectedAddons:', selectedAddons);
  // };
  

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/barbers/")
      .then(r => r.json())
      .then(setBarbersList);
    fetch("http://127.0.0.1:8000/api/services/")
      .then(r => r.json())
      .then(setServicesList);
    fetch("http://127.0.0.1:8000/api/additional-services/")
      .then(r => r.json())
      .then(setAddonsList);
  }, []);



  
  const handleSubmit = async (event) => {
  event.preventDefault();
  const token = localStorage.getItem('jwt');

  const isValid =
    name &&
    isValidPolishPhone(phoneNumber) &&
    userId &&
    selectedServiceId;

    setHasNameError(!name);
    setHasPhoneNumberError(!isValidPolishPhone(phoneNumber));
    setHasBarberError(!userId);
    setHasServiceError(!selectedServiceId);
    setHasDateError(!selectedDate);
    setHasTimeError(!selectedTime);

    if (!isValid || !selectedDate || !selectedTime) return;

    const scheduled_time = new Date(`${selectedDate.toISOString().split('T')[0]}T${selectedTime}:00Z`).toISOString();


    const payload = {
      name,
      phoneNumber,
      barberId: userId,
      serviceId: selectedServiceId,
      addonIds: selectedAddons,
      scheduled_time,
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

  
  //#endregion handlers (submit(Errors)) / Fetch

  //#region phone validation
  const isValidPolishPhone = (number) => {
    return /^\+48\d{9}$/.test(number);
  };
  //#endregion phone validation

  // #region Parsing functions
    // Parsing '1h 10min' into minutes
  const parseDurationToMinutes = (durationStr) => {
    const hoursMatch = durationStr.match(/(\d+)\s*h/);
    const minsMatch = durationStr.match(/(\d+)\s*min/);

    const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
    const minutes = minsMatch ? parseInt(minsMatch[1]) : 0;

    return hours * 60 + minutes;
  };

    // Parsing '100,00 zł' into 100.00
  const parsePrice = (priceStr) => {
    return parseFloat(priceStr.replace(',', '.').replace(' zł', '').trim());
  };
  // #endregion Parsing functions

  //#region Memoized services
  const selectedService = useMemo(() => {
    return services[userId]?.find(service => service.id === selectedServiceId) || null;
  }, [userId, selectedServiceId]);

  const selectedAddonObjects = useMemo(() => {
    return additionalServices.filter(addon => selectedAddons.includes(addon.id));
  }, [selectedAddons]);

  const totalDuration = useMemo(() => {
    const base = selectedService ? parseDurationToMinutes(selectedService.duration) : 0;
    const addons = selectedAddonObjects.reduce(
      (acc, addon) => acc + (typeof addon.duration === 'number' ? addon.duration : parseDurationToMinutes(addon.duration)), 0
    );
    return base + addons;
  }, [selectedService, selectedAddonObjects]);

  const totalPrice = useMemo(() => {
    const base = selectedService ? parsePrice(selectedService.price) : 0;
    const addons = selectedAddonObjects.reduce(
      (acc, addon) => acc + parsePrice(addon.price), 0
    );
    return (base + addons);
  }, [selectedService, selectedAddonObjects]);
  //#endregion Memoized services

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
        <label className="label" htmlFor="barber-select">
          Barber
        </label>

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
              {barbers.map((barber) => (
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

                {services[userId]?.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.name} • {service.duration} • {service.price}
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


      {selectedServiceId > 0 && (
       <div className="field">
          <label className="label">Add-ons</label>
          <div className="addons-container">
            {additionalServices.map((addon) => (
              <label className="addon-item" key={addon.id}>
                <input
                  type="checkbox"
                  value={addon.id}
                  checked={selectedAddons.includes(addon.id)}
                  onChange={() => handleAddonToggle(addon.id)}
                />
                <div className="addon-info">
                  <span className="addon-name">{addon.name}</span>
                  <span className="addon-duration">{addon.duration}</span>
                  <span className="addon-price">{addon.price}</span>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {selectedService && (
        <>
          <div className="field">
            <label className="label" htmlFor='date'>Wybierz datę</label>
            <div className="control">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
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
                  onChange={(e) => setSelectedTime(e.target.value)}
                  id='time'
                >
                  <option className='background-color' value="">Godzina</option>
                  {[
                    '11:00', '11:30', '12:00', '12:30',
                    '13:00', '13:30', '14:00', '14:30',
                    '15:00', '15:30', '16:00'
                  ].map((time) => (
                    <option className='background-color' key={time} value={time}>{time}</option>
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
--------------- рабочая версия формы (подтягивает с сервера барберов, услуги и доп услуги) ниже


import { useState, useMemo, useEffect } from 'react';
import classNames from 'classnames';
import './Form.css';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { pl } from 'date-fns/locale';

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

  // const handleDateChange = (date) => {
  //   setSelectedDate(date);
  //   setHasDateError(false);
  // };

  // const handleTimeChange = (e) => {
  //   setSelectedTime(e.target.value);
  //   setHasTimeError(false);
  // };

  //#endregion

  // user fetch
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    fetch('http://127.0.0.1:8000/api/user/', {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(json => {
        if (json.name && json.phone) {
          setName(json.name);
          setPhoneNumber(json.phone);
        }
      })
      .catch(err => {
        console.error('❌ fetch user data error:', err);
      });
  }, []);

  // barbers fetch
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    fetch('http://127.0.0.1:8000/api/barbers/', {
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
    fetch('http://127.0.0.1:8000/api/services/', {
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
    fetch('http://127.0.0.1:8000/api/addons/', {
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('jwt');

    const isValid =
      name &&
      isValidPolishPhone(phoneNumber) &&
      userId &&
      selectedServiceId;

    setHasNameError(!name);
    setHasPhoneNumberError(!isValidPolishPhone(phoneNumber));
    setHasBarberError(!userId);
    setHasServiceError(!selectedServiceId);
    // setHasDateError(!selectedDate);
    // setHasTimeError(!selectedTime);

    if (!isValid || !selectedDate || !selectedTime) return;


    const payload = {
      name,
      phoneNumber,
      barberId: userId,
      serviceId: selectedServiceId,
      addonIds: selectedAddons,
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

  //#region Memoized services
  const servicesForBarber = useMemo(() => {
    return services;
  }, [services]);

  //#region Phone validation
  const isValidPolishPhone = (number) => {
    return /^\+48\d{9}$/.test(number);
  };
  //#endregion phone validation

  // #region Parsing functions
    // Parsing '1h 10min' into minutes
    const parseDurationToMinutes = (durationStr) => {
      const hoursMatch = durationStr.match(/(\d+)\s*h/);
      const minsMatch = durationStr.match(/(\d+)\s*min/);

      const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
      const minutes = minsMatch ? parseInt(minsMatch[1]) : 0;

      return hours * 60 + minutes;
    };

    // Parsing '100,00 zł' into 100.00
    const parsePrice = (priceStr) => {
      return parseFloat(priceStr.replace(',', '.').replace(' zł', '').trim());
    };
  // #endregion Parsing functions

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

      {/*{selectedService && (
        <>
          <div className="field">
            <label className="label" htmlFor='date'>Wybierz datę</label>
            <div className="control">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
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
                  onChange={(e) => setSelectedTime(e.target.value)}
                  id='time'
                >
                  <option className='background-color' value="">Godzina</option>
                  {[
                    '11:00', '11:30', '12:00', '12:30',
                    '13:00', '13:30', '14:00', '14:30',
                    '15:00', '15:30', '16:00'
                  ].map((time) => (
                    <option className='background-color' key={time} value={time}>{time}</option>
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
      )} */}

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



