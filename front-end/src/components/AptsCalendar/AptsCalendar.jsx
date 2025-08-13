import { useState, useEffect } from 'react'
import { API_BASE, getAuthHeaders } from '../../api/config'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import plLocale from '@fullcalendar/core/locales/pl'
import './AptsCalendar.css'

export function AptsCalendar({ barberId, userRole }) {
  const [events, setEvents] = useState([])
  const [draggedEventId, setDraggedEventId] = useState(null);

  const [barbers, setBarbers] = useState([]);
  const [selectedBarberId, setSelectedBarberId] = useState(barberId || '');

  const [inputPhoneNumber, setInputPhoneNumber] = useState('+48');
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Get full list of barbers for admin
  useEffect(() => {
    if (userRole === 'admin') {
      fetch(`${API_BASE}/barbers/`, {
        headers: getAuthHeaders()
      })
        .then(res => res.json())
        .then(data => setBarbers(Array.isArray(data) ? data : (data.barbers || [])))
        .catch(() => setBarbers([]));
    }
  }, [userRole]);

  // Get appointments for selected barber
  useEffect(() => {
    let url;
    if (userRole === 'admin') {
      if (!selectedBarberId) return;
      url = `${API_BASE}/appointments/barber/${selectedBarberId}`;
    } else if (userRole === 'barber') {
      url = `${API_BASE}/appointments/me/barber`;
    } else {
      return;
    }

    fetch(url, {
      headers: getAuthHeaders()
    })
      .then(res => {
        if (!res.ok) throw new Error(`Server error ${res.status}`)
        return res.json()
      })
      .then(data => {
        const evs = data
          .map(a => {
            const start = new Date(a.scheduled_time)
            if (isNaN(start)) return null
            const end = new Date(start.getTime() + (a.total_duration || 0) * 60000)
            return {
              id: a.id.toString(),
              title: a.name,
              start: start,
              end:   end,
              extendedProps: {
                service: a.full_service_title,
                phone:   a.phone_number,
                price:   a.total_price
              }
            }
          })
          .filter(Boolean)
        setEvents(evs)
      })
      .catch(err => {
        console.error('Не вдалося завантажити записи:', err)
        setEvents([])
      })
  }, [selectedBarberId, barberId, userRole]);


  const handleEventDragStart = info => {
    setDraggedEventId(info.event.id);
  };

  const handleEventDragStop = () => {
    setDraggedEventId(null);
  };

  // Handle event drop (rescheduling)
  const handleEventDrop = async info => {
    const appointmentId = info.event.id;
    const scheduledTime = info.event.start.toISOString();

    const payload = {
      appointment_id: Number(appointmentId),
      scheduled_time: scheduledTime
    };

    console.log('PATCH payload:', payload);

    try {
      const res = await fetch(`${API_BASE}/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(payload)
      });

      console.log('PATCH status:', res.status);

      if (!res.ok) {
        const errText = await res.text();
        console.error('PATCH error:', errText);
        alert('Błąd połączenia. Odwracanie zmian.');
        info.revert();
      } else {
        const data = await res.json();
        console.log('PATCH success:', data);
      }
    } catch (err) {
      console.error('PATCH exception:', err);
      alert('Błąd połączenia. Odwracanie zmian.');
      info.revert();
    }
  };

  // Render event card content considering user role
  const renderEventContent = info => {
    const { service, phone, price } = info.event.extendedProps
    const isDragging = draggedEventId === info.event.id;

    return (
      <div className={`fc-event-card${isDragging ? ' fc-event-card--dragging' : ''}`}>
        <div className="fc-event-card-upper">
          <div className="fc-event-client">{info.event.title}</div>

          {userRole === 'admin' && (
            <div className="fc-event-phone">{phone}</div>
          )}
        </div>
        <div className="fc-event-service">{service}</div>

        <div className="fc-event-details">
          <div className="fc-event-time">{info.timeText}</div>
          <div className="fc-event-price">{`Price: ${price} zł`}</div>
        </div>
      </div>
    )
  }

const handleDeleteByPhone = async () => {
  if (!inputPhoneNumber) {
    alert("Wpisz numer telefonu klienta!");
    return;
  }
  setDeleteLoading(true);
  try {
    // Get appointments for the selected barber
    const res = await fetch(`${API_BASE}/appointments/barber/${selectedBarberId || barberId}`, {
      headers: getAuthHeaders()
    });
    const appointments = await res.json();

    // Find upcoming appointments for the given phone number
    const now = new Date();
    const upcoming = appointments
      .filter(a => a.phone_number === inputPhoneNumber && new Date(a.scheduled_time) > now);

    if (upcoming.length === 0) {
      alert("No upcoming appointment found with this phone number.");
      setDeleteLoading(false);
      return;
    }

    // Delete only the nearest upcoming appointment
    const toDelete = upcoming[0];
    const delRes = await fetch(`${API_BASE}/appointments/${toDelete.id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });

    if (delRes.ok) {
      alert("Appointment deleted successfully !");
      setEvents(events => events.filter(ev => ev.id !== toDelete.id.toString()));
      setInputPhoneNumber('+48');
    } else {
      alert("Error deleting appointment.");
    }
  } catch (err) {
    alert("Connection error.");
  }
  setDeleteLoading(false);
};

  return (
    <div>
      {userRole === 'admin' && (
        <div className="field select-barber-box">
          <label className="label select-barber-label">SELECT BARBER</label>
          <div className="control">
            <div className="select is-fullwidth">
              <select
                value={selectedBarberId}
                onChange={e => setSelectedBarberId(e.target.value)}
              >
                <option value="" disabled>Barber</option>
                {barbers.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      <FullCalendar
        className="calendar"
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridDay"
        editable={true}
        selectable={true}
        eventDrop={handleEventDrop}
        eventDragStart={handleEventDragStart}
        eventDragStop={handleEventDragStop}
        events={events}
        eventContent={renderEventContent}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'timeGridDay,timeGridWeek'
        }}
        height="auto"
        locales={[plLocale]}
        locale="pl"
        timeZone="UTC"
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }}
        slotDuration="00:15:00"
        slotLabelInterval="00:15:00"
        snapDuration="00:15:00"
        slotMinTime="09:00:00"
        slotMaxTime="21:00:00"
        viewDidMount={({ el }) => {
          el.querySelectorAll('.fc-toolbar, .fc-header-toolbar').forEach(node => {
            node.style.setProperty('background-color', '#fff', 'important');
          });
          el.querySelectorAll('.fc-col-header-cell').forEach(node => {
            node.style.backgroundColor = '#fff';
            node.style.borderColor     = '#ccc';
            node.style.color     = '#ccc';
          });
          el.querySelectorAll('.fc-timegrid-all-day').forEach(node => {
            node.style.backgroundColor = '#fff';
            node.style.borderColor     = '#ccc';
          });
          el.querySelectorAll('.fc-timegrid-slot-label').forEach(node => {
            node.style.backgroundColor = '#fff';
            node.style.borderColor     = '#ccc';
          });
          el.querySelectorAll('.fc-scrollgrid-section, .fc-scrollgrid').forEach(node => {
            node.style.backgroundColor = '#fff';
          });
          el.querySelectorAll('.fc-timegrid-slot-lane').forEach(node => {
            node.style.backgroundColor = '#fff';
            node.style.borderTop       = '1px solid #ccc';
            node.style.borderRight     = '1px solid #ccc';
          });
        }}
      />

      <div className="delete-by-phone-wrapper">
        <div className="delete-by-phone-box">
          <label className="delete-by-phone-label" htmlFor="delete-phone">
            Delete appointment by phone number:
          </label>
          <div className="delete-by-phone-row">
            <input
              id="delete-phone"
              className="delete-by-phone-input"
              type="tel"
              placeholder="Client phone number"
              value={inputPhoneNumber}
              onChange={e => setInputPhoneNumber(e.target.value)}
              maxLength={13}
              pattern="^\+?\d{9,13}$"
              autoComplete="off"
            />
            <button
              className="delete-by-phone-btn"
              onClick={handleDeleteByPhone}
              disabled={deleteLoading}
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </button>
          </div>
          <p className="delete-by-phone-hint">
            Enter number (e.g. +48500111222). The nearest future appointment will be deleted.
          </p>
        </div>
      </div>

    </div>
    )
}
