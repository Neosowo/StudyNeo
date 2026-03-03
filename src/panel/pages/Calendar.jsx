import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, X, Clock, Tag, Trash2, Calendar as CalIcon } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const DAYS_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MONTHS_ES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

const EVENT_COLORS = [
    { id: 'purple', label: 'Examen', bg: 'rgba(168,155,242,0.25)', dot: '#A89BF2' },
    { id: 'green', label: 'Estudio', bg: 'rgba(126,212,168,0.2)', dot: '#7ED4A8' },
    { id: 'orange', label: 'Tarea', bg: 'rgba(242,196,139,0.2)', dot: '#F2C48B' },
    { id: 'red', label: 'Personal', bg: 'rgba(242,120,100,0.2)', dot: '#F27864' },
    { id: 'blue', label: 'Reunión', bg: 'rgba(100,180,242,0.2)', dot: '#64B4F2' },
]

function getColor(id) {
    return EVENT_COLORS.find(c => c.id === id) || EVENT_COLORS[0]
}

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay()
}

function toDateStr(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export default function Calendar() {
    const [events, setEvents] = useLocalStorage('sd_calendar_events', [])
    const today = new Date()
    const [viewYear, setViewYear] = useState(today.getFullYear())
    const [viewMonth, setViewMonth] = useState(today.getMonth())
    const [selectedDate, setSelectedDate] = useState(toDateStr(today.getFullYear(), today.getMonth(), today.getDate()))
    const [showForm, setShowForm] = useState(false)

    // Form state
    const [evTitle, setEvTitle] = useState('')
    const [evTime, setEvTime] = useState('')
    const [evColor, setEvColor] = useState('purple')
    const [evDesc, setEvDesc] = useState('')

    const prevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
        else setViewMonth(m => m - 1)
    }
    const nextMonth = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
        else setViewMonth(m => m + 1)
    }
    const goToday = () => { setViewYear(today.getFullYear()); setViewMonth(today.getMonth()); setSelectedDate(toDateStr(today.getFullYear(), today.getMonth(), today.getDate())) }

    const addEvent = () => {
        if (!evTitle.trim()) return
        setEvents(prev => [...prev, {
            id: Date.now(), title: evTitle.trim(), date: selectedDate,
            time: evTime, color: evColor, desc: evDesc.trim(),
        }])
        setEvTitle(''); setEvTime(''); setEvDesc(''); setShowForm(false)
    }

    const deleteEvent = (id) => setEvents(prev => prev.filter(e => e.id !== id))

    const daysInMonth = getDaysInMonth(viewYear, viewMonth)
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth)
    const cells = []

    // blank cells before first day
    for (let i = 0; i < firstDay; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)

    const selectedEvents = events.filter(e => e.date === selectedDate).sort((a, b) => a.time.localeCompare(b.time))
    const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate())

    const eventsThisMonth = events.filter(e => e.date.startsWith(`${viewYear}-${String(viewMonth + 1).padStart(2, '0')}`))

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: 'Inter, sans-serif', background: 'var(--bg-base)' }}>
            {/* Calendar area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {/* Header */}
                <div style={{ padding: '1.5rem 2rem 1rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', background: 'var(--bg-surface)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-1)', letterSpacing: '-0.03em' }}>
                            {MONTHS_ES[viewMonth]} {viewYear}
                        </h1>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            <button className="cal-nav-btn" onClick={prevMonth}><ChevronLeft size={16} /></button>
                            <button className="cal-nav-btn" onClick={nextMonth}><ChevronRight size={16} /></button>
                        </div>
                        <button className="cal-today-btn" onClick={goToday}>Hoy</button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-4)' }}>
                        <CalIcon size={14} />
                        {eventsThisMonth.length} eventos este mes
                    </div>
                </div>

                {/* Day headers */}
                <div className="cal-day-headers" style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
                    {DAYS_ES.map(d => (
                        <div key={d} style={{ textAlign: 'center', color: 'var(--text-4)', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                            {d}
                        </div>
                    ))}
                </div>

                {/* Calendar grid */}
                <div className="cal-grid" style={{ background: 'var(--border-subtle)' }}>
                    {cells.map((day, i) => {
                        if (!day) return <div key={`blank-${i}`} className="cal-cell cal-cell-blank" style={{ background: 'var(--bg-base)' }} />
                        const dateStr = toDateStr(viewYear, viewMonth, day)
                        const dayEvents = events.filter(e => e.date === dateStr)
                        const isToday = dateStr === todayStr
                        const isSelected = dateStr === selectedDate
                        return (
                            <div
                                key={day}
                                className={`cal-cell ${isToday ? 'cal-cell-today' : ''} ${isSelected ? 'cal-cell-selected' : ''}`}
                                onClick={() => setSelectedDate(dateStr)}
                                style={{
                                    background: isSelected ? 'var(--accent-dim)' : 'var(--bg-surface)',
                                    position: 'relative',
                                    transition: 'all 0.15s'
                                }}
                            >
                                <div className="cal-day-num" style={{
                                    background: isToday ? 'var(--accent)' : 'transparent',
                                    color: isToday ? 'white' : isSelected ? 'var(--accent)' : 'var(--text-1)'
                                }}>
                                    {day}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
                                    {dayEvents.slice(0, 3).map(ev => {
                                        const col = getColor(ev.color)
                                        return (
                                            <div key={ev.id} className="cal-event-pill" style={{ background: col.bg, borderLeft: `2px solid ${col.dot}`, color: 'var(--text-2)' }}>
                                                {ev.title}
                                            </div>
                                        )
                                    })}
                                    {dayEvents.length > 3 && (
                                        <div style={{ fontSize: '10px', color: 'var(--text-4)', paddingLeft: '4px' }}>+{dayEvents.length - 3} más</div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Right sidebar */}
            <div className="cal-sidebar" style={{ background: 'var(--bg-surface)', borderLeft: '1px solid var(--border-subtle)' }}>
                {/* Selected date header */}
                <div style={{ padding: '1.5rem 1.25rem 1rem', borderBottom: '1px solid var(--border-subtle)' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-4)', marginBottom: '4px', fontWeight: 600 }}>
                        {selectedDate === todayStr ? '📍 HOY' : ''}
                    </p>
                    <p style={{ fontWeight: 800, color: 'var(--text-1)', fontSize: '1.125rem', letterSpacing: '-0.02em' }}>
                        {(() => {
                            const d = new Date(selectedDate + 'T12:00:00')
                            return `${DAYS_ES[d.getDay()]}, ${d.getDate()} ${MONTHS_ES[d.getMonth()]}`
                        })()}
                    </p>
                </div>

                {/* Add event form */}
                {showForm ? (
                    <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <p style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Nuevo evento</p>
                            <button className="icon-action-btn" onClick={() => setShowForm(false)} style={{ background: 'var(--bg-hover)' }}><X size={14} /></button>
                        </div>
                        <input className="panel-input" value={evTitle} onChange={e => setEvTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && addEvent()} placeholder="Título del evento" autoFocus />
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.625rem', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '0.625rem 0.875rem' }}>
                                <Clock size={14} style={{ color: 'var(--text-4)', flexShrink: 0 }} />
                                <input type="time" className="panel-input" style={{ border: 'none', background: 'transparent', padding: 0, fontSize: '0.875rem' }} value={evTime} onChange={e => setEvTime(e.target.value)} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', padding: '0.25rem 0' }}>
                            {EVENT_COLORS.map(c => (
                                <button
                                    key={c.id}
                                    onClick={() => setEvColor(c.id)}
                                    title={c.label}
                                    style={{
                                        width: '24px', height: '24px', borderRadius: '50%', border: evColor === c.id ? `3px solid white` : 'none',
                                        background: c.dot, cursor: 'pointer', transition: 'all 0.15s',
                                        boxShadow: evColor === c.id ? `0 0 0 2px ${c.dot}CC` : 'none',
                                    }}
                                />
                            ))}
                        </div>
                        <input className="panel-input" style={{ fontSize: '0.8125rem' }} value={evDesc} onChange={e => setEvDesc(e.target.value)} placeholder="Descripción (opcional)" />
                        <button className="btn-primary-sm" onClick={addEvent} style={{ width: '100%', justifyContent: 'center', height: '40px' }}>
                            <Plus size={16} /> Agregar evento
                        </button>
                    </div>
                ) : (
                    <div style={{ padding: '1.25rem' }}>
                        <button className="btn-primary-sm" onClick={() => setShowForm(true)} style={{ width: '100%', justifyContent: 'center', height: '40px' }}>
                            <Plus size={16} /> Agregar evento
                        </button>
                    </div>
                )}

                {/* Events for selected day */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem 1.25rem' }}>
                    {selectedEvents.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-4)', fontSize: '0.875rem' }}>
                            <CalIcon size={32} style={{ opacity: 0.1, marginBottom: '0.75rem' }} />
                            <p>Sin eventos este día</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '0.5rem 0' }}>
                            {selectedEvents.map(ev => {
                                const col = getColor(ev.color)
                                return (
                                    <div key={ev.id} className="cal-event-card" style={{ borderLeft: `4px solid ${col.dot}`, background: col.bg, padding: '0.875rem', borderRadius: '10px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{ fontWeight: 800, color: 'var(--text-1)', fontSize: '0.875rem', marginBottom: '2px' }}>{ev.title}</p>
                                                {ev.time && <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={11} />{ev.time}</p>}
                                                {ev.desc && <p style={{ fontSize: '0.75rem', color: 'var(--text-4)', marginTop: '4px', lineHeight: 1.5 }}>{ev.desc}</p>}
                                            </div>
                                            <button className="icon-action-btn danger" style={{ background: 'var(--bg-hover)', color: 'var(--red)' }} onClick={() => deleteEvent(ev.id)}><Trash2 size={13} /></button>
                                        </div>
                                        <div style={{ marginTop: '8px' }}>
                                            <span style={{ fontSize: '0.625rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: col.dot, background: 'var(--bg-surface)', padding: '2px 6px', borderRadius: '4px' }}>
                                                {col.label}
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Upcoming events preview */}
                <div style={{ borderTop: '1px solid var(--border-subtle)', padding: '1.25rem', background: 'var(--bg-surface)' }}>
                    <p style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem' }}>
                        Próximos eventos
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {events
                            .filter(e => e.date >= todayStr)
                            .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
                            .slice(0, 3)
                            .map(ev => {
                                const col = getColor(ev.color)
                                const d = new Date(ev.date + 'T12:00:00')
                                return (
                                    <div key={ev.id} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: col.dot, flexShrink: 0, boxShadow: `0 0 8px ${col.dot}40` }} />
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.title}</p>
                                            <p style={{ fontSize: '0.6875rem', color: 'var(--text-4)' }}>{d.getDate()} {MONTHS_ES[d.getMonth()]}{ev.time ? ` · ${ev.time}` : ''}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        {events.filter(e => e.date >= todayStr).length === 0 && (
                            <p style={{ fontSize: '0.8125rem', color: 'var(--text-4)', fontStyle: 'italic' }}>Todo despejado por ahora</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
