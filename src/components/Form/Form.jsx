import { useState, useMemo } from 'react';
import classNames from 'classnames';

import './Form.css';

import { barbers } from '../../api/barbers';
import { services } from '../../api/services';
import { additionalServices } from '../../api/additionalServices';


export const Form = () => {
  //#region useStates
  const [name, setName] = useState('');
  const [hasNameError, setHasNameError] = useState(false);
  
  const [phoneNumber, setPhoneNumber] = useState('+48');
  const [hasPhoneNumberError, setHasPhoneNumberError] = useState(false);

  const [userId, setUserId] = useState(0);
  const [hasBarberError, setHasBarberError] = useState(false);

  const [selectedServiceId, setSelectedServiceId] = useState(0);
  const [hasServiceError, setHasServiceError] = useState(false);

  const [selectedAddons, setSelectedAddons] = useState([]);

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

  //#endregion

  //#region handlers (submit (Errors)) / Fetch
  const handleSubmit = (event) => {
    event.preventDefault();

    const isValid =
      name &&
      isValidPolishPhone(phoneNumber) &&
      userId &&
      selectedServiceId;

    setHasNameError(!name);
    setHasPhoneNumberError(!isValidPolishPhone(phoneNumber));
    setHasBarberError(!userId);
    setHasServiceError(!selectedServiceId);

    if (!isValid) return;

    const payload = {
      name,
      phoneNumber,
      barberId: userId,
      serviceId: selectedServiceId,
      addonIds: selectedAddons,
      totalDuration,
      totalPrice,
    };

    fetch('/api/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Server error');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };
  //#endregion handlers (submit(Errors)) / Fetch

  //#region phone validation
  const isValidPolishPhone = (number) => {
    return /^\+48\d{9}$/.test(number);
  };
  //#endregion phone validation

  //#region Memoized services
  // Parsing '1h 10min' into minutes
  const parseDurationToMinutes = (durationStr) => {
    const hoursMatch = durationStr.match(/(\d+)h/);
    const minsMatch = durationStr.match(/(\d+)min/);

    const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
    const minutes = minsMatch ? parseInt(minsMatch[1]) : 0;

    return hours * 60 + minutes;
  };

  // Parsing '100,00 zł' into 100.00
  const parsePrice = (priceStr) => {
    return parseFloat(priceStr.replace(',', '.').replace(' zł', '').trim());
  };


  const selectedService = useMemo(() => {
    return services[userId]?.find(service => service.id === selectedServiceId) || null;
  }, [userId, selectedServiceId]);

  const selectedAddonObjects = useMemo(() => {
    return additionalServices.filter(addon => selectedAddons.includes(addon.id));
  }, [selectedAddons]);

  const totalDuration = useMemo(() => {
    const base = selectedService ? parseDurationToMinutes(selectedService.duration) : 0;
    const addons = selectedAddonObjects.reduce(
      (acc, addon) => acc + parseDurationToMinutes(addon.duration), 0
    );
    return base + addons;
  }, [selectedService, selectedAddonObjects]);

  const totalPrice = useMemo(() => {
    const base = selectedService ? parsePrice(selectedService.price) : 0;
    const addons = selectedAddonObjects.reduce(
      (acc, addon) => acc + parsePrice(addon.price), 0
    );
    return (base + addons).toFixed(2);
  }, [selectedService, selectedAddonObjects]);
  //#endregion Memoized services

  return (
    <form 
      action=""
      method='POST'
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
          <p className="help is-danger">Please select a user</p>
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
                id="service-select"
                value={selectedServiceId}
                onChange={handleServiceChange}
              >
                <option value="0" disabled>Select a Service</option>

                {services[userId]?.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.name} – {service.duration} – {service.price}
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
          <div className="control">
            {additionalServices.map((addon) => (
              <label className="checkbox" key={addon.id} style={{ display: 'block', marginBottom: '0.5em' }}>
                <input
                  type="checkbox"
                  value={addon.id}
                  checked={selectedAddons.includes(addon.id)}
                  onChange={() => handleAddonToggle(addon.id)}
                />
                &nbsp;
                {addon.name} – {addon.duration} – {addon.price}
              </label>
            ))}
          </div>
        </div>
      )}

      {selectedService && (
        <div className="box mt-4">
          <p><strong>Total Duration:</strong> {totalDuration} min</p>
          <p><strong>Total Price:</strong> {totalPrice} zł</p>
        </div>
      )}

      <div className="buttons">
        <button type="submit" className="button is-link">
          Submit
        </button>
      </div>
    </form>
  )
}
