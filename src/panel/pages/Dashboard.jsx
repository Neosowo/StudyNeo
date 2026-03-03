import { CheckSquare, FileText, Brain, Timer, Clock, Sun, Moon, Coffee, Flame } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useSync } from '../hooks/useSync'
import { useProContext } from '../../ProContext'

export default function Dashboard({ user }) {
    const [tasks] = useLocalStorage('sd_tasks', [])
    const [notes] = useLocalStorage('sd_notes', [])
    const [flashcardDecks] = useLocalStorage('sd_flashcard_decks', [])
    const [sessions] = useLocalStorage('sd_pomodoro_sessions', 0)
    const { formatNextSync } = useSync()

    const pendingTasks = tasks.filter(t => !t.done).length
    const doneTasks = tasks.filter(t => t.done).length
    const completion = tasks.length ? Math.round((doneTasks / tasks.length) * 100) : 0

    const stats = [
        { icon: FileText, label: 'Notas', value: notes.length, color: 'var(--accent)', sub: 'creadas' },
        { icon: Brain, label: 'Flashcards', value: flashcardDecks.reduce((a, d) => a + (d.cards?.length || 0), 0), color: 'var(--green)', sub: 'tarjetas' },
        { icon: CheckSquare, label: 'Tareas', value: `${doneTasks}/${tasks.length}`, color: 'var(--orange)', sub: 'completadas' },
        { icon: Timer, label: 'Sesiones', value: sessions, color: 'var(--yellow)', sub: 'pomodoros' },
    ]

    const [soundEnabled] = useLocalStorage('sd_sound_enabled', true)
    const { isPro } = useProContext() // To show pro badge if needed


    const now = new Date()
    const hours = now.getHours()
    const greeting = hours < 12 ? 'Buenos días' : hours < 18 ? 'Buenas tardes' : 'Buenas noches'

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <p className="page-subtitle">{greeting}, {user?.name || 'Estudiante'}</p>
                    <h1 className="page-title">Dashboard</h1>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-3)', fontSize: '0.8125rem' }}>
                    <Clock size={14} />
                    {now.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="dashboard-stats">
                {stats.map(s => {
                    const Icon = s.icon
                    return (
                        <div key={s.label} className="stat-card">
                            <div className="stat-icon" style={{ background: `color-mix(in srgb, ${s.color} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${s.color} 25%, transparent)` }}>
                                <Icon size={18} color={s.color} strokeWidth={1.8} />
                            </div>
                            <div>
                                <p style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-1)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                                    {s.value}
                                </p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '4px' }}>
                                    {s.label} — {s.sub}
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Progress + Sesiones */}
            <div className="dashboard-grid-main" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1rem'
            }}>
                {/* Task Progress */}
                <div className="panel-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <h2 style={{ fontWeight: 700, color: 'var(--text-1)', fontSize: '0.9375rem' }}>Progreso de tareas</h2>
                        <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--accent)' }}>{completion}%</span>
                    </div>
                    <div style={{ background: 'var(--bg-hover-2)', borderRadius: '9999px', height: '8px', overflow: 'hidden' }}>
                        <div style={{
                            height: '100%', borderRadius: '9999px',
                            width: `${completion}%`,
                            background: 'linear-gradient(90deg, var(--accent), var(--accent-2))',
                            transition: 'width 0.6s ease',
                        }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-3)' }}>
                        <span>{doneTasks} completadas</span>
                        <span>{pendingTasks} pendientes</span>
                    </div>
                </div>

                {/* Sesiones */}
                <div className="panel-card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ padding: '1rem', background: 'var(--yellow-dim)', borderRadius: '20px', marginBottom: '1rem' }}>
                        <Timer size={32} color="var(--yellow)" />
                    </div>
                    <p style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--yellow)', lineHeight: 1 }}>{sessions}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '0.5rem' }}>sesiones completadas</p>
                </div>
            </div>

            {/* Recent tasks preview */}
            {tasks.length > 0 && (
                <div className="panel-card">
                    <h2 style={{ fontWeight: 700, color: 'var(--text-1)', fontSize: '0.9375rem', marginBottom: '1rem' }}>
                        Tareas recientes
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                        {tasks.slice(0, 5).map(t => (
                            <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{
                                    width: '18px', height: '18px', borderRadius: '5px', flexShrink: 0,
                                    background: t.done ? 'var(--accent)' : 'transparent',
                                    border: t.done ? 'none' : '1.5px solid var(--accent-border)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    {t.done && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
                                </div>
                                <span style={{ fontSize: '0.875rem', color: t.done ? 'var(--text-3)' : 'var(--text-2)', textDecoration: t.done ? 'line-through' : 'none' }}>
                                    {t.text}
                                </span>
                                {t.subject && (
                                    <span style={{ marginLeft: 'auto', fontSize: '0.6875rem', padding: '2px 8px', borderRadius: '4px', background: 'var(--accent-dim)', color: 'var(--accent)', flexShrink: 0 }}>
                                        {t.subject}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
