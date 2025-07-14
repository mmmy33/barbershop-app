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
        console.error('Не удалось загрузить записи:', err)
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
  
  // при перетаскивании события
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
      alert('Ошибка сохранения, откатываю')
      info.revert()
    }
  }

  // выбор пустого слота для создания
  // const handleDateSelect = selectInfo => {
    // здесь можно открывать модалку создания новой записи,
    // передавая selectInfo.start и barberId
  // }

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

      // Шаг в 15 минут для каждой ячейки
      slotDuration="00:15:00"
      // Интервал подписи каждой ячейки (например, показывать время каждые 15 минут)
      slotLabelInterval="00:15:00"
      // При перетаскивании/выборе привязка к шагу 15 минут
      snapDuration="00:15:00"
      slotMinTime="09:00:00"

      viewDidMount={({ el }) => {
        // 1) Верхняя панель с кнопками и заголовком
        el.querySelectorAll('.fc-toolbar, .fc-header-toolbar').forEach(node => {
          node.style.setProperty('background-color', '#fff', 'important');
        });

        // 2) Заголовки дней (Mon, Tue…)
        el.querySelectorAll('.fc-col-header-cell').forEach(node => {
          node.style.backgroundColor = '#fff';
          node.style.borderColor     = '#ccc';
          node.style.color     = '#ccc';
        });

        // 3) All-day-ряд
        el.querySelectorAll('.fc-timegrid-all-day').forEach(node => {
          node.style.backgroundColor = '#fff';
          node.style.borderColor     = '#ccc';
        });

        // 4) Ось времени слева (12am, 1am…)
        el.querySelectorAll('.fc-timegrid-slot-label').forEach(node => {
          node.style.backgroundColor = '#fff';
          node.style.borderColor     = '#ccc';
        });

        // 5) Вся scrollgrid-сетка (т. е. тело календаря с часовыми ячейками)
        el.querySelectorAll('.fc-scrollgrid-section, .fc-scrollgrid').forEach(node => {
          node.style.backgroundColor = '#fff';
        });

        // 6) Сами тайм-ячейки (с разделителями)
        el.querySelectorAll('.fc-timegrid-slot-lane').forEach(node => {
          node.style.backgroundColor = '#fff';
          node.style.borderTop       = '1px solid #ccc';
          node.style.borderRight     = '1px solid #ccc';
        });
      }}
    />
  )
}
