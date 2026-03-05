import { useState, useEffect } from 'react'
import { CheckSquare, FileText, Brain, Timer, Clock, Sun, Moon, Coffee, Flame, Zap, CalendarClock, StickyNote, TrendingUp } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useSync } from '../hooks/useSync'
import { useProContext } from '../../ProContext'
import { useSfx } from '../hooks/useSfx'
import { useAudioPlayer } from '../context/AudioPlayerContext'
import { Music, SkipBack, SkipForward, Play, Pause, Repeat, ListMusic } from 'lucide-react'

/* ── Tiny circular progress SVG ───────────────────────── */
function RingProgress({ value = 0, size = 88, stroke = 8 }) {
    const r = (size - stroke) / 2
    const circ = 2 * Math.PI * r
    const offset = circ - (value / 100) * circ
    return (
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
            <circle r={r} cx={size / 2} cy={size / 2} fill="none" stroke="var(--bg-hover-2)" strokeWidth={stroke} />
            <circle r={r} cx={size / 2} cy={size / 2} fill="none" stroke="url(#ring-grad)" strokeWidth={stroke}
                strokeDasharray={circ} strokeDashoffset={offset}
                strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
            <defs>
                <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--accent)" />
                    <stop offset="100%" stopColor="var(--accent-2)" />
                </linearGradient>
            </defs>
        </svg>
    )
}

export default function Dashboard({ user }) {
    const [tasks] = useLocalStorage('sd_tasks', [])
    const [notes] = useLocalStorage('sd_notes', [])
    const [flashcardDecks] = useLocalStorage('sd_flashcard_decks', [])
    const [sessions] = useLocalStorage('sd_pomodoro_sessions', 0)
    const [calEvents] = useLocalStorage('sd_calendar_events', [])
    const [quickNote, setQuickNote] = useLocalStorage('sd_quick_note', '')
    const { formatNextSync } = useSync()
    const { isPro } = useProContext()
    const { play } = useSfx()
    const { current, playing, togglePlay, nextTrack, prevTrack, progress, duration, seek } = useAudioPlayer()
    const [showMusic, setShowMusic] = useState(false)
    const [currentTime, setCurrentTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    // Auto-activate mini player if music is playing when visiting Dashboard
    useEffect(() => {
        if (current) setShowMusic(true)
    }, []) // eslint-disable-line

    /* ── Derived stats ── */
    const pendingTasks = tasks.filter(t => !t.done).length
    const doneTasks = tasks.filter(t => t.done).length
    const completion = tasks.length ? Math.round((doneTasks / tasks.length) * 100) : 0

    const stats = [
        { icon: FileText, label: 'Notas', value: notes.length, color: 'var(--accent)', sub: 'creadas' },
        { icon: Brain, label: 'Flashcards', value: flashcardDecks.reduce((a, d) => a + (d.cards?.length || 0), 0), color: 'var(--green)', sub: 'tarjetas' },
        { icon: CheckSquare, label: 'Tareas', value: `${doneTasks}/${tasks.length}`, color: 'var(--orange)', sub: 'completadas' },
        { icon: Timer, label: 'Sesiones', value: sessions, color: 'var(--yellow)', sub: 'pomodoros' },
    ]

    /* ── Upcoming events ── */
    const now = new Date()
    const upcoming = calEvents
        .filter(e => new Date(e.date) >= now)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 4)

    const daysDiff = (dateStr) => {
        const ms = new Date(dateStr) - now
        const days = Math.ceil(ms / (1000 * 60 * 60 * 24))
        if (days === 0) return { label: 'Hoy', color: 'var(--red)' }
        if (days === 1) return { label: 'Mañana', color: 'var(--orange)' }
        if (days <= 7) return { label: `en ${days} días`, color: 'var(--yellow)' }
        return { label: `en ${days} días`, color: 'var(--text-3)' }
    }

    /* ── Greeting ── */
    const hours = now.getHours()
    const greeting = hours < 12 ? 'Buenos días' : hours < 18 ? 'Buenas tardes' : 'Buenas noches'
    const GreetIcon = hours < 12 ? Sun : hours < 18 ? Coffee : Moon

    return (
        <div className="page-container">
            {/* Header */}
            <div className="page-header">
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                        <GreetIcon size={18} color="var(--accent)" />
                        <p className="page-subtitle" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px' }}>{greeting}, {user?.name || 'Estudiante'}</p>
                    </div>
                    <h1 className="page-title">Dashboard</h1>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-3)', fontSize: '0.8125rem', background: 'var(--bg-surface)', padding: '8px 16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                    <Clock size={14} />
                    <span style={{ fontWeight: 600, color: 'var(--text-1)' }}>
                        {currentTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                    <span style={{ opacity: 0.5 }}>•</span>
                    {currentTime.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}
                </div>
            </div>

            {/* ── Stats Grid ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                {stats.map((s, i) => {
                    const Icon = s.icon
                    return (
                        <div key={i} className="panel-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ background: s.color + '20', color: s.color, padding: '8px', borderRadius: '10px' }}>
                                    <Icon size={16} />
                                </div>
                                <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-1)' }}>{s.value}</span>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
                                <p style={{ fontSize: '0.625rem', color: 'var(--text-3)', marginTop: '2px' }}>{s.sub}</p>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* ── Row 2: Progress Ring + Upcoming Events ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {/* Completion ring */}
                <div className="panel-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                        <RingProgress value={completion} />
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--accent)', lineHeight: 1 }}>{completion}%</span>
                        </div>
                    </div>
                    <div>
                        <h2 style={{ fontWeight: 800, color: 'var(--text-1)', fontSize: '0.9375rem', marginBottom: '0.25rem' }}>Progreso Diario</h2>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>{doneTasks} completadas · {pendingTasks} pendientes</p>
                        <div style={{ width: '100%', height: '6px', background: 'var(--bg-hover-2)', borderRadius: '9999px', marginTop: '0.875rem', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${completion}%`, borderRadius: '9999px', background: 'linear-gradient(90deg, var(--accent), var(--accent-2))', transition: 'width 0.6s ease' }} />
                        </div>
                    </div>
                </div>

                {/* Upcoming deadlines */}
                <div className="panel-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                        <CalendarClock size={16} color="var(--accent)" />
                        <h2 style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-1)' }}>Próximas Entregas</h2>
                    </div>
                    {upcoming.length === 0 ? (
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-4)', textAlign: 'center', padding: '1rem 0' }}>No hay eventos próximos.<br />Agrega uno en Calendario 📅</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                            {upcoming.map(ev => {
                                const { label, color } = daysDiff(ev.date)
                                return (
                                    <div key={ev.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.875rem', background: 'var(--bg-base)', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: ev.color || 'var(--accent)', flexShrink: 0 }} />
                                        <span style={{ flex: 1, fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.title}</span>
                                        <span style={{ fontSize: '0.6875rem', fontWeight: 800, color, flexShrink: 0 }}>{label}</span>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Row 3: Recent Tasks + Quick Notes ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {/* Recent tasks */}
                {tasks.length > 0 && (
                    <div className="panel-card">
                        <h2 style={{ fontWeight: 700, color: 'var(--text-1)', fontSize: '0.9375rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <CheckSquare size={15} color="var(--accent)" /> Tareas recientes
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {tasks.slice(0, 5).map(t => (
                                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0' }}>
                                    <div style={{ width: '16px', height: '16px', borderRadius: '4px', flexShrink: 0, background: t.done ? 'var(--accent)' : 'transparent', border: t.done ? 'none' : '1.5px solid var(--accent-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {t.done && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
                                    </div>
                                    <span style={{ fontSize: '0.8125rem', color: t.done ? 'var(--text-4)' : 'var(--text-2)', textDecoration: t.done ? 'line-through' : 'none', flex: 1 }}>
                                        {t.text}
                                    </span>
                                    {t.subject && (
                                        <span style={{ fontSize: '0.625rem', padding: '1px 7px', borderRadius: '4px', background: 'var(--accent-dim)', color: 'var(--accent)', fontWeight: 800, flexShrink: 0 }}>
                                            {t.subject}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quick Note Card */}
                <div className="panel-card" style={{ display: 'flex', flexDirection: 'column', minHeight: '220px', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
                        <h2 style={{ fontWeight: 700, color: 'var(--text-1)', fontSize: '0.9375rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <StickyNote size={15} color="var(--yellow)" /> Apuntes Rápidos
                        </h2>
                    </div>
                    <textarea
                        value={quickNote}
                        onChange={e => setQuickNote(e.target.value)}
                        placeholder="Escribe algo urgente aquí..."
                        style={{
                            flex: 1, minHeight: '140px', background: 'var(--bg-base)',
                            border: '1.5px solid var(--border-subtle)', borderRadius: '12px',
                            padding: '0.875rem', fontFamily: 'inherit', fontSize: '0.8125rem',
                            color: 'var(--text-1)', resize: 'none', lineHeight: 1.6,
                            outline: 'none', transition: 'border-color 0.2s',
                        }}
                    />
                    <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '10px', color: 'var(--text-4)', fontWeight: 600 }}>
                            {quickNote.length} caracteres · Auto-guardado
                        </span>
                        {quickNote && (
                            <button onClick={() => { setQuickNote(''); play('delete') }} style={{ background: 'none', border: 'none', color: 'var(--text-4)', fontSize: '11px', cursor: 'pointer', fontWeight: 700 }}>
                                Limpiar
                            </button>
                        )}
                    </div>
                </div>
            </div>

        </div>
    )
}

const miniCtrl = {
    background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
    borderRadius: '50%', width: '36px', height: '36px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', color: 'var(--text-1)', transition: 'all 0.2s'
}
