import { useState, useRef, useEffect, useCallback } from 'react'
import { Play, Pause, RotateCcw, Coffee, Zap, SkipForward, VolumeX, CloudRain, Trees, Brain, Sofa, Minimize2 } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useProContext } from '../../ProContext'
import ProUpgradeModal from '../../ProUpgradeModal'
import { useWidgets } from '../components/FloatingWidgets'

const AMBIENT_SOUNDS = [
    { id: 'none', label: 'Silencio', icon: VolumeX },
    { id: 'rain', label: 'Lluvia', icon: CloudRain, url: 'https://lasonoteca.com/wp-content/uploads/2016/11/rain_heavy_loop.mp3' },
    { id: 'forest', label: 'Bosque', icon: Trees, url: 'https://www.soundjay.com/nature/forest-1.mp3' },
    { id: 'cafe', label: 'Cafetería', icon: Coffee, url: 'https://www.soundjay.com/misc/sounds/coffee-shop-1.mp3' },
]

const MODES = {
    focus: { label: 'Foco', minutes: 25, color: 'var(--accent)', icon: Brain },
    short: { label: 'Descanso corto', minutes: 5, color: 'var(--green)', icon: Coffee },
    long: { label: 'Descanso largo', minutes: 15, color: 'var(--orange)', icon: Sofa },
}

// Shared pomo state in localStorage so the floating widget reads the same data
const POMO_STATE_KEY = 'sd_pomo_live'

export function getPomodoroLiveState() {
    try { return JSON.parse(localStorage.getItem(POMO_STATE_KEY) || 'null') } catch { return null }
}

export default function Pomodoro() {
    const { isPro } = useProContext()
    const { openWidget, closeWidget } = useWidgets()
    const [showUpgrade, setShowUpgrade] = useState(false)
    const [sessions, setSessions] = useLocalStorage('sd_pomodoro_sessions', 0)
    const [soundEnabled] = useLocalStorage('sd_sound_enabled', true)

    // Initialize directly from localStorage so no race with persist effect
    const [mode, setMode] = useState(() => getPomodoroLiveState()?.mode || 'focus')
    const [secondsLeft, setSecondsLeft] = useState(() => {
        const s = getPomodoroLiveState()
        return s?.secondsLeft ?? MODES[s?.mode || 'focus'].minutes * 60
    })
    const [running, setRunning] = useState(false) // never auto-start; let user resume
    const [pomosThisRound, setPomosThisRound] = useState(() => getPomodoroLiveState()?.pomosThisRound ?? 0)
    const [activeSound, setActiveSound] = useState('none')
    const intervalRef = useRef(null)
    const audioRef = useRef(null)

    const current = MODES[mode]
    const total = current.minutes * 60
    const progress = ((total - secondsLeft) / total) * 100
    const radius = 100
    const circumference = 2 * Math.PI * radius
    const dashOffset = circumference - (progress / 100) * circumference

    const formatTime = (s) => {
        const m = Math.floor(s / 60)
        const sec = s % 60
        return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
    }

    // ─── Persist live state to localStorage (shared with floating widget) ─────
    useEffect(() => {
        localStorage.setItem(POMO_STATE_KEY, JSON.stringify({ mode, secondsLeft, running, pomosThisRound }))
    }, [mode, secondsLeft, running, pomosThisRound])

    // ─── On mount: close floating widget (we're on the full page now) ─────────
    useEffect(() => {
        closeWidget('pomodoro')
    }, []) // eslint-disable-line

    // ─── On unmount: if running → open floating widget ──────────────────────
    useEffect(() => {
        return () => {
            const saved = getPomodoroLiveState()
            if (saved?.running) {
                // Small delay to let Panel finish navigating before spawning widget
                setTimeout(() => openWidget('pomodoro'), 50)
            }
        }
    }, []) // eslint-disable-line

    const changeMode = useCallback((m) => {
        setRunning(false)
        clearInterval(intervalRef.current)
        setMode(m)
        setSecondsLeft(MODES[m].minutes * 60)
    }, [])

    const reset = () => {
        setRunning(false)
        clearInterval(intervalRef.current)
        setSecondsLeft(current.minutes * 60)
    }

    const skip = () => {
        if (mode === 'focus') {
            const newPomos = pomosThisRound + 1
            setPomosThisRound(newPomos)
            setSessions(s => s + 1)
            changeMode(newPomos % 4 === 0 ? 'long' : 'short')
        } else {
            changeMode('focus')
        }
    }

    const handleSoundChange = (id) => {
        if (!isPro) { setShowUpgrade(true); return }
        if (activeSound === id) {
            setActiveSound('none')
            if (audioRef.current) audioRef.current.pause()
        } else {
            setActiveSound(id)
        }
    }

    useEffect(() => {
        if (activeSound !== 'none' && running) {
            const sound = AMBIENT_SOUNDS.find(s => s.id === activeSound)
            if (sound?.url) {
                if (!audioRef.current) { audioRef.current = new Audio(sound.url); audioRef.current.loop = true }
                audioRef.current.src = sound.url
                audioRef.current.play().catch(() => { })
                audioRef.current.volume = 0.3
            }
        } else {
            audioRef.current?.pause()
        }
    }, [activeSound, running])

    useEffect(() => {
        if (running) {
            intervalRef.current = setInterval(() => {
                setSecondsLeft(s => {
                    if (s <= 1) {
                        clearInterval(intervalRef.current)
                        setRunning(false)
                        if (mode === 'focus') {
                            const newPomos = pomosThisRound + 1
                            setPomosThisRound(newPomos)
                            setSessions(prev => prev + 1)
                            const nextMode = newPomos % 4 === 0 ? 'long' : 'short'
                            if (soundEnabled) new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3').play().catch(() => { })
                            setMode(nextMode)
                            return MODES[nextMode].minutes * 60
                        } else {
                            if (soundEnabled) new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3').play().catch(() => { })
                            setMode('focus')
                            return MODES.focus.minutes * 60
                        }
                    }
                    return s - 1
                })
            }, 1000)
        } else {
            clearInterval(intervalRef.current)
        }
        return () => clearInterval(intervalRef.current)
    }, [running, mode])

    // Title bar while timer runs
    useEffect(() => {
        document.title = running ? `${formatTime(secondsLeft)} — ${current.label}` : 'StudyNeo'
        return () => { document.title = 'StudyNeo' }
    }, [secondsLeft, running])

    const pomoDots = Array.from({ length: 4 }, (_, i) => i < pomosThisRound % 4)

    return (
        <div className="page-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="page-header" style={{ width: '100%' }}>
                <div>
                    <h1 className="page-title">Modo Pomodoro</h1>
                    <p className="page-subtitle">Técnica de concentración por intervalos</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-3)' }}>
                        <Zap size={14} color="var(--orange)" />
                        {sessions} sesiones
                    </div>
                    {/* Minimize to floating widget */}
                    <button
                        onClick={() => { openWidget('pomodoro'); }}
                        title="Mini ventana"
                        style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '7px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)',
                            background: 'var(--bg-elevated)', color: 'var(--text-3)',
                            cursor: 'pointer', fontFamily: 'inherit', fontSize: '12px', fontWeight: 700, transition: 'all 0.18s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-border)'; e.currentTarget.style.color = 'var(--accent)' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-3)' }}
                    >
                        <Minimize2 size={13} /> Mini
                    </button>
                </div>
            </div>

            {/* Mode selector */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem', background: 'var(--bg-hover)', borderRadius: '12px', padding: '4px', border: '1px solid var(--border-subtle)' }}>
                {Object.entries(MODES).map(([key, m]) => (
                    <button
                        key={key}
                        onClick={() => changeMode(key)}
                        className={`mode-tab ${mode === key ? 'active' : ''}`}
                        style={{
                            ...(mode === key ? { background: 'var(--accent-dim)', color: 'var(--accent)', borderColor: 'var(--accent-border)' } : { color: 'var(--text-3)' }),
                            display: 'flex', alignItems: 'center', gap: '8px'
                        }}
                    >
                        <m.icon size={14} /> {m.label}
                    </button>
                ))}
            </div>

            {/* Circle timer */}
            <div className="pomodoro-circle-wrap">
                <svg width="260" height="260" viewBox="0 0 260 260">
                    <circle cx="130" cy="130" r={radius} fill="none" stroke="var(--bg-hover-2)" strokeWidth="12" />
                    <circle
                        cx="130" cy="130" r={radius}
                        fill="none"
                        stroke={current.color}
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                        transform="rotate(-90 130 130)"
                        style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.4s' }}
                    />
                </svg>
                <div className="pomodoro-time-display">
                    <span className="pomodoro-time" style={{ color: 'var(--text-1)' }}>{formatTime(secondsLeft)}</span>
                    <span className="pomodoro-mode-label" style={{ color: current.color }}>{current.label}</span>
                </div>
            </div>

            {/* Pomo dots */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                {pomoDots.map((filled, i) => (
                    <div key={i} style={{
                        width: '10px', height: '10px', borderRadius: '50%',
                        background: filled ? current.color : 'var(--bg-hover-2)',
                        transition: 'background 0.3s',
                    }} />
                ))}
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <button className="pomodoro-ctrl-btn secondary" onClick={reset} title="Reiniciar">
                    <RotateCcw size={18} />
                </button>
                <button
                    className="pomodoro-ctrl-btn primary"
                    onClick={() => setRunning(r => !r)}
                    style={{ background: current.color, color: 'var(--bg-base)' }}
                >
                    {running ? <Pause size={26} /> : <Play size={26} style={{ marginLeft: 3 }} />}
                </button>
                <button className="pomodoro-ctrl-btn secondary" onClick={skip} title="Saltar">
                    <SkipForward size={18} />
                </button>
            </div>

            {/* Info */}
            <div style={{ marginTop: '2.5rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', width: '100%', maxWidth: '480px' }}>
                {[
                    { label: 'Foco', value: `${MODES.focus.minutes} min`, color: 'var(--accent)' },
                    { label: 'Descanso', value: `${MODES.short.minutes} min`, color: 'var(--green)' },
                    { label: 'Descanso largo', value: `${MODES.long.minutes} min`, color: 'var(--orange)' },
                ].map(s => (
                    <div key={s.label} className="panel-card" style={{ textAlign: 'center', padding: '1rem' }}>
                        <p style={{ fontSize: '1.25rem', fontWeight: 900, color: s.color, letterSpacing: '-0.02em' }}>{s.value}</p>
                        <p style={{ fontSize: '0.6875rem', color: 'var(--text-3)', fontWeight: 600, marginTop: '2px' }}>{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Ambient Sound Selector */}
            <div style={{ marginTop: '2.5rem', width: '100%', maxWidth: '480px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <div style={{ padding: '4px 8px', borderRadius: '6px', background: 'var(--accent)', color: 'white', fontSize: '10px', fontWeight: 900 }}>PRO</div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ambiente de enfoque</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {AMBIENT_SOUNDS.map(s => (
                        <button
                            key={s.id}
                            onClick={() => handleSoundChange(s.id)}
                            style={{
                                flex: 1, padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--border-subtle)',
                                background: activeSound === s.id ? 'var(--accent-dim)' : 'var(--bg-surface)',
                                cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                                transition: 'all 0.2s', color: activeSound === s.id ? 'var(--accent)' : 'var(--text-3)',
                                position: 'relative', overflow: 'hidden'
                            }}
                        >
                            {!isPro && s.id !== 'none' && <div style={{ position: 'absolute', top: '4px', right: '4px' }}><Zap size={10} color="var(--accent)" /></div>}
                            <s.icon size={20} />
                            <span style={{ fontSize: '0.625rem', fontWeight: 700 }}>{s.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {showUpgrade && <ProUpgradeModal onClose={() => setShowUpgrade(false)} />}
        </div>
    )
}
