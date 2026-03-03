import { useLocalStorage } from '../hooks/useLocalStorage'
import { BarChart2, Brain, FileText, CheckSquare, Timer, Link2, Flame, TrendingUp, Award, Calendar } from 'lucide-react'

function StatRow({ label, value, max, color = '#A89BF2' }) {
    const pct = max ? Math.min(100, Math.round((value / max) * 100)) : 0
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-4)' }}>{label}</span>
                <span style={{ fontWeight: 700, color: 'var(--text-1)', fontSize: '0.9375rem' }}>{value}</span>
            </div>
            <div style={{ background: 'var(--bg-hover-2)', borderRadius: '9999px', height: '5px', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: '9999px', width: `${pct}%`, background: color, transition: 'width 0.6s ease' }} />
            </div>
        </div>
    )
}

function MiniBar({ value, max, color }) {
    const h = max ? Math.max(4, Math.round((value / max) * 80)) : 4
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: 1 }}>
            <span style={{ fontSize: '0.625rem', color: 'var(--text-4)', fontWeight: 600 }}>{value}</span>
            <div style={{ width: '100%', display: 'flex', alignItems: 'flex-end', height: '80px' }}>
                <div style={{ width: '100%', height: `${h}px`, background: 'var(--accent-dim)', borderRadius: '4px 4px 0 0', border: '1px solid var(--accent-border)', minHeight: '4px' }} />
            </div>
        </div>
    )
}

export default function Stats() {
    const [tasks] = useLocalStorage('sd_tasks', [])
    const [notes] = useLocalStorage('sd_notes', [])
    const [decks] = useLocalStorage('sd_flashcard_decks', [])
    const [sessions] = useLocalStorage('sd_pomodoro_sessions', 0)
    const [links] = useLocalStorage('sd_links', [])
    const [habits] = useLocalStorage('sd_habits', [])
    const [events] = useLocalStorage('sd_calendar_events', [])

    const doneTasks = tasks.filter(t => t.done).length
    const pendingTasks = tasks.filter(t => !t.done).length
    const allCards = decks.reduce((a, d) => a + (d.cards?.length || 0), 0)
    const completionRate = tasks.length ? Math.round((doneTasks / tasks.length) * 100) : 0

    // Priority breakdown
    const highTasks = tasks.filter(t => t.priority === 'Alta' && !t.done).length
    const medTasks = tasks.filter(t => t.priority === 'Media' && !t.done).length
    const lowTasks = tasks.filter(t => t.priority === 'Baja' && !t.done).length

    // Habit stats
    const today = new Date()
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    const habitsToday = habits.filter(h => (h.completions || []).includes(todayStr)).length

    // Sessions per day (last 7)
    const last7Labels = []
    const DAYS = ['D', 'L', 'M', 'X', 'J', 'V', 'S']
    for (let i = 6; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        last7Labels.push(DAYS[d.getDay()])
    }

    const bigStats = [
        { icon: FileText, label: 'Notas', value: notes.length, color: '#A89BF2', sub: 'creadas' },
        { icon: Brain, label: 'Flashcards', value: allCards, color: '#7ED4A8', sub: 'tarjetas totales' },
        { icon: CheckSquare, label: 'Tareas', value: `${doneTasks}/${tasks.length}`, color: '#F2C48B', sub: 'completadas' },
        { icon: Timer, label: 'Pomodoros', value: sessions, color: '#F2A89B', sub: 'sesiones' },
        { icon: Link2, label: 'Links', value: links.length, color: '#64B4F2', sub: 'guardados' },
        { icon: Calendar, label: 'Eventos', value: events.length, color: '#B4F264', sub: 'en calendario' },
    ]

    const achievements = [
        { icon: '🏆', label: 'Primer nota', unlocked: notes.length >= 1 },
        { icon: '🧠', label: '10 flashcards', unlocked: allCards >= 10 },
        { icon: '⏱️', label: '5 pomodoros', unlocked: sessions >= 5 },
        { icon: '✅', label: '10 tareas completadas', unlocked: doneTasks >= 10 },
        { icon: '📅', label: '3 eventos creados', unlocked: events.length >= 3 },
        { icon: '🔥', label: 'Racha de 3 hábitos', unlocked: habitsToday >= 3 },
        { icon: '🗂️', label: '5 mazos creados', unlocked: decks.length >= 5 },
        { icon: '🌟', label: '20 sesiones Pomodoro', unlocked: sessions >= 20 },
    ]

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Estadísticas</h1>
                    <p className="page-subtitle">Tu progreso de estudio en números</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--orange)', fontSize: '0.875rem', fontWeight: 600 }}>
                    <TrendingUp size={16} />
                    {completionRate}% completado
                </div>
            </div>

            {/* Big stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
                {bigStats.map(s => {
                    const Icon = s.icon
                    return (
                        <div key={s.label} className="stat-card">
                            <div className="stat-icon" style={{ background: `${s.color}18`, border: `1px solid ${s.color}30` }}>
                                <Icon size={18} color={s.color} strokeWidth={1.8} />
                            </div>
                            <div>
                                <p style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-1)', letterSpacing: '-0.03em', lineHeight: 1 }}>{s.value}</p>
                                <p style={{ fontSize: '0.6875rem', color: 'var(--text-3)', marginTop: '3px' }}>{s.label} — {s.sub}</p>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {/* Task breakdown */}
                <div className="panel-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h3 style={{ fontWeight: 700, color: 'var(--text-1)', fontSize: '0.9375rem' }}>Desglose de tareas</h3>
                    <StatRow label="Alta prioridad pendientes" value={highTasks} max={Math.max(tasks.length, 1)} color="#F2A89B" />
                    <StatRow label="Media prioridad pendientes" value={medTasks} max={Math.max(tasks.length, 1)} color="#F2C48B" />
                    <StatRow label="Baja prioridad pendientes" value={lowTasks} max={Math.max(tasks.length, 1)} color="#7ED4A8" />
                    <StatRow label="Completadas" value={doneTasks} max={Math.max(tasks.length, 1)} color="#A89BF2" />
                </div>

                {/* Habit summary */}
                <div className="panel-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h3 style={{ fontWeight: 700, color: 'var(--text-1)', fontSize: '0.9375rem' }}>Resumen de hábitos</h3>
                    {habits.length === 0 ? (
                        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.875rem' }}>Sin hábitos registrados</p>
                    ) : habits.slice(0, 5).map(h => {
                        const streak = (() => {
                            let s = 0, d = new Date()
                            while (true) {
                                const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
                                if ((h.completions || []).includes(ds)) { s++; d.setDate(d.getDate() - 1) }
                                else { if (ds === todayStr && s === 0) { d.setDate(d.getDate() - 1); continue } break }
                            }
                            return s
                        })()
                        return (
                            <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <span style={{ fontSize: '1.125rem' }}>{h.icon}</span>
                                <span style={{ flex: 1, fontSize: '0.875rem', color: 'var(--text-2)' }}>{h.name}</span>
                                {streak > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#F2D48B', fontSize: '0.75rem', fontWeight: 700 }}><Flame size={12} />{streak}</span>}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Achievements */}
            <div className="panel-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                    <Award size={18} color="var(--orange)" />
                    <h3 style={{ fontWeight: 700, color: 'var(--text-1)', fontSize: '0.9375rem' }}>Logros</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-4)', marginLeft: '0.25rem' }}>
                        {achievements.filter(a => a.unlocked).length}/{achievements.length} desbloqueados
                    </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
                    {achievements.map(a => (
                        <div key={a.label} style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem',
                            borderRadius: '10px', background: a.unlocked ? 'rgba(168,155,242,0.08)' : 'rgba(255,255,255,0.02)',
                            border: a.unlocked ? '1px solid rgba(168,155,242,0.2)' : '1px solid rgba(255,255,255,0.04)',
                            opacity: a.unlocked ? 1 : 0.5, filter: a.unlocked ? 'none' : 'grayscale(1)',
                        }}>
                            <span style={{ fontSize: '1.5rem' }}>{a.icon}</span>
                            <span style={{ fontSize: '0.8125rem', color: a.unlocked ? 'var(--text-1)' : 'var(--text-4)', fontWeight: a.unlocked ? 700 : 500 }}>
                                {a.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
