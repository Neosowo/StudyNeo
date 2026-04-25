import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import { ChevronLeft, ChevronRight, Plus, Trash2, Calendar as CalendarIcon, X, Clock } from 'lucide-react'
import { storage, KEYS } from '../utils/storage'

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const WDAYS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do']

export default function Schedule({ integrated = false }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState(() => storage.get(KEYS.EVENTS, []))
  const [todos, setTodos] = useState(() => storage.get(KEYS.TODOS, []))
  const [selectedDay, setSelectedDay] = useState(null)
  const [isAddingEvent, setIsAddingEvent] = useState(false)
  const [newEvent, setNewEvent] = useState({ title: '', time: '08:00', endTime: '09:00', type: 'study', priority: 'medium' })
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [viewMode, setViewMode] = useState('month') // 'month', 'week', 'day'
  const fsRef = useRef(null)

  useEffect(() => {
    if (isFullScreen && fsRef.current) {
      gsap.fromTo(fsRef.current, 
        { opacity: 0, scale: 0.95 }, 
        { opacity: 1, scale: 1, duration: 0.5, ease: 'expo.out' }
      )
    }
  }, [isFullScreen])

  const closeFullScreen = () => {
    gsap.to(fsRef.current, { 
      opacity: 0, 
      scale: 0.95, 
      duration: 0.3, 
      ease: 'power2.in',
      onComplete: () => {
        setIsFullScreen(false)
        setViewMode('month')
      }
    })
  }

  // --- Navigation Logic ---
  const nav = (dir) => {
    const next = new Date(currentDate)
    if (viewMode === 'month') next.setMonth(currentDate.getMonth() + dir)
    else if (viewMode === 'week') next.setDate(currentDate.getDate() + (dir * 7))
    else if (viewMode === 'day') next.setDate(currentDate.getDate() + dir)
    setCurrentDate(next)
  }
  const prev = () => nav(-1)
  const next = () => nav(1)
  const goToToday = () => setCurrentDate(new Date())

  useEffect(() => {
    storage.set(KEYS.EVENTS, events)
  }, [events])

  const viewYear = currentDate.getFullYear()
  const viewMonth = currentDate.getMonth()

  const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate()
  const firstWeekDay = (y, m) => {
    const d = new Date(y, m, 1).getDay()
    return d === 0 ? 6 : d - 1
  }

  const prevMonth = prev
  const nextMonth = next

  const dias = daysInMonth(viewYear, viewMonth)
  const gaps = firstWeekDay(viewYear, viewMonth)

  const isToday = (d) => {
    const now = new Date()
    return viewYear === now.getFullYear() && viewMonth === now.getMonth() && d === now.getDate()
  }

  const getEventsForDay = (d, m = viewMonth, y = viewYear) => {
    const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    
    // Regular events
    const dayEvents = events.filter(e => e.date === dateStr).map(e => ({ ...e, isTask: false }))
    
    // Tasks from TodoList
    const dayTasks = todos.filter(t => {
      if (!t.dueDate) return false
      const td = new Date(t.dueDate)
      return td.getFullYear() === y && td.getMonth() === m && td.getDate() === d
    }).map(t => ({
      id: `task-${t.id}`,
      title: t.text,
      time: t.dueDate.includes('T') ? t.dueDate.split('T')[1].substring(0, 5) : '00:00',
      endTime: null,
      type: 'todo',
      completed: t.done,
      priority: t.priority,
      isTask: true
    }))

    return [...dayEvents, ...dayTasks].sort((a, b) => a.time.localeCompare(b.time))
  }

  // --- Week Helpers ---
  const getWeekDays = (base) => {
    const d = new Date(base)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) // start Monday
    const monday = new Date(d.setDate(diff))
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(monday)
      day.setDate(monday.getDate() + i)
      return day
    })
  }

  const HOURS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`)

  const handleAddEvent = () => {
    if (!newEvent.title.trim() || !selectedDay) return
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`
    const event = {
      id: Date.now(),
      date: dateStr,
      completed: false,
      ...newEvent
    }
    setEvents([...events, event])
    setNewEvent({ title: '', time: '08:00', endTime: '09:00', type: 'study', priority: 'medium' })
    setIsAddingEvent(false)
  }

  const toggleEventComplete = (id) => {
    setEvents(events.map(e => e.id === id ? { ...e, completed: !e.completed } : e))
  }

  const handleDeleteEvent = (id) => {
    if (confirm('¿Eliminar este evento?')) {
      setEvents(events.filter(e => e.id !== id))
    }
  }

  const selectedDateStr = selectedDay ? `${selectedDay} de ${MONTHS[viewMonth]}` : ''

  return (
    <div className={`schedule-container ${integrated ? 'integrated' : 'animate-blur'}`}>
      {integrated ? (
        <div className="calendar-integrated-nav">
          <div className="nav-left">
            <button className="icon-btn" onClick={prevMonth}><ChevronLeft size={14} /></button>
            <span className="calendar-current-month">{MONTHS[viewMonth]} {viewYear}</span>
            <button className="icon-btn" onClick={nextMonth}><ChevronRight size={14} /></button>
          </div>
          <button className="expand-btn" onClick={() => setIsFullScreen(true)}>
            <Plus size={14} /> Expandir
          </button>
        </div>
      ) : (
        <div className="schedule-header">
          <div className="header-title">
            <CalendarIcon size={18} className="empty-icon" />
            <h2>Calendario</h2>
          </div>
          <div className="header-actions">
            <button className="icon-btn" onClick={prevMonth}><ChevronLeft size={16} /></button>
            <span className="calendar-current-month">{MONTHS[viewMonth]} {viewYear}</span>
            <button className="icon-btn" onClick={nextMonth}><ChevronRight size={16} /></button>
          </div>
        </div>
      )}

      <div className="calendar-grid-container">
        <div className="calendar-week-header">
          {WDAYS.map(d => <div key={d} className="calendar-weekday">{d}</div>)}
        </div>
        <div className="calendar-days-grid">
          {Array.from({ length: gaps }, (_, i) => <div key={`g${i}`} className="calendar-day empty" />)}
          {Array.from({ length: dias }, (_, i) => {
            const d = i + 1
            const dayEvents = getEventsForDay(d)
            const hasEvents = dayEvents.length > 0
            const exams = dayEvents.filter(e => e.type === 'exam')
            const studyLoad = Math.min(dayEvents.length * 0.1, 0.4) // max 40% opacity
            
            return (
              <div
                key={d}
                className={`calendar-day ${isToday(d) ? 'today' : ''} ${selectedDay === d ? 'selected' : ''} ${hasEvents ? 'has-events' : ''} ${exams.length > 0 ? 'has-exam' : ''}`}
                style={hasEvents && selectedDay !== d ? { background: `rgba(167, 139, 250, ${studyLoad})` } : {}}
                onClick={() => {
                  setSelectedDay(d)
                  setIsAddingEvent(false)
                }}
              >
                <span className="day-num">{d}</span>
                {hasEvents && (
                  <div className="day-event-indicators">
                    {dayEvents.slice(0, 3).map(e => (
                      <span key={e.id} className={`event-dot ${e.type}`} />
                    ))}
                    {dayEvents.length > 3 && <span className="event-more-count">+{dayEvents.length - 3}</span>}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {selectedDay && (
        <div className="calendar-details animate-slide">
          <div className="details-header">
            <h3>Eventos del {selectedDateStr}</h3>
            <button className="icon-btn" onClick={() => setSelectedDay(null)}><X size={16} /></button>
          </div>

          <div className="events-list">
            {getEventsForDay(selectedDay).length === 0 ? (
              <div className="no-events-msg">No hay eventos programados.</div>
            ) : (
              getEventsForDay(selectedDay).map(e => (
                <div key={e.id} className={`calendar-event-card ${e.type} ${e.completed ? 'completed' : ''} ${e.isTask ? 'is-task' : ''}`}>
                  <button 
                    className={`event-checkbox ${e.completed ? 'checked' : ''}`}
                    onClick={(ev) => { ev.stopPropagation(); !e.isTask && toggleEventComplete(e.id); }}
                  />
                  <div className="event-time">
                    <Clock size={12} /> {e.time}{e.endTime ? ` - ${e.endTime}` : ''}
                  </div>
                  <div className="event-content">
                    <div className="event-title">{e.title} {e.isTask && <span className="task-label">Tarea</span>}</div>
                  </div>
                  {!e.isTask && (
                    <button className="event-delete-btn" onClick={(ev) => { ev.stopPropagation(); handleDeleteEvent(e.id); }}>
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {!isAddingEvent ? (
            <button className="add-event-trigger" onClick={() => setIsAddingEvent(true)}>
              <Plus size={16} /> Nuevo Evento
            </button>
          ) : (
            <div className="add-event-form animate-scale">
              <input
                type="text"
                className="event-input"
                placeholder="Título del evento..."
                value={newEvent.title}
                onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                autoFocus
              />
              <div className="form-row">
                <div className="input-group">
                  <label>Desde</label>
                  <input
                    type="time"
                    className="event-input"
                    value={newEvent.time}
                    onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}
                  />
                </div>
                <div className="input-group">
                  <label>Hasta</label>
                  <input
                    type="time"
                    className="event-input"
                    value={newEvent.endTime}
                    onChange={e => setNewEvent({ ...newEvent, endTime: e.target.value })}
                  />
                </div>
                <div className="input-group">
                  <label>Tipo</label>
                  <select
                    className="event-select"
                    value={newEvent.type}
                    onChange={e => setNewEvent({ ...newEvent, type: e.target.value })}
                  >
                    <option value="study">Estudio</option>
                    <option value="work">Trabajo</option>
                    <option value="exam">Examen 🔥</option>
                    <option value="personal">Personal</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="input-group">
                  <label>Prioridad</label>
                  <div className="priority-selector">
                    {['low', 'medium', 'high'].map(p => (
                      <button
                        key={p}
                        className={`prio-btn ${p} ${newEvent.priority === p ? 'active' : ''}`}
                        onClick={() => setNewEvent({ ...newEvent, priority: p })}
                      >
                        {p === 'low' ? 'Baja' : p === 'medium' ? 'Media' : 'Alta'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="form-btns">
                <button className="btn-cancel" onClick={() => setIsAddingEvent(false)}>Cancelar</button>
                <button className="btn-save" onClick={handleAddEvent}>Guardar</button>
              </div>
            </div>
          )}
        </div>
      )}
      {/* --- Full Screen Modal (Portal) --- */}
      {isFullScreen && createPortal(
        <div className="calendar-fullscreen-overlay" ref={fsRef}>
          <div className="fs-calendar-container">
            <div className="fs-header">
              <div className="fs-header-left">
                <CalendarIcon size={24} className="accent-icon" />
                <h1>StudyNeo Calendar</h1>
                <button className="fs-today-btn" onClick={goToToday}>Hoy</button>
                <div className="fs-nav">
                  <button className="fs-nav-btn" onClick={prev}><ChevronLeft size={20}/></button>
                  <span className="fs-month-label">
                    {viewMode === 'day' ? `${currentDate.getDate()} ${MONTHS[viewMonth]}` : `${MONTHS[viewMonth]} ${viewYear}`}
                  </span>
                  <button className="fs-nav-btn" onClick={next}><ChevronRight size={20}/></button>
                </div>
              </div>

              <div className="fs-header-right">
                <div className="fs-view-switcher">
                  <button className={viewMode === 'month' ? 'active' : ''} onClick={() => setViewMode('month')}>Mes</button>
                  <button className={viewMode === 'week' ? 'active' : ''} onClick={() => setViewMode('week')}>Semana</button>
                  <button className={viewMode === 'day' ? 'active' : ''} onClick={() => setViewMode('day')}>Día</button>
                </div>
                <button className="fs-close-btn" onClick={closeFullScreen}>
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="fs-body">
              {viewMode === 'month' && (
                <>
                  <div className="fs-grid-header">
                    {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => (
                      <div key={d} className="fs-weekday">{d}</div>
                    ))}
                  </div>
                  <div className="fs-grid">
                    {Array.from({ length: gaps }, (_, i) => <div key={`fg${i}`} className="fs-day empty" />)}
                    {Array.from({ length: dias }, (_, i) => {
                      const d = i + 1
                      const dayEvents = getEventsForDay(d)
                      return (
                        <div 
                          key={d} 
                          className={`fs-day ${isToday(d) ? 'today' : ''}`}
                          onClick={() => { setSelectedDay(d); closeFullScreen(); }}
                        >
                          <span className="fs-day-num">{d}</span>
                          <div className="fs-events-list">
                            {dayEvents.slice(0, 4).map(e => (
                              <div key={e.id} className={`fs-event-pill ${e.type} ${e.completed ? 'completed' : ''}`}>
                                <span className="fs-event-time">{e.time}</span>
                                <span className="fs-event-title">{e.title}</span>
                              </div>
                            ))}
                            {dayEvents.length > 4 && (
                              <div className="fs-more-events">+{dayEvents.length - 4} más</div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </>
              )}

              {viewMode === 'week' && (
                <div className="fs-time-grid-container">
                  <div className="fs-time-header">
                    <div className="fs-time-col-label" />
                    {getWeekDays(currentDate).map(d => (
                      <div key={d} className={`fs-time-header-day ${d.toDateString() === new Date().toDateString() ? 'today' : ''}`}>
                        <span className="day-name">{['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'][d.getDay()]}</span>
                        <span className="day-num">{d.getDate()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="fs-time-body">
                    <div className="fs-hour-labels">
                      {HOURS.map(h => <div key={h} className="fs-hour-label">{h}</div>)}
                    </div>
                    <div className="fs-week-columns">
                      {getWeekDays(currentDate).map((dayDate, i) => {
                        const dayEvs = getEventsForDay(dayDate.getDate(), dayDate.getMonth(), dayDate.getFullYear())
                        return (
                          <div key={i} className="fs-week-col">
                            {HOURS.map(h => <div key={h} className="fs-hour-slot" />)}
                            {dayEvs.map(e => {
                              const [h, m] = e.time.split(':').map(Number)
                              const [eh, em] = (e.endTime || e.time).split(':').map(Number)
                              const top = (h * 60 + m)
                              const duration = (eh * 60 + em) - (h * 60 + m)
                              const height = Math.max(duration, 40) // min 40px

                              return (
                                <div key={e.id} className={`fs-event-timed ${e.type}`} style={{ top: `${top}px`, height: `${height}px` }}>
                                  <div className="event-time">{e.time}{e.endTime ? ` - ${e.endTime}` : ''}</div>
                                  <div className="event-title">{e.title}</div>
                                </div>
                              )
                            })}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {viewMode === 'day' && (
                <div className="fs-time-grid-container single-day">
                  <div className="fs-time-header">
                    <div className="fs-time-col-label" />
                    <div className="fs-time-header-day today">
                      <span className="day-name">{['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'][currentDate.getDay()]}</span>
                      <span className="day-num">{currentDate.getDate()}</span>
                    </div>
                  </div>
                  <div className="fs-time-body">
                    <div className="fs-hour-labels">
                      {HOURS.map(h => <div key={h} className="fs-hour-label">{h}</div>)}
                    </div>
                    <div className="fs-day-column">
                      {HOURS.map(h => <div key={h} className="fs-hour-slot" />)}
                      {getEventsForDay(currentDate.getDate(), currentDate.getMonth(), currentDate.getFullYear()).map(e => {
                        const [h, m] = e.time.split(':').map(Number)
                        const [eh, em] = (e.endTime || e.time).split(':').map(Number)
                        const top = (h * 60 + m)
                        const duration = (eh * 60 + em) - (h * 60 + m)
                        const height = Math.max(duration, 40)

                        return (
                          <div key={e.id} className={`fs-event-timed ${e.type}`} style={{ top: `${top}px`, height: `${height}px` }}>
                            <div className="event-time">{e.time}{e.endTime ? ` - ${e.endTime}` : ''}</div>
                            <div className="event-title">{e.title}</div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
