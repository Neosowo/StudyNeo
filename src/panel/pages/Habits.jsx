import { useState, useRef } from 'react'
import { Plus, Trash2, Flame, Check, X, Zap, Book, Activity, Wind, Droplets, PersonStanding, PenTool, Target, Moon, Apple, BookOpen, Palette, Music, Minimize2 } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useProContext } from '../../ProContext'
import ProUpgradeModal from '../../ProUpgradeModal'
import { useWidgets } from '../components/FloatingWidgets'

const HABIT_ICONS = [
    { name: 'Book', icon: Book },
    { name: 'Activity', icon: Activity },
    { name: 'Wind', icon: Wind },
    { name: 'Droplets', icon: Droplets },
    { name: 'PersonStanding', icon: PersonStanding },
    { name: 'PenTool', icon: PenTool },
    { name: 'Target', icon: Target },
    { name: 'Moon', icon: Moon },
    { name: 'Apple', icon: Apple },
    { name: 'BookOpen', icon: BookOpen },
    { name: 'Palette', icon: Palette },
    { name: 'Music', icon: Music }
]

const IconRenderer = ({ name, size = 18, color = 'currentColor', ...props }) => {
    const item = HABIT_ICONS.find(i => i.name === name)
    const Icon = item ? item.icon : HABIT_ICONS[0].icon
    return <Icon size={size} color={color} {...props} />
}

function getTodayStr() {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function getStreak(habit) {
    const today = getTodayStr()
    let streak = 0
    let d = new Date()
    while (true) {
        const s = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        if (habit.completions?.includes(s)) {
            streak++
            d.setDate(d.getDate() - 1)
        } else {
            // allow today to not be checked yet without breaking streak
            if (s === today && streak === 0) { d.setDate(d.getDate() - 1); continue }
            break
        }
    }
    return streak
}

// Get last 7 days as array of date strings
function getLast7Days() {
    const days = []
    for (let i = 6; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        days.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`)
    }
    return days
}

const DAYS_SHORT = ['D', 'L', 'M', 'X', 'J', 'V', 'S']

function getDayLetter(dateStr) {
    const d = new Date(dateStr + 'T12:00:00')
    return DAYS_SHORT[d.getDay()]
}

export default function Habits() {
    const [habits, setHabits] = useLocalStorage('sd_habits', [])
    const [newName, setNewName] = useState('')
    const { isPro } = useProContext()
    const { openWidget } = useWidgets()
    const [showUpgrade, setShowUpgrade] = useState(false)
    const [soundEnabled] = useLocalStorage('sd_sound_enabled', true)
    const [newIcon, setNewIcon] = useState('Book')

    const playSound = (url) => {
        if (!soundEnabled) return
        const a = new Audio(url)
        a.volume = 0.4
        a.play().catch(() => { })
    }

    const AUDIO = {
        check: 'https://assets.mixkit.co/active_storage/sfx/2012/2012-preview.mp3',
        add: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'
    }
    const today = getTodayStr()
    const last7 = getLast7Days()

    const addHabit = () => {
        if (!isPro && habits.length >= 3) {
            setShowUpgrade(true)
            return
        }
        if (!newName.trim()) return
        setHabits(prev => [...prev, { id: Date.now(), name: newName.trim(), icon: newIcon, completions: [], createdAt: today }])
        setNewName('')
        playSound(AUDIO.add)
    }

    const toggleDay = (habitId, dateStr) => {
        setHabits(prev => prev.map(h => {
            if (h.id !== habitId) return h
            const comps = h.completions || []
            const has = comps.includes(dateStr)
            if (!has) playSound(AUDIO.check)
            return { ...h, completions: has ? comps.filter(c => c !== dateStr) : [...comps, dateStr] }
        }))
    }

    const deleteHabit = (id) => setHabits(prev => prev.filter(h => h.id !== id))

    const totalToday = habits.filter(h => (h.completions || []).includes(today)).length
    const completionRate = habits.length ? Math.round((totalToday / habits.length) * 100) : 0
    const globalMaxStreak = habits.reduce((max, h) => Math.max(max, getStreak(h)), 0)

    return (
        <div className="page-container">
            <div className="page-header">
                {showUpgrade && <ProUpgradeModal onClose={() => setShowUpgrade(false)} />}
                <div>
                    <h1 className="page-title">Hábitos</h1>
                    <p className="page-subtitle">Hoy: {totalToday}/{habits.length} completados · {completionRate}%</p>
                </div>
                <button
                    onClick={() => openWidget('habits')}
                    title="Mini ventana de hábitos"
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, border: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)', color: 'var(--text-3)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 700 }}
                >
                    <Minimize2 size={13} /> Mini
                </button>
            </div>

            {!isPro && (
                <div style={{ padding: '0.875rem 1.25rem', background: 'var(--accent-dim)', borderRadius: '12px', border: '1px solid var(--accent-border)', marginBottom: '2.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Zap size={16} color="var(--accent)" />
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-1)' }}>
                            Has usado <strong style={{ color: 'var(--accent)' }}>{habits.length}/3</strong> hábitos del Plan Gratis.
                        </span>
                    </div>
                    <button onClick={() => setShowUpgrade(true)} style={{ background: 'var(--accent)', border: 'none', color: 'white', fontWeight: 700, padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = 0.8} onMouseLeave={e => e.currentTarget.style.opacity = 1}>
                        Hacer Ilimitado
                    </button>
                </div>
            )}

            {/* Global Stats & Achievements */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', width: '100%', marginBottom: '2.5rem' }}>
                <div className="panel-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'var(--orange-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Flame size={32} color="var(--orange)" strokeWidth={2.5} />
                    </div>
                    <div>
                        <p style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Mejor Racha</p>
                        <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>
                            {globalMaxStreak} días
                        </h3>
                    </div>
                </div>

                <div className="panel-card" style={{ padding: '1.5rem' }}>
                    <p style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>Vitrina de Trofeos</p>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        {[
                            { name: 'Iniciado', req: 1, icon: '🌱' },
                            { name: 'Consistente', req: 7, icon: '🔥' },
                            { name: 'Imparable', req: 30, icon: '👑' },
                            { name: 'Leyenda', req: 100, icon: '💎' },
                        ].map(trophy => {
                            const reached = globalMaxStreak >= trophy.req
                            return (
                                <div key={trophy.name} title={reached ? `¡Desbloqueado! (${trophy.req} días)` : `Bloqueado: Alcanza ${trophy.req} días`} style={{
                                    width: '44px', height: '44px', borderRadius: '12px',
                                    background: reached ? 'var(--accent-dim)' : 'var(--bg-hover)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '1.25rem', opacity: reached ? 1 : 0.2, filter: reached ? 'none' : 'grayscale(1)',
                                    transition: 'all 0.4s', border: reached ? '1px solid var(--accent-border)' : '1px solid transparent'
                                }}>
                                    {trophy.icon}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Add habit */}
            <div className="panel-card" style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.6875rem', fontWeight: 800, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem' }}>
                    Nuevo hábito
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', maxWidth: '300px' }}>
                        {HABIT_ICONS.map(ic => (
                            <button
                                key={ic.name}
                                onClick={() => setNewIcon(ic.name)}
                                style={{
                                    width: '2.125rem', height: '2.125rem', border: 'none', cursor: 'pointer',
                                    borderRadius: '8px', background: newIcon === ic.name ? 'var(--accent-dim)' : 'var(--bg-hover)',
                                    color: newIcon === ic.name ? 'var(--accent)' : 'var(--text-3)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.2s',
                                }}
                            >
                                <ic.icon size={16} />
                            </button>
                        ))}
                    </div>
                    <input
                        className="panel-input"
                        style={{ flex: 1, minWidth: '160px' }}
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addHabit()}
                        placeholder="Nombre del hábito…"
                    />
                    <button className="btn-primary-sm" onClick={addHabit}>
                        <Plus size={14} /> Agregar
                    </button>
                </div>
            </div>

            {/* Progress bar */}
            {habits.length > 0 && (
                <div className="panel-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-3)' }}>Progreso de hoy</span>
                        <span style={{ fontWeight: 900, color: 'var(--accent)', fontSize: '1.5rem', letterSpacing: '-0.02em' }}>{completionRate}%</span>
                    </div>
                    <div style={{ background: 'var(--bg-hover-2)', borderRadius: '9999px', height: '8px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: '9999px', width: `${completionRate}%`, background: 'var(--accent)', boxShadow: '0 0 12px var(--accent-glow)', transition: 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' }} />
                    </div>
                </div>
            )}

            {/* Habit tracker grid */}
            {habits.length === 0 ? (
                <div className="panel-card" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-4)' }}>
                    <div style={{ marginBottom: '1rem', opacity: 0.3, display: 'flex', justifyContent: 'center' }}>
                        <Target size={60} />
                    </div>
                    <p style={{ fontSize: '1rem', fontWeight: 500 }}>Agrega tu primer hábito para empezar el seguimiento</p>
                </div>
            ) : (
                <div className="panel-card" style={{ overflowX: 'auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) auto', gap: '0 1rem', marginBottom: '0.5rem' }}>
                        <div />
                        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${last7.length}, 36px)`, gap: '4px' }}>
                            {last7.map(d => (
                                <div key={d} style={{ textAlign: 'center', fontSize: '0.6875rem', fontWeight: 800, color: d === today ? 'var(--accent)' : 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                    {getDayLetter(d)}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {habits.map(habit => {
                            const streak = getStreak(habit)
                            const todayDone = (habit.completions || []).includes(today)
                            return (
                                <div key={habit.id} style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) auto', gap: '0 1rem', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <IconRenderer name={habit.icon} size={16} color={todayDone ? 'var(--accent)' : 'var(--text-4)'} />
                                        </div>
                                        <p style={{
                                            fontWeight: 700, fontSize: '0.9375rem',
                                            color: todayDone ? 'var(--text-1)' : 'var(--text-3)',
                                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1
                                        }}>
                                            {habit.name}
                                        </p>
                                        {streak >= 2 && (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.75rem', color: 'var(--orange)', fontWeight: 800, flexShrink: 0, marginRight: '8px' }}>
                                                <Flame size={12} strokeWidth={3} /> {streak}
                                            </span>
                                        )}
                                        <button className="icon-action-btn danger" onClick={() => deleteHabit(habit.id)}><Trash2 size={13} /></button>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${last7.length}, 36px)`, gap: '4px' }}>
                                        {last7.map(d => {
                                            const done = (habit.completions || []).includes(d)
                                            return (
                                                <button
                                                    key={d}
                                                    onClick={() => toggleDay(habit.id, d)}
                                                    style={{
                                                        width: '36px', height: '36px', borderRadius: '8px', border: '1px solid var(--border-subtle)',
                                                        background: done ? 'var(--accent)' : 'var(--bg-input)',
                                                        color: done ? 'white' : 'transparent',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        cursor: 'pointer', transition: 'all 0.2s', padding: 0
                                                    }}
                                                >
                                                    <Check size={16} strokeWidth={3} />
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
