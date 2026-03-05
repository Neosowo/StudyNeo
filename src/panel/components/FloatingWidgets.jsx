/**
 * FloatingWidgets — persistent mini-windows that follow the user
 * across panel pages. Draggable, dismissible, collapsible.
 */
import { useState, useRef, useEffect, createContext, useContext } from 'react'
import {
    X, Minus, ChevronUp, Timer, Music, Play, Pause, Check,
    StickyNote, Layers, Heart, SkipForward, RotateCcw
} from 'lucide-react'
import { useAudioPlayer } from '../context/AudioPlayerContext'
import { useProContext } from '../../ProContext'

/* ── Widget context ──────────────────────────────────────── */
const WidgetCtx = createContext({})
export function useWidgets() { return useContext(WidgetCtx) }

export function WidgetProvider({ children }) {
    const [widgets, setWidgets] = useState([])

    const openWidget = (type, data = {}) => {
        setWidgets(prev => {
            if (prev.find(w => w.type === type)) {
                return prev.map(w => w.type === type ? { ...w, data: { ...w.data, ...data } } : w)
            }
            return [...prev, { id: `${type}-${Date.now()}`, type, data }]
        })
    }
    const closeWidget = (type) => setWidgets(prev => prev.filter(w => w.type !== type))
    const updateWidget = (type, data) => setWidgets(prev => prev.map(w => w.type === type ? { ...w, data: { ...w.data, ...data } } : w))
    const isOpen = (type) => widgets.some(w => w.type === type)

    return (
        <WidgetCtx.Provider value={{ openWidget, closeWidget, updateWidget, isOpen, widgets }}>
            {children}
            <WidgetLayer widgets={widgets} closeWidget={closeWidget} />
        </WidgetCtx.Provider>
    )
}

/* ── Draggable shell ─────────────────────────────────────── */
function DraggableWidget({ title, icon: Icon, color = 'var(--accent)', onClose, children, defaultPos, minWidth = 272 }) {
    const [pos, setPos] = useState(defaultPos || { x: window.innerWidth - 290, y: 80 })
    const [collapsed, setCollapsed] = useState(false)
    const dragging = useRef(false)
    const offset = useRef({ x: 0, y: 0 })
    const ref = useRef()

    useEffect(() => {
        const onMove = (e) => {
            if (!dragging.current) return
            const cx = e.touches ? e.touches[0].clientX : e.clientX
            const cy = e.touches ? e.touches[0].clientY : e.clientY
            setPos({
                x: Math.max(0, Math.min(window.innerWidth - minWidth, cx - offset.current.x)),
                y: Math.max(0, Math.min(window.innerHeight - 55, cy - offset.current.y)),
            })
        }
        const onUp = () => { dragging.current = false }
        window.addEventListener('mousemove', onMove)
        window.addEventListener('touchmove', onMove, { passive: false })
        window.addEventListener('mouseup', onUp)
        window.addEventListener('touchend', onUp)
        return () => {
            window.removeEventListener('mousemove', onMove)
            window.removeEventListener('touchmove', onMove)
            window.removeEventListener('mouseup', onUp)
            window.removeEventListener('touchend', onUp)
        }
    }, [minWidth])

    const startDrag = (e) => {
        dragging.current = true
        const cx = e.touches ? e.touches[0].clientX : e.clientX
        const cy = e.touches ? e.touches[0].clientY : e.clientY
        const rect = ref.current?.getBoundingClientRect()
        offset.current = { x: cx - rect.left, y: cy - rect.top }
        e.preventDefault()
    }

    return (
        <div ref={ref} style={{
            position: 'fixed', left: pos.x, top: pos.y, zIndex: 9000,
            width: `${minWidth}px`, borderRadius: '16px',
            background: 'var(--bg-surface)',
            border: '1.5px solid var(--border-subtle)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.35)',
            backdropFilter: 'blur(20px)',
            overflow: 'hidden', userSelect: 'none',
        }}>
            {/* Title bar */}
            <div onMouseDown={startDrag} onTouchStart={startDrag}
                style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '10px 12px', cursor: 'grab',
                    background: `linear-gradient(135deg, ${color}18, transparent)`,
                    borderBottom: collapsed ? 'none' : '1px solid var(--border-subtle)',
                }}>
                <div style={{ width: 24, height: 24, borderRadius: '7px', background: `${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={13} color={color} />
                </div>
                <span style={{ flex: 1, fontSize: '12px', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.01em' }}>{title}</span>
                <button onClick={() => setCollapsed(c => !c)} style={iconBtn}>
                    {collapsed ? <ChevronUp size={13} /> : <Minus size={13} />}
                </button>
                <button onClick={onClose} style={iconBtn}><X size={13} /></button>
            </div>
            {!collapsed && <div style={{ padding: '12px' }}>{children}</div>}
        </div>
    )
}
const iconBtn = { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-4)', display: 'flex', padding: '3px', borderRadius: '5px' }

/* ═══════════════════════════════════════════════════════════
   WIDGET: Pomodoro
═══════════════════════════════════════════════════════════ */
const POMO_KEY = 'sd_pomo_live'
const P_MODES = {
    focus: { label: 'Foco', color: 'var(--accent)', m: 25 },
    short: { label: 'Descanso', color: 'var(--green)', m: 5 },
    long: { label: 'Largo', color: 'var(--orange)', m: 15 },
}
function readPomo() { try { return JSON.parse(localStorage.getItem(POMO_KEY) || 'null') } catch { return null } }

function PomodoroWidget({ onClose }) {
    const sv = readPomo()
    const [mode, setMode] = useState(sv?.mode || 'focus')
    const [secs, setSecs] = useState(sv?.secondsLeft ?? 25 * 60)
    const [running, setRunning] = useState(sv?.running ?? false)
    const intRef = useRef(null)

    useEffect(() => { localStorage.setItem(POMO_KEY, JSON.stringify({ mode, secondsLeft: secs, running })) }, [mode, secs, running])

    useEffect(() => {
        if (running) {
            intRef.current = setInterval(() => setSecs(s => { if (s <= 1) { clearInterval(intRef.current); setRunning(false); return 0 } return s - 1 }), 1000)
        } else clearInterval(intRef.current)
        return () => clearInterval(intRef.current)
    }, [running])

    const switchMode = (m) => { clearInterval(intRef.current); setMode(m); setSecs(P_MODES[m].m * 60); setRunning(false) }
    const cfg = P_MODES[mode]
    const pct = ((cfg.m * 60 - secs) / (cfg.m * 60)) * 100
    const mm = String(Math.floor(secs / 60)).padStart(2, '0')
    const ss = String(secs % 60).padStart(2, '0')

    return (
        <DraggableWidget title="Pomodoro" icon={Timer} color={cfg.color} onClose={onClose} defaultPos={{ x: window.innerWidth - 290, y: 80 }}>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '10px' }}>
                {Object.entries(P_MODES).map(([k, m]) => (
                    <button key={k} onClick={() => switchMode(k)} style={{ flex: 1, padding: '5px 0', borderRadius: '7px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '10px', fontWeight: 700, transition: 'all .18s', background: mode === k ? m.color : 'var(--bg-hover)', color: mode === k ? 'white' : 'var(--text-4)' }}>
                        {k === 'focus' ? '🎯' : k === 'short' ? '☕' : '🌿'} {m.label}
                    </button>
                ))}
            </div>
            <div style={{ height: 3, background: 'var(--bg-hover-2)', borderRadius: 9999, overflow: 'hidden', marginBottom: 10 }}>
                <div style={{ height: '100%', width: `${pct}%`, background: cfg.color, transition: 'width .9s linear', borderRadius: 9999 }} />
            </div>
            <div style={{ textAlign: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums', color: 'var(--text-1)' }}>{mm}:{ss}</span>
                <p style={{ fontSize: 10, color: cfg.color, fontWeight: 800, marginTop: 2 }}>{cfg.label}</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setRunning(r => !r)} style={{ flex: 1, padding: 9, borderRadius: 10, border: 'none', background: cfg.color, color: 'white', fontWeight: 900, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                    {running ? <><Pause size={14} /> Pausar</> : <><Play size={14} style={{ marginLeft: 1 }} /> Iniciar</>}
                </button>
                <button onClick={() => { setRunning(false); setSecs(cfg.m * 60) }} style={{ padding: '9px 11px', borderRadius: 10, border: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)', color: 'var(--text-3)', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>↺</button>
            </div>
        </DraggableWidget>
    )
}

/* ═══════════════════════════════════════════════════════════
   WIDGET: Music mini-player (uses AudioPlayerContext)
═══════════════════════════════════════════════════════════ */

function fmtTime(s) {
    if (!s || isNaN(s)) return '0:00'
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
}

function MusicWidget({ onClose }) {
    const { isPro, proInfo, trialExpired } = useProContext()
    const { current, queue, idx, playing, progress, duration, volume, loading,
        togglePlay, nextTrack, prevTrack, seek, setVolume,
        isLiked, toggleLike } = useAudioPlayer()

    // trialExpired viene del ProContext (calculado en usePro con Object.freeze)
    // SEGURIDAD: no existe TRIAL_MILLIS aqui

    const liked = current ? isLiked(current.id) : false
    const isPlaylist = current?.type === 'playlist'

    return (
        <DraggableWidget title="Music Player" icon={Music} color="#1db954" onClose={onClose} defaultPos={{ x: window.innerWidth - 290, y: 300 }} minWidth={286}>
            {trialExpired ? (
                <div style={{ textAlign: 'center', padding: '1rem', background: 'linear-gradient(135deg, var(--bg-surface), var(--accent-dim))', borderRadius: 12 }}>
                    <div style={{ fontSize: 24, marginBottom: 8 }}>⏱️</div>
                    <p style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-1)' }}>Prueba finalizada</p>
                    <p style={{ fontSize: 10, color: 'var(--text-4)', marginBottom: 12 }}>Adquiere el Plan Pro para seguir usando todas las funciones.</p>
                </div>
            ) : !current ? (
                <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-4)' }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>🎵</div>
                    <p style={{ fontSize: 12, fontWeight: 600 }}>Ve al Music Player y añade links a la cola</p>
                </div>
            ) : (
                <>
                    {/* Thumbnail + info + like */}
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.875rem' }}>
                        {current.thumbnail
                            ? <img src={current.thumbnail} alt="" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                            : <div style={{ width: 48, height: 48, borderRadius: 8, background: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Music size={18} color="var(--text-4)" /></div>
                        }
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontWeight: 800, fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-1)' }}>{current.title || current.url}</p>
                            <p style={{ fontSize: '10px', color: 'var(--text-4)', fontWeight: 600, marginTop: 1 }}>{current.author || current.platform}</p>
                            <p style={{ fontSize: '9px', color: 'var(--text-4)', marginTop: 1 }}>{idx + 1} / {queue.length} en cola{isPlaylist ? ' · Playlist' : ''}</p>
                        </div>
                        <button onClick={() => current && toggleLike(current)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: liked ? '#e63946' : 'var(--text-4)', padding: '3px', borderRadius: 6, display: 'flex', flexShrink: 0, transition: 'color .2s' }}>
                            <Heart size={15} fill={liked ? '#e63946' : 'none'} />
                        </button>
                    </div>

                    {/* Embed Player for Spotify/SoundCloud */}
                    {(current.platform === 'spotify' || current.platform === 'soundcloud') && (
                        <div style={{ marginBottom: '0.875rem', borderRadius: 8, overflow: 'hidden', background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', height: 80 }}>
                            <iframe
                                src={current.platform === 'spotify' ? current.embedUrl : `https://w.soundcloud.com/player/?url=${encodeURIComponent(current.url)}&color=%23ff5500&auto_play=true&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`}
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                loading="lazy"
                            />
                        </div>
                    )}

                    {/* Seek bar — only for single YouTube videos */}
                    {!isPlaylist && current.platform === 'youtube' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                            <span style={{ fontSize: 9, color: 'var(--text-4)', fontWeight: 700, width: 28, textAlign: 'right' }}>{fmtTime((progress / 100) * duration)}</span>
                            <div onClick={e => { const r = e.currentTarget.getBoundingClientRect(); seek(((e.clientX - r.left) / r.width) * 100) }}
                                style={{ flex: 1, height: 4, background: 'var(--bg-hover-2)', borderRadius: 9999, cursor: 'pointer', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${progress || 0}%`, background: '#1db954', borderRadius: 9999, transition: 'width 0.5s linear' }} />
                            </div>
                            <span style={{ fontSize: 9, color: 'var(--text-4)', fontWeight: 700, width: 28 }}>{fmtTime(duration)}</span>
                        </div>
                    )}

                    {/* Controls — handled differently for YouTube vs Embeds */}
                    {current.platform === 'youtube' ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <button onClick={prevTrack} title="Anterior" style={mCtrl}><SkipForward size={14} style={{ transform: 'scaleX(-1)' }} /></button>
                            <button onClick={togglePlay} style={{ ...mCtrl, width: 38, height: 38, background: '#1db954', color: 'white', border: 'none', borderRadius: '50%' }}>
                                {loading ? <span style={{ fontSize: 10 }}>⏳</span> : playing ? <Pause size={16} /> : <Play size={16} style={{ marginLeft: 1 }} />}
                            </button>
                            <button onClick={nextTrack} title="Siguiente" style={mCtrl}><SkipForward size={14} /></button>
                            <input type="range" min={0} max={100} value={volume}
                                onChange={e => setVolume(Number(e.target.value))}
                                style={{ width: 56, accentColor: '#1db954', marginLeft: 4 }} />
                        </div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <button onClick={prevTrack} title="Anterior" style={mCtrl}><SkipForward size={14} style={{ transform: 'scaleX(-1)' }} /></button>
                            <span style={{ fontSize: '9px', color: 'var(--text-4)', fontWeight: 700, textAlign: 'center', flex: 1 }}>Usa el embed</span>
                            <button onClick={nextTrack} title="Siguiente" style={mCtrl}><SkipForward size={14} /></button>
                        </div>
                    )}
                </>
            )}
        </DraggableWidget>
    )
}
const mCtrl = { background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '50%', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-1)', flexShrink: 0 }

/* ═══════════════════════════════════════════════════════════
   WIDGET: Quick Note (sticky scratchpad)
═══════════════════════════════════════════════════════════ */
function QuickNoteWidget({ onClose }) {
    const [text, setText] = useState(() => { try { return localStorage.getItem('sd_quick_note') || '' } catch { return '' } })
    const timerRef = useRef(null)
    const handleChange = (v) => {
        setText(v)
        clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
            localStorage.setItem('sd_quick_note', v)
            // Disparar evento para que otros componentes se enteren
            window.dispatchEvent(new Event('storage'))
        }, 600)
    }
    return (
        <DraggableWidget title="Nota Rápida" icon={StickyNote} color="var(--yellow, #f2d48b)" onClose={onClose} defaultPos={{ x: 20, y: 120 }} minWidth={280}>
            <textarea
                value={text}
                onChange={e => handleChange(e.target.value)}
                placeholder="Escribe aquí... se guarda automáticamente"
                style={{
                    width: '100%', height: '160px', background: 'var(--bg-base)', border: '1px solid var(--border-subtle)',
                    borderRadius: '10px', padding: '10px 12px', color: 'var(--text-1)', fontFamily: 'inherit',
                    fontSize: '13px', resize: 'none', outline: 'none', lineHeight: 1.6,
                }}
            />
            <p style={{ fontSize: '10px', color: 'var(--text-4)', fontWeight: 600, marginTop: '6px', textAlign: 'right' }}>
                {text.length} caracteres • Guardado automáticamente
            </p>
        </DraggableWidget>
    )
}

/* ═══════════════════════════════════════════════════════════
   WIDGET: Tasks (pending tasks checklist)
═══════════════════════════════════════════════════════════ */
function TasksWidget({ onClose }) {
    const [tasks, setTasks] = useState(() => {
        try { return JSON.parse(localStorage.getItem('sd_tasks') || '[]') } catch { return [] }
    })

    const toggleTask = (id) => {
        const next = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t)
        setTasks(next)
        localStorage.setItem('sd_tasks', JSON.stringify(next))
    }

    const pending = tasks.filter(t => !t.done).slice(0, 7)
    const doneCount = tasks.filter(t => t.done).length

    return (
        <DraggableWidget title="Tareas" icon={Check} color="var(--green)" onClose={onClose} defaultPos={{ x: 20, y: 300 }} minWidth={280}>
            {/* Progress bar */}
            {tasks.length > 0 && (
                <div style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-4)' }}>Progreso del día</span>
                        <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--green)' }}>{doneCount}/{tasks.length}</span>
                    </div>
                    <div style={{ height: 3, background: 'var(--bg-hover-2)', borderRadius: 9999 }}>
                        <div style={{ height: '100%', width: `${tasks.length ? (doneCount / tasks.length) * 100 : 0}%`, background: 'var(--green)', borderRadius: 9999, transition: 'width .4s' }} />
                    </div>
                </div>
            )}

            {pending.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-4)' }}>
                    <div style={{ fontSize: 24, marginBottom: 6 }}>✅</div>
                    <p style={{ fontSize: 12, fontWeight: 700 }}>¡Todo completado!</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '200px', overflowY: 'auto' }}>
                    {pending.map(t => (
                        <button key={t.id} onClick={() => toggleTask(t.id)}
                            style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', transition: 'all .15s' }}>
                            <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid var(--green)', flexShrink: 0, marginTop: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {t.done && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)' }} />}
                            </div>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-2)', lineHeight: 1.4 }}>{t.text || t.title || t.name || 'Tarea'}</span>
                        </button>
                    ))}
                </div>
            )}
            {tasks.filter(t => !t.done).length > 7 && (
                <p style={{ fontSize: 10, color: 'var(--text-4)', fontWeight: 600, marginTop: 6, textAlign: 'center' }}>
                    +{tasks.filter(t => !t.done).length - 7} tareas más
                </p>
            )}
        </DraggableWidget>
    )
}

/* ═══════════════════════════════════════════════════════════
   WIDGET: Flashcards (mini reviewer)
═══════════════════════════════════════════════════════════ */
function FlashcardsWidget({ data, onClose }) {
    const decks = (() => { try { return JSON.parse(localStorage.getItem('sd_flashcard_decks') || '[]') } catch { return [] } })()
    const allCards = decks.flatMap(d => (d.cards || []).map(c => ({ ...c, deckName: d.name })))

    const [idx, setIdx] = useState(0)
    const [flipped, setFlipped] = useState(false)
    const [reviewDeck] = useState(data?.deckId ? decks.find(d => d.id === data.deckId) : null)
    const cards = reviewDeck ? (reviewDeck.cards || []) : allCards

    const card = cards[idx]
    const total = cards.length
    const hasNext = idx < total - 1
    const hasPrev = idx > 0

    const next = () => { setIdx(i => i + 1); setFlipped(false) }
    const prev = () => { setIdx(i => i - 1); setFlipped(false) }

    return (
        <DraggableWidget title="Flashcards" icon={Layers} color="var(--blue, #64b4f2)" onClose={onClose} defaultPos={{ x: window.innerWidth - 290, y: 460 }}>
            {!card ? (
                <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-4)' }}>
                    <div style={{ fontSize: 24, marginBottom: 6 }}>🃏</div>
                    <p style={{ fontSize: 12, fontWeight: 700 }}>No hay tarjetas. Crea un deck primero.</p>
                </div>
            ) : (
                <>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-4)', marginBottom: '8px', textAlign: 'center' }}>
                        {card.deckName || reviewDeck?.name} • {idx + 1}/{total}
                    </div>
                    {/* Card flip */}
                    <div
                        onClick={() => setFlipped(f => !f)}
                        style={{
                            minHeight: '100px', borderRadius: 12, border: `1.5px solid ${flipped ? 'var(--green)' : 'var(--border-default)'}`,
                            background: flipped ? 'var(--green-dim, rgba(126,212,168,0.10))' : 'var(--bg-elevated)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                            padding: '12px', marginBottom: '10px', transition: 'all .25s', textAlign: 'center',
                        }}
                    >
                        <span style={{ fontSize: '13px', fontWeight: 700, color: flipped ? 'var(--green)' : 'var(--text-1)', lineHeight: 1.5 }}>
                            {flipped ? (card.back || card.answer || card.b) : (card.front || card.question || card.f || card.term)}
                        </span>
                    </div>
                    {!flipped && <p style={{ fontSize: 10, color: 'var(--text-4)', textAlign: 'center', marginBottom: 8, fontWeight: 600 }}>Toca para ver la respuesta</p>}

                    {/* Nav */}
                    <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={prev} disabled={!hasPrev} style={{ flex: 1, padding: '7px', borderRadius: 9, border: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)', cursor: hasPrev ? 'pointer' : 'not-allowed', color: hasPrev ? 'var(--text-2)' : 'var(--text-4)', fontWeight: 700, fontSize: 12, fontFamily: 'inherit' }}>← Anterior</button>
                        <button onClick={next} disabled={!hasNext} style={{ flex: 1, padding: '7px', borderRadius: 9, border: 'none', background: hasNext ? 'var(--blue, #64b4f2)' : 'var(--bg-hover)', cursor: hasNext ? 'pointer' : 'not-allowed', color: hasNext ? 'white' : 'var(--text-4)', fontWeight: 700, fontSize: 12, fontFamily: 'inherit' }}>Siguiente →</button>
                    </div>
                </>
            )}
        </DraggableWidget>
    )
}

/* ═══════════════════════════════════════════════════════════
   WIDGET: Habits (today's habits checklist)
═══════════════════════════════════════════════════════════ */
function HabitsWidget({ onClose }) {
    const today = new Date().toISOString().slice(0, 10)
    const [habits, setHabits] = useState(() => {
        try { return JSON.parse(localStorage.getItem('sd_habits') || '[]') } catch { return [] }
    })

    const toggle = (id) => {
        const next = habits.map(h => {
            if (h.id !== id) return h
            const completedDates = h.completedDates || []
            const done = completedDates.includes(today)
            return { ...h, completedDates: done ? completedDates.filter(d => d !== today) : [...completedDates, today] }
        })
        setHabits(next)
        localStorage.setItem('sd_habits', JSON.stringify(next))
    }

    const isDone = (h) => (h.completedDates || []).includes(today)
    const doneN = habits.filter(isDone).length

    return (
        <DraggableWidget title="Hábitos de Hoy" icon={Heart} color="var(--orange, #f2c48b)" onClose={onClose} defaultPos={{ x: 20, y: 500 }} minWidth={280}>
            {habits.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-4)' }}>
                    <div style={{ fontSize: 24, marginBottom: 6 }}>💪</div>
                    <p style={{ fontSize: 12, fontWeight: 700 }}>Aún no tienes hábitos. ¡Crea algunos!</p>
                </div>
            ) : (
                <>
                    <div style={{ marginBottom: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-4)' }}>Hoy</span>
                            <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--orange)' }}>{doneN}/{habits.length}</span>
                        </div>
                        <div style={{ height: 3, background: 'var(--bg-hover-2)', borderRadius: 9999 }}>
                            <div style={{ height: '100%', width: `${habits.length ? (doneN / habits.length) * 100 : 0}%`, background: 'var(--orange)', borderRadius: 9999, transition: 'width .4s' }} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', maxHeight: '180px', overflowY: 'auto' }}>
                        {habits.map(h => {
                            const done = isDone(h)
                            return (
                                <button key={h.id} onClick={() => toggle(h.id)}
                                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 8, border: `1px solid ${done ? 'var(--orange-dim,rgba(242,196,139,.3))' : 'var(--border-subtle)'}`, background: done ? 'var(--orange-dim, rgba(242,196,139,.12))' : 'var(--bg-elevated)', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', transition: 'all .15s' }}>
                                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: done ? 'var(--orange)' : 'transparent', border: `2px solid ${done ? 'var(--orange)' : 'var(--border-strong)'}`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s' }}>
                                        {done && <Check size={8} color="white" />}
                                    </div>
                                    <span style={{ fontSize: 12, fontWeight: 600, color: done ? 'var(--text-3)' : 'var(--text-2)', textDecoration: done ? 'line-through' : 'none' }}>
                                        {h.icon || h.emoji || '•'} {h.name || h.title}
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                </>
            )}
        </DraggableWidget>
    )
}

/* ═══════════════════════════════════════════════════════════
   WIDGET: Layer (renders all active widgets)
═══════════════════════════════════════════════════════════ */
function WidgetLayer({ widgets, closeWidget }) {
    return (
        <>
            {widgets.map(w => {
                if (w.type === 'pomodoro') return <PomodoroWidget key={w.id} data={w.data} onClose={() => closeWidget('pomodoro')} />
                if (w.type === 'music') return <MusicWidget key={w.id} data={w.data} onClose={() => closeWidget('music')} />
                if (w.type === 'quicknote') return <QuickNoteWidget key={w.id} data={w.data} onClose={() => closeWidget('quicknote')} />
                if (w.type === 'tasks') return <TasksWidget key={w.id} data={w.data} onClose={() => closeWidget('tasks')} />
                if (w.type === 'flashcards') return <FlashcardsWidget key={w.id} data={w.data} onClose={() => closeWidget('flashcards')} />
                if (w.type === 'habits') return <HabitsWidget key={w.id} data={w.data} onClose={() => closeWidget('habits')} />
                return null
            })}
        </>
    )
}
