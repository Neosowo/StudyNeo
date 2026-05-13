import { useState, useEffect, useRef, useCallback } from 'react'
import { Play, Pause, RotateCcw, SkipForward, Timer as TimerIcon, Clock, BookOpen, Target, Coffee, Moon, Link2 } from 'lucide-react'
import Stopwatch from './Stopwatch'
import { storage, KEYS } from '../utils/storage'
import { getT } from '../locales'
import { playClick, playStart, playPause, playComplete } from '../utils/sounds'

const getModes = (t) => [
  { id: 'pomodoro',  label: t.timer_pomo,    Icon: TimerIcon },
  { id: 'custom',   label: t.timer_timer, Icon: Clock },
  { id: 'stopwatch',label: t.timer_study,      Icon: BookOpen },
]

const getPhases = (t) => [
  { id: 'focus', label: t.timer_focus,         Icon: Target },
  { id: 'short', label: t.timer_short,           Icon: Coffee },
  { id: 'long',  label: t.timer_long,           Icon: Moon },
]

/* ---- helpers -------------------------------------------- */
function secsFor(ph, cfg) {
  if (ph === 'focus') return cfg.pomodoro * 60
  if (ph === 'short') return cfg.short * 60
  return cfg.long * 60
}

function fmtTime(s) {
  if (s >= 3600) {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = (s % 60).toString().padStart(2, '0')
    return `${h}:${m.toString().padStart(2,'0')}:${sec}`
  }
  const m = Math.floor(s / 60).toString().padStart(2, '0')
  const sec = (s % 60).toString().padStart(2, '0')
  return `${m}:${sec}`
}

/* ---------------------------------------------------------- */
export default function Timer({ externalSettings, onSessionComplete, onToast, linkedTodos = [], lang = 'es', isZen }) {
  const settings = externalSettings || { pomodoro: 25, short: 5, long: 15, longBreakInterval: 4, autoStart: false }
  const t = getT(lang)

  const [mode,           setMode]           = useState('pomodoro')
  
  // Pomodoro State
  const [pomoTime,       setPomoTime]       = useState(settings.pomodoro * 60)
  const [pomoRunning,    setPomoRunning]    = useState(false)
  const [pomoPhase,      setPomoPhase]      = useState('focus')
  
  // Custom Timer State
  const [customTime,     setCustomTime]     = useState(10 * 60)
  const [customRunning,  setCustomRunning]  = useState(false)
  
  const [customMins,     setCustomMins]     = useState(10)
  const [customInput,    setCustomInput]    = useState('10')
  const [editingCust,    setEditingCust]    = useState(false)
  
  const [sessions,       setSessions]       = useState(0)
  const [totalSecs,      setTotalSecs]      = useState(0)
  const [linkedTask,     setLinkedTask]     = useState(null)
  const [linkOpen,       setLinkOpen]       = useState(false)

  const intervalRef    = useRef(null)
  const prevSettingRef = useRef(settings)
  const linkRef        = useRef(null)

  /* Persist stats */
  useEffect(() => {
    storage.set('postpone_timer_sessions', sessions)
    storage.set('postpone_timer_total', totalSecs)
  }, [sessions, totalSecs])

  /* Load persisted stats */
  useEffect(() => {
    setSessions(storage.get('postpone_timer_sessions', 0))
    setTotalSecs(storage.get('postpone_timer_total', 0))
  }, [])

  /* Sync settings */
  useEffect(() => {
    const prev = prevSettingRef.current
    if (!pomoRunning && (prev.pomodoro !== settings.pomodoro || prev.short !== settings.short || prev.long !== settings.long)) {
      setPomoTime(secsFor(pomoPhase, settings))
    }
    prevSettingRef.current = settings
  }, [settings.pomodoro, settings.short, settings.long, pomoPhase, pomoRunning]) // eslint-disable-line

  /* Close link dropdown on outside click */
  useEffect(() => {
    if (!linkOpen) return
    const h = (e) => { if (linkRef.current && !linkRef.current.contains(e.target)) setLinkOpen(false) }
    const t = setTimeout(() => document.addEventListener('mousedown', h), 10)
    return () => { clearTimeout(t); document.removeEventListener('mousedown', h) }
  }, [linkOpen])

  const stopPomo = useCallback(() => setPomoRunning(false), [])
  const stopCust = useCallback(() => setCustomRunning(false), [])

  const handlePomoComplete = useCallback(() => {
    stopPomo()
    playComplete()
    if (pomoPhase === 'focus') {
      const n = sessions + 1
      setSessions(n)
      setTotalSecs(p => p + settings.pomodoro * 60)
      onSessionComplete?.(n)
      onToast?.('Sesión completada', 'success')
      const next = n % settings.longBreakInterval === 0 ? 'long' : 'short'
      setPomoPhase(next)
      setPomoTime(secsFor(next, settings))
    } else {
      onToast?.('Descanso terminado', 'info')
      setPomoPhase('focus')
      setPomoTime(secsFor('focus', settings))
    }
    if (settings.autoStart) setTimeout(() => setPomoRunning(true), 600)
  }, [pomoPhase, sessions, settings, stopPomo, onSessionComplete, onToast])

  const handleCustomComplete = useCallback(() => {
    stopCust()
    playComplete()
    onToast?.('Tiempo completado', 'success')
    setCustomTime(customMins * 60)
  }, [customMins, stopCust, onToast])

  // Pomodoro Interval
  useEffect(() => {
    let iv
    if (pomoRunning) {
      iv = setInterval(() => setPomoTime(p => Math.max(0, p - 1)), 1000)
    }
    return () => clearInterval(iv)
  }, [pomoRunning])

  useEffect(() => {
    if (pomoRunning && pomoTime === 0) {
      handlePomoComplete()
    }
  }, [pomoTime, pomoRunning, handlePomoComplete])

  // Custom Timer Interval
  useEffect(() => {
    let iv
    if (customRunning && !linkedTask) {
      iv = setInterval(() => setCustomTime(p => Math.max(0, p - 1)), 1000)
    }
    return () => clearInterval(iv)
  }, [customRunning, linkedTask])

  useEffect(() => {
    if (customRunning && customTime === 0 && !linkedTask) {
      handleCustomComplete()
    }
  }, [customTime, customRunning, handleCustomComplete, linkedTask])

  // Real-time countdown for linked tasks
  useEffect(() => {
    if (!linkedTask) return
    const calc = () => {
      const msLeft = new Date(linkedTask.dueDate) - new Date()
      if (msLeft <= 0) {
        setCustomTime(0)
        setLinkedTask(null)
        playComplete()
        onToast?.('Tiempo agotado para la tarea', 'info')
      } else {
        setCustomTime(Math.floor(msLeft / 1000))
      }
    }
    calc()
    const iv = setInterval(calc, 1000)
    return () => clearInterval(iv)
  }, [linkedTask, onToast])

  const toggleRunning = () => {
    if (mode === 'pomodoro') {
      if (!pomoRunning) playStart(); else playPause();
      setPomoRunning(!pomoRunning)
    } else {
      if (!customRunning) playStart(); else playPause();
      setCustomRunning(!customRunning)
    }
  }

  const reset = () => {
    if (mode === 'pomodoro') {
      stopPomo()
      setPomoTime(secsFor(pomoPhase, settings))
    } else {
      stopCust()
      if (linkedTask) {
        const msLeft = new Date(linkedTask.dueDate) - new Date()
        setCustomTime(Math.max(0, Math.floor(msLeft / 1000)))
      } else {
        setCustomTime(customMins * 60)
      }
    }
  }

  const switchMode = (m) => {
    setMode(m)
  }

  const switchPhase = (ph) => { stopPomo(); setPomoPhase(ph); setPomoTime(secsFor(ph, settings)) }

  const linkTask = (todo) => {
    setLinkedTask(todo)
    setLinkOpen(false)
    setMode('custom')
    const msLeft = new Date(todo.dueDate) - new Date()
    const mins = Math.max(1, Math.round(msLeft / 60000))
    setCustomMins(mins)
    setCustomInput(String(mins))
    setCustomTime(mins * 60)
    stopCust()
    onToast?.(`Temporizador configurado para: ${todo.text}`, 'info')
  }

  const labelText = linkedTask ? 'Tiempo restante'
    : mode === 'custom' ? 'Temporizador'
    : pomoPhase === 'focus' ? 'Enfoque'
    : pomoPhase === 'short' ? 'Descanso corto'
    : 'Descanso largo'

  const timeLeft = mode === 'pomodoro' ? pomoTime : (mode === 'custom' ? customTime : 0)
  const running = mode === 'pomodoro' ? pomoRunning : (mode === 'custom' ? customRunning : false)

  const sessionDots = Array.from({ length: settings.longBreakInterval }, (_, i) => i)

  /* Todos con fecha límite disponibles para vincular */
  const availableTodos = linkedTodos.filter(t => !t.done && t.dueDate && new Date(t.dueDate) > new Date())

  return (
    <div className="timer-section">

      {/* Shared Mode Tabs */}
      <div className="timer-modes enter-1">
        {getModes(t).map(({ id, label, Icon }) => (
          <button key={id} className={`mode-tab ${mode === id ? 'active' : ''}`} onClick={() => switchMode(id)}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* STOPWATCH VIEW (Preserved in DOM) */}
      <div style={{ display: mode === 'stopwatch' ? 'block' : 'none' }}>
        <div className="enter-2"><Stopwatch isZen={isZen} /></div>
      </div>

      {/* POMODORO & CUSTOM VIEW */}
      <div style={{ display: mode !== 'stopwatch' ? 'block' : 'none' }}>

      {/* Phase sub-tabs & Custom Picker */}
      <div className="timer-sub-menu enter-2">
        {mode === 'pomodoro' ? (
          <div className="timer-phases">
            {getPhases(t).map(({ id, label, Icon }) => (
              <button key={id} className={`phase-tab ${pomoPhase === id ? 'active' : ''}`} onClick={() => switchPhase(id)}>
                <Icon size={12} /> {label}
              </button>
            ))}
          </div>
        ) : linkedTask ? (
          <div className="custom-timer-row">
            <span className="custom-timer-label" style={{color: 'var(--accent)'}}>Cuenta regresiva activa</span>
          </div>
        ) : (
          <div className="custom-timer-row">
            <span className="custom-timer-label">Duración:</span>
            {editingCust ? (
              <input
                autoFocus type="number" min={1} max={180}
                className="custom-timer-input"
                value={customInput}
                onChange={e => setCustomInput(e.target.value)}
                onBlur={() => {
                  const v = Math.max(1, Math.min(180, parseInt(customInput) || 10))
                  setCustomMins(v); setCustomInput(String(v)); setCustomTime(v * 60); setEditingCust(false)
                }}
                onKeyDown={e => e.key === 'Enter' && e.target.blur()}
              />
            ) : (
              <button className="custom-timer-display" onClick={() => { setEditingCust(true); setCustomInput(String(customMins)) }}>
                {customMins} min
              </button>
            )}
          </div>
        )}
      </div>

      {/* Giant Clock */}
      <div className="study-clock-wrap enter-3">
        <div className="study-clock">{fmtTime(timeLeft)}</div>
        <div className="study-clock-label">{labelText}</div>

        {mode === 'pomodoro' && pomoPhase === 'focus' && (
          <div className="session-count">
            {sessionDots.map(i => (
              <div key={i} className={`session-dot ${i < (sessions % settings.longBreakInterval) ? 'done' : ''}`} />
            ))}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="timer-controls enter-4" style={{ opacity: linkedTask ? 0.3 : 1, pointerEvents: linkedTask ? 'none' : 'auto' }}>
        <button className="ctrl-btn ctrl-btn-secondary" onClick={reset} title="Reiniciar">
          <RotateCcw size={18} />
        </button>

        <button
          className={`ctrl-btn ctrl-btn-primary ${running ? 'running' : ''}`}
          onClick={toggleRunning}
          title={running ? 'Pausar' : 'Iniciar'}
        >
          {running ? <Pause size={28} /> : <Play size={28} style={{ marginLeft: 2 }} />}
        </button>

        <button className="ctrl-btn ctrl-btn-secondary" onClick={() => { if(mode==='pomodoro') handlePomoComplete(); else handleCustomComplete() }} title="Saltar">
          <SkipForward size={18} />
        </button>
      </div>

      {/* Link to task */}
      {mode === 'custom' && linkedTodos.length > 0 && (
        <div className="timer-link-wrap enter-5" ref={linkRef}>
          <button
            className={`timer-link-btn ${linkedTask ? 'linked' : ''}`}
            onClick={() => setLinkOpen(o => !o)}
          >
            <Link2 size={13} />
            {linkedTask ? `${t.timer_link}: ${linkedTask.text.slice(0, 22)}…` : t.timer_link}
          </button>

          {linkOpen && (
            <div className="timer-link-dropdown animate-scale">
              <p className="timer-link-header">{t.timer_link}</p>
              
              {availableTodos.length === 0 ? (
                <p className="timer-link-empty" style={{fontSize: 12, padding: 10, textAlign:'center', color:'var(--text-4)'}}>{t.no_active_tasks}</p>
              ) : (
                availableTodos.map(t => {
                  const msLeft = new Date(t.dueDate) - new Date()
                  const hLeft  = Math.floor(msLeft / 3600000)
                  const mLeft  = Math.floor((msLeft % 3600000) / 60000)
                  const label  = hLeft > 0 ? `${hLeft}h ${mLeft}m restantes` : `${mLeft}m restantes`
                  return (
                    <button key={t.id} className="timer-link-item" onClick={() => linkTask(t)}>
                      <span className="timer-link-item-text">{t.text}</span>
                      <span className="timer-link-item-time">{label}</span>
                    </button>
                  )
                })
              )}
              
              {linkedTask && (
                <button className="timer-link-clear" onClick={() => { setLinkedTask(null); stopCust(); setCustomTime(customMins * 60) }}>
                  Desvincular
                </button>
              )}
            </div>
          )}
        </div>
      )}

      </div>{/* END POMODORO & CUSTOM VIEW */}

    </div>
  )
}
