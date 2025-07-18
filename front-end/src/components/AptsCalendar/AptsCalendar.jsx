import { useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import plLocale from '@fullcalendar/core/locales/pl'
import './AptsCalendar.css'

export function AptsCalendar({ barberId }) {
  const [events, setEvents] = useState([])

  useEffect(() => {
    if (!barberId) return
    const token = localStorage.getItem('jwt')
    fetch(`/api/appointments/barber/${barberId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
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
                phone:   a.phoneNumber,
              }
            }
          })
          .filter(Boolean)

        setEvents(evs)
      })
      .catch(err => {
        console.error('Не вдалося загрузити записи:', err)
        setEvents([])
      })
  }, [barberId])

  const renderEventContent = info => {
    const { service, phone } = info.event.extendedProps

    return (
      <div className="fc-event-card">
        <div className="fc-event-client">{info.event.title}</div>
        <div className="fc-event-service">{service}</div>
        <div className="fc-event-time">
          {info.timeText}
        </div>
        <div className="fc-event-phone">{phone}</div>
      </div>
    )
  }
  
  const handleEventDrop = async info => {
    const token = localStorage.getItem('jwt')
    const res = await fetch(`/api/appointments/${info.event.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ scheduled_time: info.event.start.toISOString() })
    })
    if (!res.ok) {
      alert('Помилка зберігання. Відкат')
      info.revert()
    }
  }

  return (
    <FullCalendar
      className="calendar"
      plugins={[timeGridPlugin, interactionPlugin]}
      initialView="timeGridWeek"
      editable    = { true }
      selectable  = { true }
      eventDrop   = { handleEventDrop }
      events      = { events }
      eventContent= { renderEventContent }
      headerToolbar={{
        left:   'prev,next today',
        center: 'title',
        right:  'timeGridDay,timeGridWeek'
      }}
      height="auto"

      locales={[plLocale]}
      locale="pl"
      timeZone="UTC"
      eventTimeFormat={{
        hour:   '2-digit',
        minute: '2-digit',
        hour12: false
      }}

      slotDuration="00:15:00"
      slotLabelInterval="00:15:00"
      snapDuration="00:15:00"
      slotMinTime="09:00:00"

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
  )
}
